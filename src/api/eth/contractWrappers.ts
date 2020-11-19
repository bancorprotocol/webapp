import {
  buildTokenContract,
  buildNetworkContract,
  buildV2Converter,
  buildRegistryContract,
  buildLiquidityProtectionStoreContract,
  buildLiquidityProtectionContract
} from "./contractTypes";
import { EthNetworks, zeroAddress } from "../helpers";
import { fromPairs, toPairs } from "lodash";
import { ProtectedLiquidity } from "@/types/bancor";
import { getWeb3 } from "@/api/web3";

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
  network
}: {
  networkContract: string;
  path: string[];
  amount: string;
  network: EthNetworks;
}): Promise<string> => {
  const contract = buildNetworkContract(networkContract, getWeb3(network));
  return contract.methods.rateByPath(path, amount).call();
};

export const liquidationLimit = async ({
  converterContract,
  poolTokenAddress,
  network
}: {
  converterContract: string;
  poolTokenAddress: string;
  network: EthNetworks;
}) => {
  const contract = buildV2Converter(converterContract, getWeb3(network));
  return contract.methods.liquidationLimit(poolTokenAddress).call();
};

export const fetchPoolToken = async ({
  anchorContract,
  reserveTokenAddress,
  network
}: {
  anchorContract: string;
  reserveTokenAddress: string;
  network: EthNetworks;
}) => {
  const contract = buildV2Converter(anchorContract, getWeb3(network));
  return contract.methods.poolToken(reserveTokenAddress).call();
};

export const getConvertersByAnchors = async ({
  anchorAddresses,
  converterRegistryAddress,
  network
}: {
  anchorAddresses: string[];
  converterRegistryAddress: string;
  network: EthNetworks;
}) => {
  const registryContract = buildRegistryContract(
    converterRegistryAddress,
    getWeb3(network)
  );
  return registryContract.methods
    .getConvertersByAnchors(anchorAddresses)
    .call();
};

export const getAnchors = async (
  converterRegistryAddress: string,
  network: EthNetworks
) => {
  const registryContract = buildRegistryContract(
    converterRegistryAddress,
    getWeb3(network)
  );
  return registryContract.methods.getAnchors().call();
};

export const getConvertibleTokenAnchors = async ({
  converterRegistryAddress,
  tokenAddress,
  network
}: {
  converterRegistryAddress: string;
  tokenAddress: string;
  network: EthNetworks;
}) => {
  const registryContract = buildRegistryContract(
    converterRegistryAddress,
    getWeb3(network)
  );
  return registryContract.methods
    .getConvertibleTokenAnchors(tokenAddress)
    .call();
};

export const conversionPath = async ({
  networkContractAddress,
  from,
  to,
  network
}: {
  networkContractAddress: string;
  from: string;
  to: string;
  network: EthNetworks;
}) => {
  const networkContract = buildNetworkContract(
    networkContractAddress,
    getWeb3(network)
  );
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
  network: EthNetworks
) => {
  const contract = buildLiquidityProtectionContract(
    protectionContract,
    getWeb3(network)
  );

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
