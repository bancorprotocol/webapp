import { ContractSendMethod } from "web3-eth-contract";
import { ContractMethods } from "@/types/bancor";
import { CallReturn } from "eth-multicall";
import {
  ABIBancorGovernance,
  ABIContainerContract,
  ABIContractRegistry,
  ABIConverter,
  ABIConverterRegistry,
  ABIConverterV28,
  ABILiquidityProtection,
  ABILiquidityProtectionSettings,
  ABILiquidityProtectionStore,
  ABIMultiCallContract,
  ABINetworkContract,
  ABISmartToken,
  ABIStakingRewards,
  ABIStakingRewardsStore,
  ABIV2Converter,
  V2PoolsTokenContainer,
  ABILiquidityProtectionSystemStore,
  ABIWethToken,
  ABIExchangeProxy
} from "@/api/eth/ethAbis";
import { AbiItem } from "web3-utils";
import { Proposal } from "@/store/modules/governance/ethGovernance";
import Web3 from "web3";
import { web3 } from "@/api/web3";
import { StringRfq } from "@/api/observables/keeperDao";
import { Contract } from "web3-eth-contract";

interface ContractTyped<T> extends Contract {
  methods: T;
}

const buildContract = <T>(
  abi: AbiItem[],
  contractAddress?: string,
  injectedWeb3?: Web3
): ContractTyped<T> =>
  (contractAddress
    ? new (injectedWeb3 || web3).eth.Contract(abi, contractAddress)
    : new (injectedWeb3 || web3).eth.Contract(
        abi
      )) as unknown as ContractTyped<T>;

interface TokenContractType {
  symbol: () => CallReturn<string>;
  decimals: () => CallReturn<string>;
  owner: () => CallReturn<string>;
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
}
interface WethContractType extends TokenContractType {
  deposit: () => ContractSendMethod;
  withdraw: (amount: string) => ContractSendMethod;
}

export const buildTokenContract = (
  contractAddress?: string,
  web3?: Web3
): ContractMethods<TokenContractType> =>
  buildContract(ABISmartToken, contractAddress, web3);

export const buildWethContract = (
  contractAddress?: string,
  web3?: Web3
): ContractMethods<WethContractType> =>
  buildContract(ABIWethToken, contractAddress, web3);

export const buildGovernanceContract = (
  contractAddress?: string,
  web3?: Web3
): ContractMethods<{
  voteDuration: () => CallReturn<string>;
  voteLockDuration: () => CallReturn<string>;
  voteLockFraction: () => CallReturn<string>;
  newProposalMinimum: () => CallReturn<string>;
  propose: (executor: string, hash: string) => ContractSendMethod;
  voteFor: (proposalId: string) => ContractSendMethod;
  voteAgainst: (proposalId: string) => ContractSendMethod;
  stake: (amount: string) => ContractSendMethod;
  unstake: (amount: string) => ContractSendMethod;
  decimals: () => CallReturn<string>;
  proposalCount: () => CallReturn<number>;
  proposals: (proposalI: number) => CallReturn<Proposal>;
  votesOf: (voter: string) => CallReturn<string>;
  votesForOf: (voter: string, proposalId: number) => CallReturn<string>;
  votesAgainstOf: (voter: string, proposalId: number) => CallReturn<string>;
  voteLocks: (voter: string) => CallReturn<string>;
  govToken: () => CallReturn<string>;
}> => buildContract(ABIBancorGovernance, contractAddress, web3);

export const buildContainerContract = (
  contractAddress?: string,
  web3?: Web3
): ContractMethods<{
  poolTokens(): CallReturn<string[]>;
  symbol: () => CallReturn<string>;
  decimals: () => CallReturn<string>;
}> => buildContract(ABIContainerContract, contractAddress, web3);

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
  contractAddress?: string,
  web3?: Web3
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
}> => buildContract(ABIConverter, contractAddress, web3);

export const buildV2Converter = (
  contractAddress?: string,
  web3?: Web3
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
}> => buildContract(ABIV2Converter, contractAddress, web3);

export const buildV28ConverterContract = (
  contractAddress?: string,
  web3?: Web3
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
  recentAverageRate: (
    tokenAddress: string
  ) => CallReturn<{ "0": string; "1": string }>;
  owner: () => CallReturn<string>;
  version: () => CallReturn<string>;
  converterType: () => CallReturn<string>;
  connectorTokenCount: () => CallReturn<string>;
  connectorTokens: (index: number) => CallReturn<string>;
  conversionFee: () => CallReturn<string>;
  reserveBalance: (reserveToken: string) => CallReturn<string>;
}> => buildContract(ABIConverterV28, contractAddress, web3);

