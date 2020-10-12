import {
  buildTokenContract,
  buildNetworkContract,
  buildV2Converter,
  buildRegistryContract,
  buildLiquidityProtectionStoreContract,
  buildLiquidityProtectionContract
} from "./contractTypes";
import { zeroAddress } from "../helpers";
import { fromPairs, toPairs } from "lodash";
import { ProtectedLiquidity } from "@/types/bancor";

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
  amount
}: {
  networkContract: string;
  path: string[];
  amount: string;
}): Promise<string> => {
  const contract = buildNetworkContract(networkContract);
  return contract.methods.rateByPath(path, amount).call();
};

export const liquidationLimit = async ({
  converterContract,
  poolTokenAddress
}: {
  converterContract: string;
  poolTokenAddress: string;
}) => {
  const contract = buildV2Converter(converterContract);
  return contract.methods.liquidationLimit(poolTokenAddress).call();
};

export const fetchPoolToken = async ({
  anchorContract,
  reserveTokenAddress
}: {
  anchorContract: string;
  reserveTokenAddress: string;
}) => {
  const contract = buildV2Converter(anchorContract);
  return contract.methods.poolToken(reserveTokenAddress).call();
};

export const getConvertersByAnchors = async ({
  anchorAddresses,
  converterRegistryAddress
}: {
  anchorAddresses: string[];
  converterRegistryAddress: string;
}) => {
  const registryContract = buildRegistryContract(converterRegistryAddress);
  return registryContract.methods
    .getConvertersByAnchors(anchorAddresses)
    .call();
};

export const getAnchors = async (converterRegistryAddress: string) => {
  const registryContract = buildRegistryContract(converterRegistryAddress);
  return registryContract.methods.getAnchors().call();
};

export const getConvertibleTokenAnchors = async ({
  converterRegistryAddress,
  tokenAddress
}: {
  converterRegistryAddress: string;
  tokenAddress: string;
}) => {
  const registryContract = buildRegistryContract(converterRegistryAddress);
  return registryContract.methods
    .getConvertibleTokenAnchors(tokenAddress)
    .call();
};

export const conversionPath = async ({
  networkContractAddress,
  from,
  to
}: {
  networkContractAddress: string;
  from: string;
  to: string;
}) => {
  const networkContract = buildNetworkContract(networkContractAddress);
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
  reserveWeights: string[]
): Promise<string | false> => {
  const contract = buildRegistryContract(converterRegistry);
  const res = await contract.methods
    .getLiquidityPoolByConfig(poolType, reserveTokenAddresses, reserveWeights)
    .call();

  if (res == zeroAddress) return false;
  return res;
};

export const protectionById = async (
  storeContract: string,
  protectionId: string
): Promise<ProtectedLiquidity> => {
  const contract = buildLiquidityProtectionStoreContract(storeContract);
  const res = await contract.methods.protectedLiquidity(protectionId).call();
  const keys = [
    "owner",
    "poolToken",
    "reserveToken",
    "poolAmount",
    "reserveAmount",
    "reserveRateN",
    "reserveRateD",
    "timestamp"
  ];
  const base = fromPairs(keys.map((key, index) => [key, res[index]]));
  return {
    ...base,
    id: protectionId
  } as ProtectedLiquidity;
};

export const getRemoveLiquidityReturn = async (
  protectionContract: string,
  id: string,
  ppm: string,
  removeTimestamp: number
) => {
  const contract = buildLiquidityProtectionContract(protectionContract);

  const res = await contract.methods
    .removeLiquidityReturn(id, ppm, String(removeTimestamp))
    .call();

  const keys = ["targetAmount", "baseAmount", "networkAmount"];
  const pairs = toPairs(res).map(([key, value], index) => [keys[index], value]);

  return fromPairs(pairs) as {
    targetAmount: string;
    baseAmount: string;
    networkAmount: string;
  };

  // targetAmount - expected return amount in the reserve token
  // baseAmount - actual return amount in the reserve token
  // networkAmount - compensation in the network token
};
