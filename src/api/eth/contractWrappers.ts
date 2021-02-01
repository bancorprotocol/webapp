import {
  buildTokenContract,
  buildNetworkContract,
  buildV2Converter,
  buildRegistryContract,
  buildLiquidityProtectionContract,
  buildLiquidityProtectionSettingsContract,
  buildAddressLookupContract,
  buildLiquidityProtectionStoreContract
} from "./contractTypes";
import { zeroAddress } from "../helpers";
import { fromPairs, toPairs } from "lodash";
import { EthNetworks, getWeb3, web3 } from "@/api/web3";
import Web3 from "web3";
import {
  liquidityProtectionSettingsShape,
  liquidityProtectionShape,
  protectedPositionShape
} from "./shapes";
import { MultiCall } from "eth-multicall";
import {
  LiquidityProtectionSettings,
  ProtectedLiquidity,
  RawLiquidityProtectionSettings,
  RegisteredContracts
} from "@/types/bancor";
import { asciiToHex } from "web3-utils";
import { contractAddresses$ } from "../observables";

export const getApprovedBalanceWei = async ({
  tokenAddress,
  owner,
  spender
}: {
  tokenAddress: string;
  owner: string;
  spender: string;
}) => {
  const tokenContract = buildTokenContract(tokenAddress);
  const approvedFromTokenBalance = await tokenContract.methods
    .allowance(owner, spender)
    .call();
  return approvedFromTokenBalance;
};

export const getReturnByPath = async ({
  networkContract,
  path,
  amount,
  web3
}: {
  networkContract: string;
  path: string[];
  amount: string;
  web3: Web3;
}): Promise<string> => {
  const contract = buildNetworkContract(networkContract, web3);
  return contract.methods.rateByPath(path, amount).call();
};

export const liquidationLimit = async ({
  converterContract,
  poolTokenAddress,
  web3
}: {
  converterContract: string;
  poolTokenAddress: string;
  web3: Web3;
}) => {
  const contract = buildV2Converter(converterContract, web3);
  return contract.methods.liquidationLimit(poolTokenAddress).call();
};

export const fetchPoolToken = async ({
  anchorContract,
  reserveTokenAddress,
  web3
}: {
  anchorContract: string;
  reserveTokenAddress: string;
  web3: Web3;
}) => {
  const contract = buildV2Converter(anchorContract, web3);
  return contract.methods.poolToken(reserveTokenAddress).call();
};

export const getConvertersByAnchors = async ({
  anchorAddresses,
  converterRegistryAddress,
  web3
}: {
  anchorAddresses: string[];
  converterRegistryAddress: string;
  web3: Web3;
}) => {
  const registryContract = buildRegistryContract(
    converterRegistryAddress,
    web3
  );
  return registryContract.methods
    .getConvertersByAnchors(anchorAddresses)
    .call();
};

export const getAnchors = async (
  converterRegistryAddress: string,
  web3: Web3
) => {
  const registryContract = buildRegistryContract(
    converterRegistryAddress,
    web3
  );
  return registryContract.methods.getAnchors().call();
};

export const getConvertibleTokenAnchors = async ({
  converterRegistryAddress,
  tokenAddress,
  web3
}: {
  converterRegistryAddress: string;
  tokenAddress: string;
  web3: Web3;
}) => {
  const registryContract = buildRegistryContract(
    converterRegistryAddress,
    web3
  );
  return registryContract.methods
    .getConvertibleTokenAnchors(tokenAddress)
    .call();
};

export const conversionPath = async ({
  networkContractAddress,
  from,
  to,
  web3
}: {
  networkContractAddress: string;
  from: string;
  to: string;
  web3: Web3;
}) => {
  const networkContract = buildNetworkContract(networkContractAddress, web3);
  return networkContract.methods.conversionPath(from, to).call();
};

export const getTokenSupplyWei = async (tokenContractAddress: string) => {
  const contract = buildTokenContract(tokenContractAddress);
  return contract.methods.totalSupply().call();
};

export const existingPool = async (
  converterRegistry: string,
  poolType: number,
  reserveTokenAddresses: string[],
  reserveWeights: string[],
  network: EthNetworks
): Promise<string | false> => {
  const contract = buildRegistryContract(converterRegistry, getWeb3(network));
  const res = await contract.methods
    .getLiquidityPoolByConfig(poolType, reserveTokenAddresses, reserveWeights)
    .call();

  if (res == zeroAddress) return false;
  return res;
};

const throwIfNotContract = (contractAddress: string) => {
  if (contractAddress == "") throw new Error("Passed contract is empty");
  const isValidAddress = web3.utils.isAddress(contractAddress);
  if (!isValidAddress)
    throw new Error(`${contractAddress} is an invalid contract address`);
};

export const getRemoveLiquidityReturn = async (
  protectionContract: string,
  id: string,
  ppm: string,
  removeTimestamp: number,
  web3: Web3
) => {
  throwIfNotContract(protectionContract);
  const contract = buildLiquidityProtectionContract(protectionContract, web3);

  const res = await contract.methods
    .removeLiquidityReturn(id, ppm, String(removeTimestamp))
    .call();

  const keys = ["targetAmount", "baseAmount", "networkAmount"];
  const pairs = toPairs(res).map(([, value], index) => [keys[index], value]);

  return fromPairs(pairs) as {
    targetAmount: string;
    baseAmount: string;
    networkAmount: string;
  };

  // targetAmount - expected return amount in the reserve token
  // baseAmount - actual return amount in the reserve token
  // networkAmount - compensation in the network token
};

