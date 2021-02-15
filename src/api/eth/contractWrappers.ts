import {
  buildTokenContract,
  buildNetworkContract,
  buildV2Converter,
  buildRegistryContract,
  buildLiquidityProtectionContract,
  buildLiquidityProtectionSettingsContract
} from "./contractTypes";
import { zeroAddress } from "../helpers";
import { fromPairs, toPairs } from "lodash";
import { EthNetworks, getWeb3 } from "@/api/web3";
import Web3 from "web3";

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

export const getRemoveLiquidityReturn = async (
  protectionContract: string,
  id: string,
  ppm: string,
  removeTimestamp: number,
  web3: Web3
) => {
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

export const addLiquidityDisabled = async (
  settingsContract: string,
  poolId: string,
  reserveId: string
): Promise<boolean> => {
  const contract = buildLiquidityProtectionSettingsContract(settingsContract);
  const res = await contract.methods
    .addLiquidityDisabled(poolId, reserveId)
    .call();

  return res;
};