export const buildNetworkContract = (
  contractAddress: string,
  web3?: Web3
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
}> => buildContract(ABINetworkContract, contractAddress, web3);

export const buildRegistryContract = (
  contractAddress: string,
  web3?: Web3
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
}> => buildContract(ABIConverterRegistry, contractAddress, web3);

export const buildLiquidityProtectionStoreContract = (
  contractAddress: string,
  web3?: Web3
): ContractMethods<{
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
}> => buildContract(ABILiquidityProtectionStore, contractAddress, web3);

export const buildLiquidityProtectionContract = (
  contractAddress: string,
  web3?: Web3
): ContractMethods<{
  store: () => CallReturn<string>;
  systemStore: () => CallReturn<string>;
  govToken: () => CallReturn<string>;
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
  settings: () => CallReturn<string>;
  poolAvailableSpace: (
    poolAnchor: string
  ) => CallReturn<{ "0": string; "1": string }>;
}> => buildContract(ABILiquidityProtection, contractAddress, web3);

export const buildExchangeProxyContract = (
  contractAddress: string
): ContractMethods<{
  cancelRfqOrder: (order: StringRfq) => ContractSendMethod;
  batchCancelRfqOrders: (orders: StringRfq[]) => ContractSendMethod;
}> => buildContract(ABIExchangeProxy, contractAddress);

export const buildLiquidityProtectionSettingsContract = (
  contractAddress: string,
  web3?: Web3
): ContractMethods<{
  poolWhitelist(): CallReturn<string[]>;
  addLiquidityDisabled: (
    poolId: string,
    reserveId: string
  ) => CallReturn<boolean>;
  minProtectionDelay: () => CallReturn<string>;
  lockDuration: () => CallReturn<string>;
  networkToken: () => CallReturn<string>;
  maxProtectionDelay: () => CallReturn<string>;
  maxSystemNetworkTokenRatio: () => CallReturn<string>;
  defaultNetworkTokenMintingLimit: () => CallReturn<string>;
  minNetworkTokenLiquidityForMinting: () => CallReturn<string>;
  networkTokensMinted: (poolId: string) => CallReturn<string>;
  networkTokenMintingLimits: (poolId: string) => CallReturn<string>;
  averageRateMaxDeviation: () => CallReturn<string>;
  isPoolWhitelisted(anchorAddress: string): CallReturn<boolean>;
}> => buildContract(ABILiquidityProtectionSettings, contractAddress, web3);

export const buildLiquidityProtectionSystemStoreContract = (
  contractAddress: string,
  web3?: Web3
): ContractMethods<{
  networkTokensMinted: (poolId: string) => CallReturn<string>;
}> => buildContract(ABILiquidityProtectionSystemStore, contractAddress, web3);

export const buildAddressLookupContract = (
  contractAddress: string
): ContractMethods<{
  addressOf: (ascii: string) => CallReturn<string>;
}> => buildContract(ABIContractRegistry, contractAddress);

export const buildStakingRewardsStoreContract = (
  contractAddress: string,
  web3?: Web3
): ContractMethods<{
  poolPrograms: () => CallReturn<{
    "0": string[]; // poolToken
    "1": string[]; // startTimes
    "2": string[]; // endTimes
    "3": string[]; // rewardRates
    "4": string[][]; // reserveTokens
    "5": string[][]; // rewardShares
  }>;
}> => buildContract(ABIStakingRewardsStore, contractAddress, web3);

export const buildStakingRewardsContract = (
  contractAddress: string,
  web3?: Web3
): ContractMethods<{
  stakeRewards: (maxAmount: string, poolToken: string) => ContractSendMethod;
  claimRewards: () => ContractSendMethod;
  totalClaimedRewards: (provider: string) => CallReturn<string>;
  pendingRewards: (provider: string) => CallReturn<string>;
  store: () => CallReturn<string>;
  pendingReserveRewards: (
    provider: string,
    poolToken: string,
    reserveToken: string
  ) => CallReturn<string>;
  rewardsMultiplier: (
    provider: string,
    poolToken: string,
    reserveToken: string
  ) => CallReturn<string>;
}> => buildContract(ABIStakingRewards, contractAddress, web3);