export const fetchLiquidityProtectionSettings = async ({
  settingsContractAddress,
  protectionContractAddress
}: {
  settingsContractAddress: string;
  protectionContractAddress: string;
}) => {
  // @ts-ignore
  const ethMulti = new MultiCall(web3);

  const [[settings], [protection]] = ((await ethMulti.all([
    [liquidityProtectionSettingsShape(settingsContractAddress)],
    [liquidityProtectionShape(protectionContractAddress)]
  ])) as [unknown, unknown]) as [
    RawLiquidityProtectionSettings[],
    { govToken: string }[]
  ];

  const newSettings = {
    contract: settingsContractAddress,
    minDelay: Number(settings.minProtectionDelay),
    maxDelay: Number(settings.maxProtectionDelay),
    lockedDelay: Number(settings.lockDuration),
    govToken: protection.govToken,
    networkToken: settings.networkToken,
    defaultNetworkTokenMintingLimit: settings.defaultNetworkTokenMintingLimit
  } as LiquidityProtectionSettings;
  return newSettings;
};

export const fetchContracts = async () => {};

export const fetchContractAddresses = async (
  contractRegistry: string
): Promise<RegisteredContracts> => {
  if (!contractRegistry || !web3.utils.isAddress(contractRegistry))
    throw new Error("Must pass valid address");

  // @ts-ignore
  const ethMulti = new MultiCall(web3);

  const hardCodedBytes: RegisteredContracts = {
    BancorNetwork: asciiToHex("BancorNetwork"),
    BancorConverterRegistry: asciiToHex("BancorConverterRegistry"),
    LiquidityProtectionStore: asciiToHex("LiquidityProtectionStore"),
    LiquidityProtection: asciiToHex("LiquidityProtection"),
    StakingRewards: asciiToHex("StakingRewards")
  };

  const hardCodedShape = (
    contractAddress: string,
    label: string,
    ascii: string
  ) => {
    const contract = buildAddressLookupContract(contractAddress);
    return {
      [label]: contract.methods.addressOf(ascii)
    };
  };

  const arrBytes = toPairs(hardCodedBytes) as [string, string][];

  try {
    const hardCodedShapes = arrBytes.map(([label, ascii]) =>
      hardCodedShape(contractRegistry, label, ascii)
    );
    const [contractAddresses] = await ethMulti.all([hardCodedShapes]);

    const registeredContracts = Object.assign(
      {},
      ...contractAddresses
    ) as RegisteredContracts;

    return registeredContracts;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchLiquidityProtectionSettingsContract = async (
  liquidityProtectionContract: string
): Promise<string> => {
  try {
    const contract = buildLiquidityProtectionContract(
      liquidityProtectionContract
    );
    return contract.methods.settings().call();
  } catch (e) {
    const error = `Failed fetching settings contract via address ${liquidityProtectionContract}`;
    console.error(error);
    throw new Error(error);
  }
};

export const fetchMinLiqForMinting = async (
  protectionSettingsContract: string
) => {
  const contract = buildLiquidityProtectionSettingsContract(
    protectionSettingsContract
  );

  return contract.methods.minNetworkTokenLiquidityForMinting().call();
};

export const fetchWhiteListedV1Pools = async (
  liquidityProtectionSettingsAddress: string
) => {
  try {
    throwIfNotContract(liquidityProtectionSettingsAddress);
    const liquidityProtection = buildLiquidityProtectionSettingsContract(
      liquidityProtectionSettingsAddress
    );
    const whitelistedPools = await liquidityProtection.methods
      .poolWhitelist()
      .call();

    return whitelistedPools;
  } catch (e) {
    console.error(
      "Failed fetching whitelisted pools with address",
      liquidityProtectionSettingsAddress
    );
    throw new Error(
      `Failed fetching whitelisted pools with address ${liquidityProtectionSettingsAddress}`
    );
  }
};

export const fetchPositionIds = async (
  currentUser: string,
  liquidityStore: string
) => {
  throwIfNotContract(liquidityStore);
  const contract = buildLiquidityProtectionStoreContract(liquidityStore);
  try {
    const positionIds = await contract.methods
      .protectedLiquidityIds(currentUser)
      .call();

    return positionIds;
  } catch (e) {
    throw new Error(`Failed fetching position ids ${e}`);
  }
};

export const fetchPositionsMulti = async (
  positionIds: string[],
  liquidityStore: string
): Promise<ProtectedLiquidity[]> => {
  const positionShapes = positionIds.map(id =>
    protectedPositionShape(liquidityStore, id)
  );

  // @ts-ignore
  const ethMulti = new MultiCall(web3);
  const [multiPositions] = await ethMulti.all([positionShapes]);

  const keys = [
    "owner",
    "poolToken",
    "reserveToken",
    "poolAmount",
    "reserveAmount",
    "reserveRateN",
    "reserveRateD",
    "timestamp",
    "id"
  ];

  const protectedLiquidity = multiPositions
    .map(res => ({ ...res.position, "8": res.positionId }))
    .map(res =>
      fromPairs(keys.map((key, index) => [key, res[index]]))
    ) as ProtectedLiquidity[];

  return protectedLiquidity;
};
