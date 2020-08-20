import {
  buildTokenContract,
  buildNetworkContract,
  buildV2Converter,
  buildRegistryContract
} from "./contractTypes";

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
