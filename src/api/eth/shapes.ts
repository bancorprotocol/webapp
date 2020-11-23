import { DataTypes } from "eth-multicall";
import {
  buildV28ConverterContract,
  buildV2Converter,
  buildContainerContract,
  buildConverterContract,
  buildTokenContract,
  buildLiquidityProtectionContract,
  buildLiquidityProtectionStoreContract
} from "@/api/eth/contractTypes";
import { EthNetworks } from "@/api/web3";
import { compareString } from "../helpers";
import { getWeb3 } from "../web3";
import BigNumber from "bignumber.js";
import { knownV2Anchors } from "@/store/modules/swap/staticRelays";
import { TokenWei } from "@/types/bancor";

const ORIGIN_ADDRESS = DataTypes.originAddress;

export const protectedReservesShape = (
  storeAddress: string,
  anchorAddress: string,
  reserveOneAddress: string,
  reserveTwoAddress: string
) => {
  const contract = buildLiquidityProtectionStoreContract(storeAddress);
  return {
    anchorAddress,
    reserveOneAddress,
    reserveTwoAddress,
    reserveOneProtected: contract.methods.totalProtectedReserveAmount(
      anchorAddress,
      reserveOneAddress
    ),
    reserveTwoProtected: contract.methods.totalProtectedReserveAmount(
      anchorAddress,
      reserveTwoAddress
    )
  };
};

export const slimBalanceShape = (
  contractAddress: string,
  owner: string,
  network: EthNetworks
) => {
  const contract = buildTokenContract(contractAddress, getWeb3(network));
  const template = {
    contract: ORIGIN_ADDRESS,
    balance: contract.methods.balanceOf(owner)
  };
  return template;
};

export const balanceShape = (
  contractAddress: string,
  owner: string,
  network: EthNetworks
) => {
  const contract = buildTokenContract(contractAddress, getWeb3(network));
  const template = {
    contract: ORIGIN_ADDRESS,
    balance: contract.methods.balanceOf(owner),
    decimals: contract.methods.decimals()
  };
  return template;
};

export const tokenSupplyShape = (
  tokenAddress: string,
  network: EthNetworks
) => {
  const contract = buildTokenContract(tokenAddress, getWeb3(network));
  return {
    tokenContract: ORIGIN_ADDRESS,
    supply: contract.methods.totalSupply()
  };
};

const buildPoolRoiParams = (
  poolToken: string,
  poolTokenSupply: string,
  primaryReserveToken: string,
  primaryReserveBalance: string,
  secondaryReserveBalance: string
) =>
  [
    poolToken,
    primaryReserveToken,
    primaryReserveBalance,
    new BigNumber(primaryReserveBalance).times(2).toString(),
    poolTokenSupply,
    secondaryReserveBalance,
    primaryReserveBalance
  ] as [string, string, string, string, string, string, string];

export const dualPoolRoiShape = (
  protectionContractAddress: string,
  anchor: string,
  reserves: TokenWei[],
  poolTokenSupply: string
) => {
  const contract = buildLiquidityProtectionContract(protectionContractAddress);

  const [oneReserve, twoReserve] = reserves;

  const oneParams = buildPoolRoiParams(
    anchor,
    poolTokenSupply,
    oneReserve.tokenContract,
    oneReserve.weiAmount,
    twoReserve.weiAmount
  );
  const twoParams = buildPoolRoiParams(
    anchor,
    poolTokenSupply,
    twoReserve.tokenContract,
    twoReserve.weiAmount,
    oneReserve.weiAmount
  );

  return {
    anchor,
    protectionAddress: ORIGIN_ADDRESS,
    onePrimary: oneReserve.tokenContract,
    twoPrimary: twoReserve.tokenContract,
    oneRoi: contract.methods.poolROI(...oneParams),
    twoRoi: contract.methods.poolROI(...twoParams)
  };
};

export const tokenShape = (contractAddress: string) => {
  const contract = buildTokenContract(contractAddress);
  const template = {
    contract: ORIGIN_ADDRESS,
    symbol: contract.methods.symbol(),
    decimals: contract.methods.decimals()
  };
  return template;
};

