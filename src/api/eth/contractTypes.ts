import { ContractSendMethod } from "web3-eth-contract";
import { ContractMethods } from "@/types/bancor.d.ts";
import { CallReturn } from "eth-multicall";
import {
  ABIConverter,
  ABISmartToken,
  ABIConverterRegistry,
  ABIConverterV28,
  ABINetworkContract,
  ABIV2Converter,
  V2PoolsTokenContainer,
  ABIMultiCallContract,
  ABIContainerContract,
  ABILiquidityProtection,
  ABILiquidityProtectionStore
} from "@/api/eth/ethAbis";
import { web3 } from "@/api/helpers";
import { AbiItem } from "web3-utils";

const buildContract = (abi: AbiItem[], contractAddress?: string) =>
  contractAddress
    ? new web3.eth.Contract(abi, contractAddress)
    : new web3.eth.Contract(abi);

export const buildTokenContract = (
  contractAddress?: string
): ContractMethods<{
  symbol: () => CallReturn<string>;
  decimals: () => CallReturn<string>;
  totalSupply: () => CallReturn<string>;
  allowance: (owner: string, spender: string) => CallReturn<string>;
  balanceOf: (owner: string) => CallReturn<string>;
  transferOwnership: (converterAddress: string) => ContractSendMethod;
  issue: (address: string, wei: string) => ContractSendMethod;
  transfer: (to: string, weiAmount: string) => ContractSendMethod;
  approve: (
    approvedAddress: string,
    approvedAmount: string
  ) => ContractSendMethod;
}> => buildContract(ABISmartToken, contractAddress);

export const buildContainerContract = (
  contractAddress?: string
): ContractMethods<{
  poolTokens(): CallReturn<string[]>;
  symbol: () => CallReturn<string>;
  decimals: () => CallReturn<string>;
}> => buildContract(ABIContainerContract, contractAddress);

export const buildV2PoolsContainer = (
  contractAddress: string
): ContractMethods<{
  poolTokens: () => CallReturn<string[]>;
}> => buildContract(V2PoolsTokenContainer, contractAddress);

export const buildMultiCallContract = (
  contractAddress: string
): ContractMethods<{
  aggregate: (
    calls: any[],
    strict: boolean
  ) => CallReturn<{
    blockNumber: string;
    returnData: {
      success: boolean;
      data: string;
    }[];
  }>;
}> => buildContract(ABIMultiCallContract, contractAddress);

export const buildConverterContract = (
  contractAddress?: string
): ContractMethods<{
  acceptTokenOwnership: () => ContractSendMethod;
  reserves: (reserveAddress: string) => CallReturn<any[]>;
  reserveBalance: (reserveAddress: string) => CallReturn<string>;
  getConnectorBalance: (reserveAddress: string) => CallReturn<string>;
  getReserveBalance: (reserveAdress: string) => CallReturn<string>;
  acceptOwnership: () => ContractSendMethod;
  fund: (fundAmount: string) => ContractSendMethod;
  liquidate: (fundAmount: string) => ContractSendMethod;
  setConversionFee: (ppm: string) => ContractSendMethod;
  addReserve: (
    reserveAddress: string,
    connectorWeight: number
  ) => ContractSendMethod;
  getSaleReturn: (
    toAddress: string,
    wei: string
  ) => CallReturn<{ "0": string; "1": string }>;
  getReturn: (
    fromTokenAddress: string,
    toTokenAddress: string,
    wei: string
  ) => CallReturn<{ "0": string; "1": string }>;
  owner: () => CallReturn<string>;
  version: () => CallReturn<string>;
  connectorTokenCount: () => CallReturn<string>;
  connectorTokens: (index: number) => CallReturn<string>;
  conversionFee: () => CallReturn<string>;
  geometricMean: (weis: string[]) => CallReturn<string>;
}> => buildContract(ABIConverter, contractAddress);

export const buildV2Converter = (
  contractAddress?: string
): ContractMethods<{
  activate: (
    primaryReserveToken: string,
    primaryReserveOracle: string,
    secondaryReserveOracle: string
  ) => ContractSendMethod;
  reserveStakedBalance: (reserveToken: string) => CallReturn<string>;
  primaryReserveToken: () => CallReturn<string>;
  secondaryReserveToken: () => CallReturn<string>;
  maxStakedBalances: (address: string) => CallReturn<string>;
  maxStakedBalanceEnabled: () => CallReturn<boolean>;
  poolToken: (reserveToken: string) => CallReturn<string>;
  liquidationLimit: (poolToken: string) => CallReturn<string>;
  effectiveReserveWeights: () => CallReturn<{ "0": string; "1": string }>;
  removeLiquidityReturnAndFee: (
    poolToken: string,
    amount: string
  ) => CallReturn<{ "0": string; "1": string }>;
  addLiquidity: (
    reserveTokenAddress: string,
    amount: string,
    minReturn: string
  ) => ContractSendMethod;
  removeLiquidity: (
    poolTokenAddress: string,
    amount: string,
    minReturn: string
  ) => ContractSendMethod;
}> => buildContract(ABIV2Converter, contractAddress);