export const reserveBalanceShape = (
  contractAddress: string,
  reserves: string[]
) => {
  const contract = buildConverterContract(contractAddress);
  const [reserveOne, reserveTwo] = reserves;
  return {
    converterAddress: ORIGIN_ADDRESS,
    reserveOneAddress: reserveOne,
    reserveTwoAddress: reserveTwo,
    reserveOne: contract.methods.getConnectorBalance(reserveOne),
    reserveTwo: contract.methods.getConnectorBalance(reserveTwo)
  };
};

export const relayShape = (converterAddress: string) => {
  const contract = buildV28ConverterContract(converterAddress);
  return {
    converterAddress: ORIGIN_ADDRESS,
    owner: contract.methods.owner(),
    converterType: contract.methods.converterType(),
    version: contract.methods.version(),
    connectorTokenCount: contract.methods.connectorTokenCount(),
    conversionFee: contract.methods.conversionFee(),
    connectorToken1: contract.methods.connectorTokens(0),
    connectorToken2: contract.methods.connectorTokens(1)
  };
};

export const staticRelayShape = (converterAddress: string) => {
  const contract = buildV28ConverterContract(converterAddress);
  return {
    converterAddress: ORIGIN_ADDRESS,
    converterType: contract.methods.converterType(),
    version: contract.methods.version(),
    connectorToken1: contract.methods.connectorTokens(0),
    connectorToken2: contract.methods.connectorTokens(1)
  };
};

export const dynamicRelayShape = (
  contractAddress: string,
  reserves: string[]
) => {
  const contract = buildConverterContract(contractAddress);
  const [reserveOne, reserveTwo] = reserves;
  return {
    converterAddress: ORIGIN_ADDRESS,
    reserveOneAddress: reserveOne,
    reserveTwoAddress: reserveTwo,
    conversionFee: contract.methods.conversionFee(),
    connectorTokenCount: contract.methods.connectorTokenCount(),
    reserveOne: contract.methods.getConnectorBalance(reserveOne),
    reserveTwo: contract.methods.getConnectorBalance(reserveTwo)
  };
};

export const poolTokenShape = (address: string) => {
  const contract = buildContainerContract(address);
  const isV2Pool = knownV2Anchors.some(anchor =>
    compareString(address, anchor)
  );
  return {
    symbol: contract.methods.symbol(),
    decimals: contract.methods.decimals(),
    ...(isV2Pool && { poolTokens: contract.methods.poolTokens() }),
    contract: ORIGIN_ADDRESS
  };
};

export const v2PoolBalanceShape = (
  contractAddress: string,
  reserveOne: string,
  reserveTwo: string,
  network: EthNetworks
) => {
  const contract = buildV2Converter(contractAddress, getWeb3(network));
  return {
    converterAddress: ORIGIN_ADDRESS,
    primaryReserveToken: contract.methods.primaryReserveToken(),
    secondaryReserveToken: contract.methods.secondaryReserveToken(),
    reserveOne,
    reserveTwo,
    reserveOnePoolToken: contract.methods.poolToken(reserveOne),
    reserveTwoPoolToken: contract.methods.poolToken(reserveTwo),
    reserveOneStakedBalance: contract.methods.reserveStakedBalance(reserveOne),
    reserveTwoStakedBalance: contract.methods.reserveStakedBalance(reserveTwo),
    effectiveReserveWeights: contract.methods.effectiveReserveWeights()
  };
};

export const liquidityProtectionShape = (
  contractAddress: string,
  network: EthNetworks
) => {
  const contract = buildLiquidityProtectionContract(
    contractAddress,
    getWeb3(network)
  );
  return {
    minProtectionDelay: contract.methods.minProtectionDelay(),
    maxProtectionDelay: contract.methods.maxProtectionDelay(),
    lockDuration: contract.methods.lockDuration(),
    networkToken: contract.methods.networkToken(),
    govToken: contract.methods.govToken(),
    maxSystemNetworkTokenAmount: contract.methods.maxSystemNetworkTokenAmount(),
    maxSystemNetworkTokenRatio: contract.methods.maxSystemNetworkTokenRatio()
  };
};