export const buildV28ConverterContract = (
  contractAddress?: string
): ContractMethods<{
  acceptTokenOwnership: () => ContractSendMethod;
  acceptOwnership: () => ContractSendMethod;
  setConversionFee: (ppm: number) => ContractSendMethod;
  addLiquidity: (
    reserveTokens: string[],
    reserveAmounts: string[],
    minReturn: string
  ) => ContractSendMethod;
  removeLiquidity: (
    amount: string,
    reserveTokens: string[],
    reserveMinReturnAmounts: string[]
  ) => ContractSendMethod;
  addReserve: (
    reserveAddress: string,
    connectorWeight: number
  ) => ContractSendMethod;
  getReturn: (
    fromTokenAddress: string,
    toTokenAddress: string,
    wei: string
  ) => CallReturn<{ "0": string; "1": string }>;
  rateAndFee: (
    fromTokenAddress: string,
    toTokenAddress: string,
    wei: string
  ) => CallReturn<{ "0": string; "1": string }>;
  owner: () => CallReturn<string>;
  version: () => CallReturn<string>;
  converterType: () => CallReturn<string>;
  connectorTokenCount: () => CallReturn<string>;
  connectorTokens: (index: number) => CallReturn<string>;
  conversionFee: () => CallReturn<string>;
  reserveBalance: (reserveToken: string) => CallReturn<string>;
}> => buildContract(ABIConverterV28, contractAddress);

export const buildNetworkContract = (
  contractAddress: string
): ContractMethods<{
  rateByPath: (path: string[], amount: string) => CallReturn<string>;
  convertByPath: (
    path: string[],
    amount: string,
    minReturn: string,
    beneficiary: string,
    affiliateAccount: string,
    affiliateFee: number
  ) => ContractSendMethod;
  conversionPath: (
    sourceToken: string,
    destinationToken: string
  ) => CallReturn<string[]>;
}> => buildContract(ABINetworkContract, contractAddress);

export const buildRegistryContract = (
  contractAddress: string
): ContractMethods<{
  getConvertibleTokens: () => CallReturn<string[]>;
  getConvertibleTokenAnchors: (
    convertibleToken: string
  ) => CallReturn<string[]>;
  getConvertersByAnchors: (anchors: string[]) => CallReturn<string[]>;
  getAnchors: () => CallReturn<string[]>;
  newConverter: (
    type: number,
    smartTokenName: string,
    smartTokenSymbol: string,
    smartTokenDecimals: number,
    maxConversionFee: number,
    reserveTokens: string[],
    reserveWeights: string[]
  ) => ContractSendMethod;
  getLiquidityPoolByConfig: (
    type: number,
    reserveTokens: string[],
    reserveWeight: string[]
  ) => CallReturn<string>;
}> => buildContract(ABIConverterRegistry, contractAddress);

export const buildLiquidityProtectionStoreContract = (
  contractAddress: string
): ContractMethods<{
  whitelistedPools(): CallReturn<string[]>;
  lockedBalanceCount(owner: string): CallReturn<string>;
  lockedBalance(
    owner: string,
    index: string
  ): CallReturn<{ "0": string; "1": string }>;
  lockedBalanceRange(
    owner: string,
    startIndex: string,
    endIndex: string
  ): CallReturn<{ "0": string[]; "1": string[] }>;
  systemBalance(tokenAddress: string): CallReturn<string>;
  totalProtectedPoolAmount(poolTokenAddress: string): CallReturn<string>;
  totalProtectedReserveAmount(
    anchorAddress: string,
    reserveAddress: string
  ): CallReturn<string>;
  protectedLiquidityCount(owner: string): CallReturn<string>;
  protectedLiquidityIds(owner: string): CallReturn<string[]>;
  protectedLiquidityId(owner: string): CallReturn<string>;
  protectedLiquidity(id: string): CallReturn<{ [key: string]: string }>;
  isPoolWhitelisted(anchorAddress: string): CallReturn<"0" | "1">;
}> => buildContract(ABILiquidityProtectionStore, contractAddress);

export const buildLiquidityProtectionContract = (
  contractAddress: string
): ContractMethods<{
  store: () => CallReturn<string>;
  networkToken: () => CallReturn<string>;
  govToken: () => CallReturn<string>;
  minProtectionDelay: () => CallReturn<string>;
  maxProtectionDelay: () => CallReturn<string>;
  maxSystemNetworkTokenAmount: () => CallReturn<string>;
  maxSystemNetworkTokenRatio: () => CallReturn<string>;
  lockDuration: () => CallReturn<string>;
  isPoolSupported: (anchor: string) => CallReturn<boolean>;
  protectLiquidity: (
    anchor: string,
    poolTokenWei: string
  ) => ContractSendMethod;
  unprotectLiquidity: (dbId1: string, dbId2: string) => ContractSendMethod;
  addLiquidity: (
    anchor: string,
    reserveAddress: string,
    reserveAmountWei: string
  ) => ContractSendMethod;
  removeLiquidity: (dbId: string, ppmPercent: string) => ContractSendMethod;
  claimBalance: (startIndex: string, endIndex: string) => ContractSendMethod;
  transferLiquidity: (id: string, newProvider: string) => ContractSendMethod;
  removeLiquidityReturn: (
    id: string,
    portion: string,
    removeTimeStamp: string
  ) => CallReturn<{ "0": string; "1": string; "2": string }>;
  poolROI: (
    poolToken: string,
    reserveToken: string,
    reserveAmount: string,
    poolRateN: string,
    poolRateD: string,
    reserveRateN: string,
    reserveRateD: string
  ) => CallReturn<string>;
}> => buildContract(ABILiquidityProtection, contractAddress);
