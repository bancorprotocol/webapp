import { createModule, mutation, action } from "vuex-class-component";
import {
  ProposedFromTransaction,
  ProposedToTransaction,
  ProposedConvertTransaction,
  LiquidityParams,
  OpposingLiquidParams,
  OpposingLiquid,
  TradingModule,
  LiquidityModule,
  BaseToken,
  CreatePoolModule,
  ModalChoice,
  ViewToken,
  ViewRelay,
  TokenPrice,
  Section,
  Step,
  HistoryModule,
  ViewAmount,
  ModuleParam,
  ConvertReturn,
  UserPoolBalances,
  ReserveFeed,
  PoolTokenPosition,
  CreateV1PoolEthParams,
  TxResponse,
  V1PoolResponse,
  ViewTradeEvent,
  ViewLiquidityEvent,
  ViewRemoveEvent,
  ViewAddEvent,
  ViewAmountWithMeta,
  FocusPoolRes,
  ProtectedLiquidityCalculated,
  ProtectLiquidityParams,
  OnUpdate,
  ViewProtectedLiquidity,
  ViewLockedBalance,
  ProtectionRes,
  ViewAmountDetail,
  WeiExtendedAsset,
  TokenWei,
  PoolLiqMiningApr,
  ProtectedLiquidity,
  ConverterAndAnchor
} from "@/types/bancor";
import { ethBancorApi } from "@/api/bancorApiWrapper";
import {
  Relay,
  Token,
  fetchReserveBalance,
  compareString,
  findOrThrow,
  updateArray,
  isOdd,
  multiSteps,
  PoolType,
  TraditionalRelay,
  ChainLinkRelay,
  SmartToken,
  PoolContainer,
  sortAlongSide,
  RelayWithReserveBalances,
  sortByLiqDepth,
  matchReserveFeed,
  zeroAddress,
  buildSingleUnitCosts,
  findChangedReserve,
  getLogs,
  DecodedEvent,
  ConversionEventDecoded,
  getConverterLogs,
  DecodedTimedEvent,
  AddLiquidityEvent,
  RemoveLiquidityEvent,
  traverseLockedBalances,
  LockedBalance,
  rewindBlocksByDays,
  calculateProgressLevel
} from "@/api/helpers";
import { ContractSendMethod } from "web3-eth-contract";
import {
  ABIContractRegistry,
  ethErc20WrapperContract,
  ethReserveAddress
} from "@/api/eth/ethAbis";
import {
  getApprovedBalanceWei,
  getReturnByPath,
  liquidationLimit,
  getConvertersByAnchors,
  getAnchors,
  getConvertibleTokenAnchors,
  conversionPath,
  getTokenSupplyWei,
  existingPool,
  getRemoveLiquidityReturn
} from "@/api/eth/contractWrappers";
import { toWei, fromWei, toHex, asciiToHex } from "web3-utils";
import Decimal from "decimal.js";
import axios, { AxiosResponse } from "axios";
import { vxm } from "@/store";
import wait from "waait";
import {
  uniqWith,
  differenceWith,
  zip,
  partition,
  first,
  omit,
  toPairs,
  fromPairs,
  chunk,
  last,
  isEqual
} from "lodash";
import {
  buildNetworkContract,
  buildRegistryContract,
  buildV28ConverterContract,
  buildV2Converter,
  buildConverterContract,
  buildTokenContract,
  buildLiquidityProtectionContract,
  buildLiquidityProtectionStoreContract
} from "@/api/eth/contractTypes";
import {
  MinimalRelay,
  generateEthPath,
  shrinkToken,
  TokenSymbol,
  removeLeadingZeros
} from "@/api/eth/helpers";
import { ethBancorApiDictionary } from "@/api/eth/bancorApiRelayDictionary";
import { getSmartTokenHistory, fetchSmartTokens } from "@/api/eth/zumZoom";
import { sortByNetworkTokens } from "@/api/sortByNetworkTokens";
import { findNewPath } from "@/api/eos/eosBancorCalc";
import {
  findPreviousPoolFee,
  priorityEthPools,
  knownPools,
  PreviousPoolFee,
  highCapPools,
  liquidityMiningEndTime,
  moreStaticRelays,
  previousPoolFees,
  v2Pools,
  secondRoundLiquidityMiningEndTime,
  knownV2Anchors
} from "./staticRelays";
import BigNumber from "bignumber.js";
import { knownVersions } from "@/api/eth/knownConverterVersions";
import { MultiCall, ShapeWithLabel, DataTypes } from "eth-multicall";
import moment from "moment";
import { getNetworkVariables } from "@/api/config";
import { EthNetworks, web3 } from "@/api/web3";
import * as Sentry from "@sentry/browser";
import {
  Subject,
  combineLatest,
  from,
  Observable,
  of,
  partition as partitionOb,
  merge
} from "rxjs";
import {
  distinctUntilChanged,
  map,
  filter,
  startWith,
  concatMap,
  mergeMap,
  tap,
  switchMap,
  shareReplay,
  pluck,
  scan,
  first as firstItem,
  bufferTime,
  delay,
  buffer,
  share
} from "rxjs/operators";
import {
  calculatePositionFees,
  decToPpm,
  miningBntReward,
  miningTknReward,
  compareStaticRelayAndSet,
  expandToken,
  calculateMaxStakes,
  calculatePriceDeviationTooHigh
} from "@/api/pureHelpers";
import {
  dualPoolRoiShape,
  reserveBalanceShape,
  tokenShape,
  tokenSupplyShape,
  slimBalanceShape,
  balanceShape,
  liquidityProtectionShape,
  v2PoolBalanceShape,
  relayShape,
  poolTokenShape,
  protectedReservesShape,
  dynamicRelayShape,
  staticRelayShape
} from "@/api/eth/shapes";
import Web3 from "web3";

const q: RawAbiToken[] = [
  {
    decimals: 18,
    symbol: "ETHBNT",
    contract: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533"
  },
  {
    decimals: 18,
    symbol: "LINKBNT",
    contract: "0x04D0231162b4784b706908c787CE32bD075db9b7"
  },
  {
    decimals: 18,
    symbol: "USDTBNT",
    contract: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306"
  },
  {
    decimals: 18,
    symbol: "DAIBNT",
    contract: "0xE5Df055773Bf9710053923599504831c7DBdD697"
  },
  {
    decimals: 18,
    symbol: "USDCBNT",
    contract: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4"
  },
  {
    decimals: 18,
    symbol: "WBTC",
    contract: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec"
  },
  {
    decimals: 18,
    symbol: "OCEANBNT",
    contract: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5"
  },
  {
    decimals: 18,
    symbol: "YFIBNT",
    contract: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8"
  },
  {
    decimals: 18,
    symbol: "RENBNT",
    contract: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7"
  },
  {
    decimals: 18,
    symbol: "renBTCBNT",
    contract: "0xb479b102bF135bdC666d6916172422CbaD9E977f"
  },
  {
    decimals: 18,
    symbol: "OMGBNT",
    contract: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340"
  },
  {
    decimals: 18,
    symbol: "BATBNT",
    contract: "0x131da075a2832549128e93AcC2b54174045232Cf"
  },
  {
    decimals: 18,
    symbol: "ENJBNT",
    contract: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1"
  },
  {
    decimals: 18,
    symbol: "JRTBNT",
    contract: "0x069D653038DB2F9d84e9620Be140B3D404a40258"
  },
  {
    decimals: 18,
    symbol: "ANTBNT",
    contract: "0x0c485BffD5df019F66927B2C32360159884D4409"
  },
  {
    decimals: 18,
    symbol: "RPLBNT",
    contract: "0xB9fe4BD869a132137B668054ea48C897c0654ee4"
  },
  {
    decimals: 18,
    symbol: "MANABNT",
    contract: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC"
  },
  {
    decimals: 18,
    symbol: "GNOBNT",
    contract: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d"
  },
  {
    decimals: 18,
    symbol: "KNCBNT",
    contract: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47"
  },
  {
    decimals: 18,
    symbol: "RSRBNT",
    contract: "0x7d402c5CF587D4dEC6761C51E0aA903956495851"
  },
  {
    decimals: 18,
    symbol: "BNBBNT",
    contract: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324"
  },
  {
    decimals: 18,
    symbol: "NMRBNT",
    contract: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44"
  },
  {
    decimals: 18,
    symbol: "TKNBNT",
    contract: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239"
  },
  {
    decimals: 18,
    symbol: "MKRBNT",
    contract: "0xf553E6eA4CE2F7dEEcbe7837E27931850eC15faB"
  },
  {
    decimals: 18,
    symbol: "EURSBNT",
    contract: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3"
  },
  {
    decimals: 18,
    symbol: "POWRBNT",
    contract: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3"
  },
  {
    decimals: 18,
    symbol: "ELFBNT",
    contract: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf"
  },
  {
    decimals: 18,
    symbol: "RCNBNT",
    contract: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5"
  },
  {
    decimals: 18,
    symbol: "MDTBNT",
    contract: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5"
  },
  {
    decimals: 18,
    symbol: "MADBNT",
    contract: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0"
  },
  {
    decimals: 18,
    symbol: "CHERRYBNT",
    contract: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5"
  },
  {
    decimals: 18,
    symbol: "AMPLBNT",
    contract: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC"
  },
  {
    decimals: 18,
    symbol: "REQBNT",
    contract: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e"
  },
  {
    decimals: 18,
    symbol: "VIBBNT",
    contract: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05"
  },
  {
    decimals: 18,
    symbol: "ALEPHBNT",
    contract: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27"
  },
  {
    decimals: 18,
    symbol: "STAKEBNT",
    contract: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8"
  },
  {
    decimals: 18,
    symbol: "GTOBNT",
    contract: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01"
  },
  {
    decimals: 18,
    symbol: "REMBNT",
    contract: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f"
  },
  {
    decimals: 18,
    symbol: "MRPHBNT",
    contract: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4"
  },
  {
    decimals: 18,
    symbol: "EWTB",
    contract: "0x178c820f862B14f316509ec36b13123DA19A6054"
  },
  {
    decimals: 18,
    symbol: "EWTBBNT",
    contract: "0x66948fEFCcc464c714574a884c0458981Cbd944C"
  },
  {
    decimals: 18,
    symbol: "SNTBNT",
    contract: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D"
  },
  {
    decimals: 18,
    symbol: "POABNT",
    contract: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D"
  },
  {
    decimals: 18,
    symbol: "DATABNT",
    contract: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37"
  },
  {
    decimals: 18,
    symbol: "MTLBNT",
    contract: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530"
  },
  {
    decimals: 18,
    symbol: "MFTBNT",
    contract: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a"
  },
  {
    decimals: 18,
    symbol: "REALBNT",
    contract: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D"
  },
  {
    decimals: 18,
    symbol: "SANBNT",
    contract: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF"
  },
  {
    decimals: 18,
    symbol: "AUCBNT",
    contract: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153"
  },
  {
    decimals: 18,
    symbol: "AGRIBNT",
    contract: "0xEab935f35693c3218b927436E63564018E92034f"
  },
  {
    decimals: 18,
    symbol: "MFGBNT",
    contract: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7"
  },
  {
    decimals: 18,
    symbol: "RVTBNT",
    contract: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c"
  },
  {
    decimals: 18,
    symbol: "PLRBNT",
    contract: "0x2843F6c3b14e698e3D7562584959C61274F93328"
  },
  {
    decimals: 18,
    symbol: "XBPBNT",
    contract: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA"
  },
  {
    decimals: 18,
    symbol: "SRNBNT",
    contract: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b"
  },
  {
    decimals: 18,
    symbol: "MYBBNT",
    contract: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48"
  },
  {
    decimals: 18,
    symbol: "ABXBNT",
    contract: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f"
  },
  {
    decimals: 18,
    symbol: "CEEKBNT",
    contract: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee"
  },
  {
    decimals: 18,
    symbol: "LDCBNT",
    contract: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97"
  },
  {
    decimals: 18,
    symbol: "AMNBNT",
    contract: "0x0f9Be347378a37CED33A13AE061175AF07CC9868"
  },
  {
    decimals: 18,
    symbol: "LRCBNT",
    contract: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339"
  },
  {
    decimals: 18,
    symbol: "X8XBNT",
    contract: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8"
  },
  {
    decimals: 18,
    symbol: "VEEBNT",
    contract: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08"
  },
  {
    decimals: 18,
    symbol: "LOCIBNT",
    contract: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB"
  },
  {
    decimals: 18,
    symbol: "MTABNT",
    contract: "0x3035529E7aE11A3660134c9C875F4faa6514d042"
  },
  {
    decimals: 18,
    symbol: "INSTAR",
    contract: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b"
  },
  {
    decimals: 18,
    symbol: "USDQBNT",
    contract: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA"
  },
  {
    decimals: 18,
    symbol: "WAXBNT",
    contract: "0x67563E7A0F13642068F6F999e48c690107A4571F"
  },
  {
    decimals: 18,
    symbol: "XNKBNT",
    contract: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb"
  },
  {
    decimals: 18,
    symbol: "SCLBNT",
    contract: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E"
  },
  {
    decimals: 18,
    symbol: "UPBNT",
    contract: "0xd4c810fdcA379831078267f3402845E5205Aa0e1"
  },
  {
    decimals: 18,
    symbol: "AIDBNT",
    contract: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d"
  },
  {
    decimals: 18,
    symbol: "RST100",
    contract: "0x86D17e2eF332293391303F188F6a467dc0D1fd0d"
  },
  {
    decimals: 18,
    symbol: "RSTBNT",
    contract: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1"
  },
  {
    decimals: 18,
    symbol: "EMCOBNT",
    contract: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88"
  },
  {
    decimals: 18,
    symbol: "BZRXBNT",
    contract: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA"
  },
  {
    decimals: 18,
    symbol: "FTXBNT",
    contract: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a"
  },
  {
    decimals: 18,
    symbol: "WANDBNT",
    contract: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D"
  },
  {
    decimals: 18,
    symbol: "USDB / BNT",
    contract: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9"
  },
  {
    decimals: 18,
    symbol: "TRBBNT",
    contract: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b"
  },
  {
    decimals: 18,
    symbol: "INDBNT",
    contract: "0x32423158e8FBD2839E085626F8a98D86b2766De8"
  },
  {
    decimals: 18,
    symbol: "DTRCBNT",
    contract: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07"
  },
  {
    decimals: 18,
    symbol: "DRTBNT",
    contract: "0x904c7051D12aCE7d0107ada8702C0C759cad1672"
  },
  {
    decimals: 18,
    symbol: "UPTBNT",
    contract: "0x5a602561342F74D161E64796613D7528Dd0993C1"
  },
  {
    decimals: 18,
    symbol: "ZIPTBNT",
    contract: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC"
  },
  {
    decimals: 18,
    symbol: "COTBNT",
    contract: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94"
  },
  {
    decimals: 18,
    symbol: "BETRBNT",
    contract: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF"
  },
  {
    decimals: 18,
    symbol: "JRTUSDB",
    contract: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa"
  },
  {
    decimals: 18,
    symbol: "SPDBNT",
    contract: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76"
  },
  {
    decimals: 18,
    symbol: "MRGBNT",
    contract: "0x25Bf8913D6296a69C7B43BC781614992cb218935"
  },
  {
    decimals: 18,
    symbol: "TAASBNT",
    contract: "0xAE201360282C885bf3F2616A3145D1344a1e43c0"
  },
  {
    decimals: 18,
    symbol: "MLNBNT",
    contract: "0xff2CCF332A2d6CD645f93c19690104B99943b13D"
  },
  {
    decimals: 18,
    symbol: "SXLBNT",
    contract: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD"
  },
  {
    decimals: 18,
    symbol: "ELETBNT",
    contract: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5"
  },
  {
    decimals: 18,
    symbol: "API3",
    contract: "0x0b38210ea11411557c13457D4dA7dC6ea731B88a"
  },
  {
    decimals: 18,
    symbol: "API3BNT",
    contract: "0x70f416734C92c3ADE6Fdc9D065A1E8756d1d98E7"
  },
  {
    decimals: 18,
    symbol: "METUSDB",
    contract: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e"
  },
  {
    decimals: 18,
    symbol: "CVTBNT",
    contract: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55"
  },
  {
    decimals: 18,
    symbol: "REFBNT",
    contract: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926"
  },
  {
    decimals: 18,
    symbol: "QDAOBNT",
    contract: "0x19683E94943E6b348D8AFB98C128B9b549B400DF"
  },
  {
    decimals: 18,
    symbol: "BOXXBNT",
    contract: "0x849D49911cEF804bdB1FEC58150B8EabAB119796"
  },
  {
    decimals: 18,
    symbol: "GRIDBNT",
    contract: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075"
  },
  {
    decimals: 18,
    symbol: "PEG",
    contract: "0x8Ae56a6850a7cbeaC3c3Ab2cB311e7620167eAC8"
  },
  {
    decimals: 18,
    symbol: "PEGUSDB",
    contract: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881"
  },
  {
    decimals: 18,
    symbol: "EFOODBNT",
    contract: "0xf34484286be88613ad8399fe40f93506125be139"
  },
  {
    decimals: 18,
    symbol: "XPATBNT",
    contract: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C"
  },
  {
    decimals: 18,
    symbol: "TNSBNT",
    contract: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3"
  },
  {
    decimals: 18,
    symbol: "DAIBNT",
    contract: "0xee01b3AB5F6728adc137Be101d99c678938E6E72"
  },
  {
    decimals: 18,
    symbol: "HEDGBNT",
    contract: "0x654Ee2EAf2082c5483f2212ba7b6701F334a159f"
  },
  {
    decimals: 18,
    symbol: "PEG:USD",
    contract: "0xd758b77BCC792AFD58857E1d5C610aE649FDEE6b"
  },
  {
    decimals: 18,
    symbol: "USDB:PEGUSD",
    contract: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025"
  },
  {
    decimals: 18,
    symbol: "RBLXBNT",
    contract: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59"
  },
  {
    decimals: 18,
    symbol: "renZECBNT",
    contract: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27"
  },
  {
    decimals: 18,
    symbol: "SRMBNT",
    contract: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005"
  },
  {
    decimals: 18,
    symbol: "CELBNT",
    contract: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0"
  },
  {
    decimals: 18,
    symbol: "CATBNT",
    contract: "0xB3c55930368D71F643C3775869aFC73f6c5237b2"
  },
  {
    decimals: 18,
    symbol: "FTTBNT",
    contract: "0x140d47AeA2f10FfF26de4150971e600A2e010A81"
  },
  {
    decimals: 18,
    symbol: "WLKBNT",
    contract: "0xd387CDAF85429b455f0F716D51Be33db2FC00463"
  },
  {
    decimals: 18,
    symbol: "DXDBNT",
    contract: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48"
  },
  {
    decimals: 18,
    symbol: "MNTPBNT",
    contract: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9"
  },
  {
    decimals: 18,
    symbol: "INVOXBNT",
    contract: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225"
  },
  {
    decimals: 18,
    symbol: "EXO",
    contract: "0xE58E751abA3B9406367B5F3CbC39c2Fa9B519789"
  },
  {
    decimals: 18,
    symbol: "EXOBNT",
    contract: "0xa8E7117ac5d76fC147B71524780327AA218B5612"
  },
  {
    decimals: 18,
    symbol: "XRTBNT",
    contract: "0x111252C5A7fb75d541071753bd1fAAf367d0321F"
  },
  {
    decimals: 18,
    symbol: "MATICBNT",
    contract: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9"
  },
  {
    decimals: 18,
    symbol: "SVDBNT",
    contract: "0x8DCF1cA9f4716ef8e86A29f224237540f3c7ABad"
  },
  {
    decimals: 18,
    symbol: "JRT90BNT10",
    contract: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84"
  },
  {
    decimals: 18,
    symbol: "wNXMBNT",
    contract: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c"
  },
  {
    decimals: 18,
    symbol: "AIXBNT",
    contract: "0xA415cD56C694bd7402d14560D18Bb19A28F77617"
  },
  {
    decimals: 18,
    symbol: "EVO",
    contract: "0xefBd6D7deF37ffae990503EcdB1291B2f7E38788"
  },
  {
    decimals: 18,
    symbol: "EVOBNT",
    contract: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209"
  },
  {
    decimals: 18,
    symbol: "STACBNT",
    contract: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a"
  },
  {
    decimals: 18,
    symbol: "BANDBNT",
    contract: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5"
  },
  {
    decimals: 18,
    symbol: "GRIGUSDB",
    contract: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b"
  },
  {
    decimals: 18,
    symbol: "JNTR/e",
    contract: "0x2f005Cc29267f3B57E643B01575ec81789947142"
  },
  {
    decimals: 18,
    symbol: "WISHBNT",
    contract: "0x1C9Df905571B22214Fa5FB10ad99ebe327f199C5"
  },
  {
    decimals: 18,
    symbol: "FLIXXBNT",
    contract: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE"
  },
  {
    decimals: 18,
    symbol: "LKSC",
    contract: "0xfC4A2Cd574bdcC385173f03A6a52cC3B853BB9d4"
  },
  {
    decimals: 18,
    symbol: "LKSCBNT",
    contract: "0x500f3e107A6d62bb15394892a22495ACF71D007F"
  },
  {
    decimals: 18,
    symbol: "NEXOUSDB",
    contract: "0x515d562496C43487eb2DDce1a2A7721148D44E36"
  },
  {
    decimals: 18,
    symbol: "ZRXUSDB",
    contract: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2"
  },
  {
    decimals: 18,
    symbol: "ACPT",
    contract: "0xcAd2d4C4469fF09aB24d02A63BCeDfCD44bE0645"
  },
  {
    decimals: 18,
    symbol: "ACPTBNT",
    contract: "0x9E7749E446572842C7c0E1B76b673e9D1332db11"
  },
  {
    decimals: 18,
    symbol: "ANKBNT",
    contract: "0x437F7d93540094Da58F337644ba7D6E5Ad823564"
  },
  {
    decimals: 18,
    symbol: "ETHUSDB",
    contract: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F"
  },
  {
    decimals: 18,
    symbol: "ATSBNT",
    contract: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB"
  },
  {
    decimals: 18,
    symbol: "PRTLBNT",
    contract: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d"
  },
  {
    decimals: 18,
    symbol: "C20BNT",
    contract: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015"
  },
  {
    decimals: 18,
    symbol: "pBTCBNT",
    contract: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65"
  },
  {
    decimals: 18,
    symbol: "MLNUSDB",
    contract: "0x0D6777BFc95b284eA9246c889E99903641129D72"
  },
  {
    decimals: 18,
    symbol: "YHTS",
    contract: "0xcf33Eb02227255c45F595727Dbb24cE16afc36A2"
  },
  {
    decimals: 18,
    symbol: "YHTSBNT",
    contract: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd"
  },
  {
    decimals: 18,
    symbol: "pBTCUSDB",
    contract: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E"
  },
  {
    decimals: 18,
    symbol: "UBTBNT",
    contract: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F"
  },
  {
    decimals: 18,
    symbol: "LOOMUSDB",
    contract: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69"
  },
  {
    decimals: 18,
    symbol: "BNTGRG",
    contract: "0x0Dc4320ba50b7E05FC73b4531C59aCB46c5A7dD6"
  },
  {
    decimals: 18,
    symbol: "BAXBNT",
    contract: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4"
  },
  {
    decimals: 18,
    symbol: "RLCBNT",
    contract: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2"
  },
  {
    decimals: 18,
    symbol: "DAIUSDB",
    contract: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4"
  },
  {
    decimals: 18,
    symbol: "REPUXBNT",
    contract: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50"
  },
  {
    decimals: 4,
    symbol: "AUTO",
    contract: "0x0Ed55F31EE2F9875A738C6496842b0E6519D7833"
  },
  {
    decimals: 18,
    symbol: "AUTOBNT",
    contract: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5"
  },
  {
    decimals: 18,
    symbol: "TBXBNT",
    contract: "0xE844E4EF529CB1A507D47206bEeF65a921B07287"
  },
  {
    decimals: 18,
    symbol: "SNXUSDB",
    contract: "0x28271853E950bE371B050F3f93aA0146225bF374"
  },
  {
    decimals: 18,
    symbol: "DRGNBNT",
    contract: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24"
  },
  {
    decimals: 18,
    symbol: "ENJUSDB",
    contract: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91"
  },
  {
    decimals: 18,
    symbol: "CAP",
    contract: "0x43044f861ec040DB59A7e324c40507adDb673142"
  },
  {
    decimals: 18,
    symbol: "BNTCAP",
    contract: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817"
  },
  {
    decimals: 18,
    symbol: "BFZ",
    contract: "0xCFABaFF3bb057ba878f43ce027c9266D2F900561"
  },
  {
    decimals: 18,
    symbol: "BFZBNT",
    contract: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11"
  },
  {
    decimals: 18,
    symbol: "TBC",
    contract: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a"
  },
  {
    decimals: 18,
    symbol: "TBCUSDB",
    contract: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B"
  },
  {
    decimals: 18,
    symbol: "KINBNT",
    contract: "0x26b5748F9253363f95e37767e9ed7986877A4B1b"
  },
  {
    decimals: 18,
    symbol: "ALBT",
    contract: "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0"
  },
  {
    decimals: 18,
    symbol: "ALBTUSDT",
    contract: "0x01697e379E6B2dA6A6D052BAa09F98488433e167"
  },
  {
    decimals: 18,
    symbol: "PKGBNT",
    contract: "0xE729024679C29c2660E05727ECAfd3D8792b8111"
  },
  {
    decimals: 18,
    symbol: "MDZA",
    contract: "0x0eCDd783dc7bF820614044B51862ED29714d2BA5"
  },
  {
    decimals: 18,
    symbol: "MDZAUSDB",
    contract: "0x7651021390129c9c2672f47292C31b33f63EE5Cc"
  },
  {
    decimals: 18,
    symbol: "LOCBNT",
    contract: "0x38838B895cbf02048455Fb7f649D97C564fC18a8"
  },
  {
    decimals: 4,
    symbol: "MORPH",
    contract: "0x2Ef27BF41236bD859a95209e17a43Fbd26851f92"
  },
  {
    decimals: 18,
    symbol: "MORPHBNT",
    contract: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc"
  },
  {
    decimals: 18,
    symbol: "AGSBNT",
    contract: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6"
  },
  {
    decimals: 18,
    symbol: "USDTUSDB",
    contract: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045"
  },
  {
    decimals: 18,
    symbol: "TBCBNT",
    contract: "0x536545f6B120C2fD099370334097b35bB2403BC3"
  },
  {
    decimals: 18,
    symbol: "OMGUSDB",
    contract: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b"
  },
  {
    decimals: 18,
    symbol: "REAL",
    contract: "0x6b4389Afb3e243A65668B7311fA9Ef092A8a3B64"
  },
  {
    decimals: 18,
    symbol: "REAL",
    contract: "0xdbcaE67ECBA9DAAC61B1167cc8108B63BF8d59A2"
  },
  {
    decimals: 3,
    symbol: "EMIT",
    contract: "0xb5f278Ee11811eFEC0692EC61b1e9f9984f2de11"
  },
  {
    decimals: 18,
    symbol: "EMIT1USDB",
    contract: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60"
  },
  {
    decimals: 4,
    symbol: "BUFFGATE",
    contract: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876"
  },
  {
    decimals: 18,
    symbol: "BUFFGATEUSDB",
    contract: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F"
  },
  {
    decimals: 18,
    symbol: "STORMBNT",
    contract: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d"
  },
  {
    decimals: 8,
    symbol: "MPT",
    contract: "0x2cC1bE643e0882fB096f7f96d2b6Ca079ad5270c"
  },
  {
    decimals: 18,
    symbol: "MPTBNT",
    contract: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb"
  },
  {
    decimals: 8,
    symbol: "CGT",
    contract: "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0"
  },
  {
    decimals: 18,
    symbol: "CGTBNT",
    contract: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713"
  },
  {
    decimals: 18,
    symbol: "BBOBNT",
    contract: "0x980B4118dAb781829DF80D7912d70B059a280DAd"
  },
  {
    decimals: 18,
    symbol: "EVEDBNT",
    contract: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6"
  },
  {
    decimals: 18,
    symbol: "EST",
    contract: "0x0Efc2390C79C47452898a234a27F2b9C39A7a725"
  },
  {
    decimals: 18,
    symbol: "ESTBNT",
    contract: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2"
  },
  {
    decimals: 18,
    symbol: "CRTS",
    contract: "0x825a64810e3EE35bD64c940140eA91a609608ABE"
  },
  {
    decimals: 18,
    symbol: "CRTSBNT",
    contract: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236"
  },
  {
    decimals: 18,
    symbol: "CBIX7",
    contract: "0xCf8f9555D55CE45a3A33a81D6eF99a2a2E71Dee2"
  },
  {
    decimals: 18,
    symbol: "CBIX7USDB",
    contract: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3"
  },
  {
    decimals: 18,
    symbol: "DZARUSDB",
    contract: "0x7484867773Bc6f3110f710577d36A3605DBa59DF"
  },
  {
    decimals: 18,
    symbol: "ESZBNT",
    contract: "0xA2020e324C365D05e87cf25552E6e6734260b089"
  },
  {
    decimals: 18,
    symbol: "STONK",
    contract: "0xb60Fde5D798236fBF1e2697B2A0645380921FccF"
  },
  {
    decimals: 18,
    symbol: "STONKBNT",
    contract: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B"
  },
  {
    decimals: 18,
    symbol: "WINGSBNT",
    contract: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e"
  },
  {
    decimals: 18,
    symbol: "RDNBNT",
    contract: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF"
  },
  {
    decimals: 0,
    symbol: "FCO",
    contract: "0x4cbdaea41E4C864477E1430a896d9E3Bac11f593"
  },
  {
    decimals: 18,
    symbol: "FCOUSDB",
    contract: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae"
  },
  {
    decimals: 18,
    symbol: "GESBNT",
    contract: "0x5972CED550248B17c9F674639D33E5446b6ad95A"
  },
  {
    decimals: 18,
    symbol: "ACD",
    contract: "0xEa6d4D7B36C00B3611dE0B0e1982B12E9e736c66"
  },
  {
    decimals: 18,
    symbol: "ACDBNT",
    contract: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A"
  },
  {
    decimals: 18,
    symbol: "BUSDUSDB",
    contract: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A"
  },
  {
    decimals: 18,
    symbol: "GLDR",
    contract: "0xF2BA4AFcBE22F0e626d67D8f31E96428706282e9"
  },
  {
    decimals: 18,
    symbol: "GLDRBNT",
    contract: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC"
  },
  {
    decimals: 18,
    symbol: "FXCBNT",
    contract: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228"
  },
  {
    decimals: 4,
    symbol: "MGT",
    contract: "0xA207Ef81C35848A60A732005A42fAe0BA89A9bE2"
  },
  {
    decimals: 18,
    symbol: "MGTBNT",
    contract: "0x0bA204702F102aD3B0156164754e8af18C24C49C"
  },
  {
    decimals: 18,
    symbol: "HOTEL",
    contract: "0xf8A2ED21fEa517665b35aC824387bf9b41c71919"
  },
  {
    decimals: 18,
    symbol: "HOTELBNT",
    contract: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933"
  },
  {
    decimals: 18,
    symbol: "ONGBNT",
    contract: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8"
  },
  {
    decimals: 18,
    symbol: "KNCUSDB",
    contract: "0xD69AE1D715d7451646107D43777139B0a42d7c63"
  },
  {
    decimals: 8,
    symbol: "4XB",
    contract: "0xA3AC41Fde5f3a569fa79E81fFe6734ee8097Ce9d"
  },
  {
    decimals: 8,
    symbol: "4XBBNT",
    contract: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f"
  },
  {
    decimals: 18,
    symbol: "BATUSDB",
    contract: "0x7FfE011B93e06FA14CE5A6E00320937652664366"
  },
  {
    decimals: 18,
    symbol: "MKRUSDB",
    contract: "0x29dF79CB535f1fe82cA65d52cB8B5EE82D7E98a6"
  },
  {
    decimals: 18,
    symbol: "TRSTBNT",
    contract: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C"
  },
  {
    decimals: 18,
    symbol: "sUSDUSDB",
    contract: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5"
  },
  {
    decimals: 18,
    symbol: "NMRUSDB",
    contract: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556"
  },
  {
    decimals: 18,
    symbol: "DANBNT",
    contract: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40"
  },
  {
    decimals: 18,
    symbol: "KEYBNT",
    contract: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954"
  },
  {
    decimals: 18,
    symbol: "XIOUSDB",
    contract: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594"
  },
  {
    decimals: 18,
    symbol: "REPUSDB",
    contract: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c"
  },
  {
    decimals: 18,
    symbol: "USDCUSDB",
    contract: "0x71c414DaCe65ABff9351E215d25f17F675241c0A"
  },
  {
    decimals: 18,
    symbol: "TUSDUSDB",
    contract: "0x06cd5923593a359111cDec66E74c62E831C8aEab"
  },
  {
    decimals: 18,
    symbol: "SYB7",
    contract: "0x86A49f08Ab6531A3E0e814c75F36de661B986Ca1"
  },
  {
    decimals: 18,
    symbol: "SYB7BNT",
    contract: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F"
  },
  {
    decimals: 18,
    symbol: "TSTST",
    contract: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E"
  },
  {
    decimals: 18,
    symbol: "FKXBNT",
    contract: "0x80c222E38fb57F0710aF21128535096D90503285"
  },
  {
    decimals: 18,
    symbol: "RLCUSDB",
    contract: "0x6534d2A69c2C7774DF42A55A1678bD008984B324"
  },
  {
    decimals: 6,
    symbol: "POWRUSDB",
    contract: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E"
  },
  {
    decimals: 18,
    symbol: "AIONBNT",
    contract: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845"
  },
  {
    decimals: 18,
    symbol: "NPXSBNT",
    contract: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4"
  },
  {
    decimals: 18,
    symbol: "SIGBNT",
    contract: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29"
  },
  {
    decimals: 18,
    symbol: "FTH",
    contract: "0xB414F8Ec2D14c64f37B1559CBE43746284514596"
  },
  {
    decimals: 18,
    symbol: "FTHBNT",
    contract: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499"
  },
  {
    decimals: 18,
    symbol: "MGTBNT",
    contract: "0x6F60D44A0d6fB95E037A099F8642f949c959a363"
  },
  {
    decimals: 18,
    symbol: "CEEKUSDB",
    contract: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25"
  },
  {
    decimals: 18,
    symbol: "SHPBNT",
    contract: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476"
  },
  {
    decimals: 18,
    symbol: "HOTBNT",
    contract: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a"
  },
  {
    decimals: 18,
    symbol: "EDGBNT",
    contract: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D"
  },
  {
    decimals: 18,
    symbol: "CLNBNT",
    contract: "0xEB027349398De19D925DefC15c4302fE92FC69f9"
  },
  {
    decimals: 18,
    symbol: "XZAR",
    contract: "0x48f07301E9E29c3C38a80ae8d9ae771F224f1054"
  },
  {
    decimals: 18,
    symbol: "XZARBNT",
    contract: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444"
  },
  {
    decimals: 18,
    symbol: "WEBBNT",
    contract: "0x5094841D5eE018a5E29E23055aFC263093f95a3E"
  },
  {
    decimals: 18,
    symbol: "UMABNT",
    contract: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF"
  },
  {
    decimals: 18,
    symbol: "TOMOEBNT",
    contract: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738"
  },
  {
    decimals: 18,
    symbol: "UNIBNT",
    contract: "0x8b3082e273E4B923830c637a203c1C1D963cA307"
  },
  {
    decimals: 18,
    symbol: "LENDBNT",
    contract: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA"
  },
  {
    decimals: 18,
    symbol: "BUFFGATEBNT",
    contract: "0x2d35087923194400d329EE74b45CBc77b7d573Ff"
  },
  {
    decimals: 18,
    symbol: "BNTFTT",
    contract: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb"
  },
  {
    decimals: 18,
    symbol: "AAVE",
    contract: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
  },
  {
    decimals: 18,
    symbol: "AAVEBNT",
    contract: "0x6c84F4ccC916ACf792538f1293b286b540906A2a"
  },
  {
    decimals: 18,
    symbol: "BNTvBNT",
    contract: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b"
  },
  {
    decimals: 18,
    symbol: "XTRD",
    contract: "0x9c794f933b4DD8B49031A79b0f924D68BEF43992"
  },
  {
    decimals: 18,
    symbol: "XTRD",
    contract: "0x295F136eB8c8D1429a77A2B5E0851AA035c8297C"
  },
  {
    decimals: 18,
    symbol: "KP3R",
    contract: "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44"
  },
  {
    decimals: 18,
    symbol: "KP3R",
    contract: "0x9a88524DBc8C0F1CB67c6F6a695098d5BFCA4476"
  },
  {
    decimals: 18,
    symbol: "SVCS",
    contract: "0x9CEc686ba6f07D6135B2091140c795166Ef5b761"
  },
  {
    decimals: 18,
    symbol: "SVCS",
    contract: "0xd7a4f41626fF2a52f58de1eB5Df6F79F05E5977F"
  },
  {
    decimals: 18,
    symbol: "BUSDBNT",
    contract: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9"
  },
  {
    decimals: 18,
    symbol: "COMPBNT",
    contract: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4"
  },
  {
    decimals: 18,
    symbol: "CROBNT",
    contract: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b"
  },
  {
    decimals: 18,
    symbol: "CRVBNT",
    contract: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50"
  },
  {
    decimals: 18,
    symbol: "ZRXBNT",
    contract: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb"
  },
  {
    decimals: 18,
    symbol: "GUSDBNT",
    contract: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44"
  },
  {
    decimals: 18,
    symbol: "QNTBNT",
    contract: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62"
  },
  {
    decimals: 18,
    symbol: "RARI",
    contract: "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF"
  },
  {
    decimals: 18,
    symbol: "RARIBNT",
    contract: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d"
  },
  {
    decimals: 18,
    symbol: "sBTCBNT",
    contract: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96"
  },
  {
    decimals: 18,
    symbol: "SNXBNT",
    contract: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde"
  },
  {
    decimals: 18,
    symbol: "sUSDBNT",
    contract: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4"
  },
  {
    decimals: 18,
    symbol: "SUSHIBNT",
    contract: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec"
  },
  {
    decimals: 18,
    symbol: "SXPBNT",
    contract: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2"
  },
  {
    decimals: 6,
    symbol: "ICT",
    contract: "0x2d71983E810B9e95258966B9c164C4d61a829bA9"
  },
  {
    decimals: 18,
    symbol: "ICTBNT",
    contract: "0xb381D21c09BaC7278b6802193167A2a01127b976"
  },
  {
    decimals: 8,
    symbol: "DCX",
    contract: "0x199c3DdedB0e91dB3897039AF27c23286269F088"
  },
  {
    decimals: 18,
    symbol: "DCXUSDB",
    contract: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5"
  },
  {
    decimals: 2,
    symbol: "STC",
    contract: "0xb8B7791b1A445FB1e202683a0a329504772e0E52"
  },
  {
    decimals: 18,
    symbol: "STCUSDB",
    contract: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137"
  },
  {
    decimals: 18,
    symbol: "FOURUSDB",
    contract: "0x23736A2c9728C309039831c245754E19cEd07546"
  },
  {
    decimals: 18,
    symbol: "ONTO",
    contract: "0xCB0aD5f479812edD6e2cED1cfE621bF39D7E9158"
  },
  {
    decimals: 18,
    symbol: "ONTOBNT",
    contract: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F"
  },
  {
    decimals: 8,
    symbol: "ECC",
    contract: "0xD5bF66fF3Dab4c74Ac6014fd2181Bd3aD1bBaF32"
  },
  {
    decimals: 18,
    symbol: "ECCUSDT",
    contract: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692"
  },
  {
    decimals: 18,
    symbol: "YFM",
    contract: "0xa665FED1b0C9dA00e91ca582f77dF36E325048c5"
  },
  {
    decimals: 18,
    symbol: "YFMBNT",
    contract: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900"
  },
  {
    decimals: 18,
    symbol: "MITxUSDB",
    contract: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90"
  },
  {
    decimals: 18,
    symbol: "BALBNT",
    contract: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1"
  },
  {
    decimals: 18,
    symbol: "COMM",
    contract: "0xc7DeB5543CfA97b0Af2841418f53B8E554Ff566A"
  },
  {
    decimals: 18,
    symbol: "COMMBNT",
    contract: "0xb83546551C9d4F6D7873804a7352FA930404260d"
  },
  {
    decimals: 18,
    symbol: "CHZBNT",
    contract: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8"
  },
  {
    decimals: 18,
    symbol: "cUSDBNT",
    contract: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e"
  },
  {
    decimals: 18,
    symbol: "BLY",
    contract: "0xf8aD7dFe656188A23e89da09506Adf7ad9290D5d"
  },
  {
    decimals: 18,
    symbol: "BLYBNT",
    contract: "0x782E07B7Bbf908135D083c4f65459f8F1549a415"
  },
  {
    decimals: 6,
    symbol: "BTZC",
    contract: "0x80640db285Cc63496bdd8c1980A7f4526A4D477F"
  },
  {
    decimals: 18,
    symbol: "BTZCUSDB",
    contract: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C"
  },
  {
    decimals: 18,
    symbol: "WBTCpBTC",
    contract: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3"
  },
  {
    decimals: 18,
    symbol: "HYBNT",
    contract: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86"
  },
  {
    decimals: 18,
    symbol: "SNXUSDB",
    contract: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692"
  },
  {
    decimals: 18,
    symbol: "BNC",
    contract: "0xbe5b336eF62D1626940363Cf34bE079e0AB89F20"
  },
  {
    decimals: 18,
    symbol: "BNCBNT",
    contract: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30"
  },
  {
    decimals: 18,
    symbol: "BNTQASH",
    contract: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1"
  },
  {
    decimals: 18,
    symbol: "CBLT",
    contract: "0x29a99c126596c0Dc96b02A88a9EAab44EcCf511e"
  },
  {
    decimals: 18,
    symbol: "CBLTBNT",
    contract: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37"
  },
  {
    decimals: 18,
    symbol: "CMCTBNT",
    contract: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d"
  },
  {
    decimals: 18,
    symbol: "PEG:USD",
    contract: "0xa485bD50228440797Abb4d4595161d7546811160"
  },
  {
    decimals: 18,
    symbol: "BNT-USD",
    contract: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe"
  },
  {
    decimals: 18,
    symbol: "SWRV",
    contract: "0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433"
  },
  {
    decimals: 18,
    symbol: "BNTSWRV",
    contract: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96"
  },
  {
    decimals: 18,
    symbol: "STMBNT",
    contract: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81"
  },
  {
    decimals: 18,
    symbol: "BCSBNT",
    contract: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303"
  },
  {
    decimals: 18,
    symbol: "USDB/CAT",
    contract: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60"
  },
  {
    decimals: 18,
    symbol: "J8TBNT",
    contract: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36"
  }
].map(x => ({ ...x, decimals: String(x.decimals) }));

const currentBlockTwo$ = new Subject<number>();
const convertersAndAnchors$ = new Subject<ConverterAndAnchor>();
const bufferToggle$ = new Subject();

convertersAndAnchors$
  .pipe(firstItem(), delay(1))
  .subscribe(() => bufferToggle$.next());

const bufferedAnchorsAndConverters$ = convertersAndAnchors$.pipe(
  buffer(bufferToggle$),
  scan(
    (acc, item) => {
      const allData = [...acc.data, ...item];

      const sortedData = sortAlongSide(
        allData,
        x => x.anchorAddress,
        priorityEthPools
      );
      const toEmit = sortedData[0];

      return {
        data: sortedData.slice(1),
        toEmit
      };
    },
    {
      data: [] as ConverterAndAnchor[],
      // @ts-ignore
      toEmit: (undefined as ConverterAndAnchor)!
    }
  ),
  filter(x => Boolean(x.toEmit)),
  map(x => x.toEmit)
);

combineLatest([currentBlockTwo$, bufferedAnchorsAndConverters$])
  .pipe(
    concatMap(([currentBlock, converterAndAnchor]) => {
      const blockYesterday = rewindBlocksByDays(currentBlock, 1);
      const { converterAddress, anchorAddress } = converterAndAnchor;
      return getHistoricFees(
        w3,
        anchorAddress,
        converterAddress,
        blockYesterday
      );
    }),
    tap(() => bufferToggle$.next()),
    filter(feeEvents => feeEvents.length > 0)
  )
  .subscribe(fees => {
    vxm.ethBancor.updateHistoricPoolFees(fees);
  });

const w3: Web3 = web3;

const protectedPositionShape = (storeAddress: string, protectionId: string) => {
  const contract = buildLiquidityProtectionStoreContract(storeAddress);
  return {
    positionId: protectionId,
    position: contract.methods.protectedLiquidity(protectionId)
  };
};

interface Balance {
  balance: string;
  id: string;
}

interface PoolApr {
  poolId: string;
  oneWeekApr: string;
}

const calculateReturnOnInvestment = (
  investment: string,
  newReturn: string
): string => {
  return new BigNumber(newReturn).div(investment).minus(1).toString();
};

// returns the rate of 1 pool token in reserve token units
const calculatePoolTokenRate = (
  poolTokenSupply: string,
  reserveTokenBalance: string
) => new BigNumber(reserveTokenBalance).times(2).div(poolTokenSupply);

const notBadRelay = (converterAndAnchor: ConverterAndAnchor) =>
  !compareString(
    converterAndAnchor.anchorAddress,
    "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2"
  ) &&
  !compareString(
    converterAndAnchor.anchorAddress,
    "0x7Ef1fEDb73BD089eC1010bABA26Ca162DFa08144"
  );

const decodedToTimedDecoded = <T>(
  event: DecodedEvent<T>,
  knownBlockNumber: number,
  knownBlockNumberTime: number
): DecodedTimedEvent<T> => ({
  ...event,
  blockTime: estimateBlockTimeUnix(
    Number(event.blockNumber),
    knownBlockNumber,
    knownBlockNumberTime
  )
});

const tokenAddressesInEvent = (
  event:
    | DecodedEvent<ConversionEventDecoded>
    | DecodedEvent<AddLiquidityEvent>
    | DecodedEvent<RemoveLiquidityEvent>
): string[] => {
  if (Object.keys(event.data).includes("from")) {
    const actualEvent = event as DecodedEvent<ConversionEventDecoded>;
    const res = [actualEvent.data.from.address, actualEvent.data.to.address];
    const isArrayOfStrings = res.every(address => typeof address == "string");
    if (!isArrayOfStrings)
      throw new Error("Failed to get token addresses in event");
    return res;
  } else if (Object.keys(event.data).includes("tokenAdded")) {
    const actualEvent = event as DecodedEvent<AddLiquidityEvent>;
    return [actualEvent.data.tokenAdded];
  } else if (Object.keys(event.data).includes("tokenRemoved")) {
    const actualEvent = event as DecodedEvent<RemoveLiquidityEvent>;
    return [actualEvent.data.tokenRemoved];
  } else {
    throw new Error("Failed to find token");
  }
};

const estimateBlockTimeUnix = (
  blockNumber: number,
  knownBlockNumber: number,
  knownBlockNumberTime: number,
  averageBlockTimeSeconds = 13
): number => {
  if (knownBlockNumber < blockNumber) {
    const blockgap = blockNumber - knownBlockNumber;
    const timegap = blockgap * averageBlockTimeSeconds;
    return knownBlockNumberTime + timegap;
  }
  const blockGap = knownBlockNumber - blockNumber;
  const timeGap = blockGap * averageBlockTimeSeconds;
  return knownBlockNumberTime - timeGap;
};

const addLiquidityEventToView = (
  addLiquidity: DecodedTimedEvent<AddLiquidityEvent>[],
  tokens: ViewToken[],
  createBlockExplorerTxLink: (hash: string) => string,
  createBlockExplorerAccountLink: (account: string) => string
): ViewLiquidityEvent<ViewAddEvent> => {
  const firstItem = first(addLiquidity)!;
  const account = firstItem.data.trader;

  return {
    account,
    type: "add",
    accountLink: createBlockExplorerAccountLink(account),
    data: {
      tokensAdded: addLiquidity.map(event => {
        const token = findOrThrow(tokens, token =>
          compareString(token.contract, event.data.tokenAdded)
        );
        const decAmount = shrinkToken(event.data.amount, token.precision);
        return viewTokenToViewAmountWithMeta(decAmount, token);
      })
    },
    txHash: firstItem.txHash,
    txLink: createBlockExplorerTxLink(firstItem.txHash),
    unixTime: firstItem.blockTime,
    valueTransmitted: 0
  };
};

const viewTokenToViewAmountWithMeta = (
  amount: string,
  token: ViewToken
): ViewAmountWithMeta => ({
  amount: amount,
  decimals: token.precision,
  id: token.id,
  logo: token.logo,
  symbol: token.symbol
});

const removeLiquidityEventToView = (
  removeLiquidity: DecodedTimedEvent<RemoveLiquidityEvent>[],
  tokens: ViewToken[],
  createBlockExplorerTxLink: (hash: string) => string,
  createBlockExplorerAccountLink: (account: string) => string
): ViewLiquidityEvent<ViewRemoveEvent> => {
  const firstItem = first(removeLiquidity)!;
  const account = firstItem.data.trader;

  return {
    account,
    type: "remove",
    accountLink: createBlockExplorerAccountLink(account),
    data: {
      tokensRemoved: removeLiquidity.map(event => {
        const token = findOrThrow(tokens, token =>
          compareString(token.id, event.data.tokenRemoved)
        );
        const decAmount = shrinkToken(event.data.amount, token.precision);
        return viewTokenToViewAmountWithMeta(decAmount, token);
      })
    },
    txHash: firstItem.txHash,
    txLink: createBlockExplorerTxLink(firstItem.txHash),
    unixTime: firstItem.blockTime,
    valueTransmitted: 0
  };
};

const conversionEventToViewTradeEvent = (
  conversion: DecodedTimedEvent<ConversionEventDecoded>,
  tokenPrices: ViewToken[],
  createBlockExplorerTxLink: (hash: string) => string,
  createBlockExplorerAccountLink: (account: string) => string
): ViewLiquidityEvent<ViewTradeEvent> => {
  const fromToken = findOrThrow(
    tokenPrices,
    price => compareString(price.id, conversion.data.from.address),
    `failed finding token meta passed to conversion event to view trade ${conversion.data.from.address}`
  );
  const toToken = findOrThrow(
    tokenPrices,
    price => compareString(price.id, conversion.data.to.address),
    `failed finding token meta passed to conversion event to view trade ${conversion.data.to.address}`
  );

  const fromAmountDec = shrinkToken(
    conversion.data.from.weiAmount,
    fromToken.precision
  );

  const toAmountDec = shrinkToken(
    conversion.data.to.weiAmount,
    toToken.precision
  );

  return {
    txLink: createBlockExplorerTxLink(conversion.txHash),
    accountLink: createBlockExplorerAccountLink(conversion.data.trader),
    valueTransmitted: new BigNumber(fromAmountDec)
      .times(fromToken.price || 0)
      .toNumber(),
    type: "swap",
    unixTime: conversion.blockTime,
    account: conversion.data.trader,
    txHash: conversion.txHash,
    data: {
      from: viewTokenToViewAmountWithMeta(fromAmountDec, fromToken),
      to: viewTokenToViewAmountWithMeta(toAmountDec, toToken)
    }
  };
};

type Wei = string;

const calculateExpectedPoolTokenReturnV2 = (
  poolTokenSupply: Wei,
  stakedReserveBalance: Wei,
  reserveTokenAmountToDeposit: Wei
): Wei =>
  new BigNumber(poolTokenSupply)
    .div(stakedReserveBalance)
    .times(reserveTokenAmountToDeposit)
    .toFixed(0);

const calculateShareOfPool = (
  poolTokensToAdd: Wei,
  poolTokenSupply: Wei,
  existingUserPoolTokenBalance?: Wei
): number => {
  if (new BigNumber(poolTokenSupply).eq(0)) return 1;

  const suggestedSmartTokens = new BigNumber(poolTokensToAdd).plus(
    existingUserPoolTokenBalance || 0
  );

  const suggestedSmartTokenSupply = new BigNumber(poolTokenSupply).plus(
    poolTokensToAdd
  );

  const shareOfPool = suggestedSmartTokens
    .div(suggestedSmartTokenSupply)
    .toNumber();

  return shareOfPool;
};

const compareRelayByReserves = (a: Relay, b: Relay) =>
  a.reserves.every(reserve =>
    b.reserves.some(r => compareString(reserve.contract, r.contract))
  );

const rawAbiV2ToStacked = (
  rawAbiV2: RawAbiV2PoolBalances
): StakedAndReserve => {
  const primaryReserveWeight =
    rawAbiV2.effectiveReserveWeights && rawAbiV2.effectiveReserveWeights[0];
  const secondaryReserveWeight =
    rawAbiV2.effectiveReserveWeights && rawAbiV2.effectiveReserveWeights[1];

  const reserveOneIsPrimaryReserve = compareString(
    rawAbiV2.reserveOne,
    rawAbiV2.primaryReserveToken
  );

  const reserveOneReserveWeight = reserveOneIsPrimaryReserve
    ? primaryReserveWeight
    : secondaryReserveWeight;
  const reserveTwoReserveWeight = reserveOneIsPrimaryReserve
    ? secondaryReserveWeight
    : primaryReserveWeight;

  return {
    converterAddress: rawAbiV2.converterAddress,
    reserves: [
      {
        reserveAddress: rawAbiV2.reserveOne,
        stakedBalance: rawAbiV2.reserveOneStakedBalance,
        reserveWeight: reserveOneReserveWeight,
        poolTokenAddress: rawAbiV2.reserveOnePoolToken
      },
      {
        reserveAddress: rawAbiV2.reserveTwo,
        stakedBalance: rawAbiV2.reserveTwoStakedBalance,
        reserveWeight: reserveTwoReserveWeight,
        poolTokenAddress: rawAbiV2.reserveTwoPoolToken
      }
    ]
  };
};

const getAnchorTokenAddresses = (relay: Relay): string[] => {
  if (relay.converterType == PoolType.ChainLink) {
    const actualRelay = relay as ChainLinkRelay;
    return actualRelay.anchor.poolTokens.map(x => x.poolToken.contract);
  } else if (relay.converterType == PoolType.Traditional) {
    const actualRelay = relay as TraditionalRelay;
    return [actualRelay.anchor.contract];
  } else {
    throw new Error("Failed to identify type of relay passed");
  }
};

interface RefinedAbiRelay {
  anchorAddress: string;
  reserves: [string, string];
  version: number;
  converterType: PoolType;
  converterAddress: string;
  connectorToken1: string;
  connectorToken2: string;
  connectorTokenCount: string;
  conversionFee: string;
  owner: string;
}

const ppmToDec = (ppm: number | string): number =>
  new BigNumber(ppm).dividedBy(oneMillion).toNumber();

const determineConverterType = (
  converterType: string | undefined
): PoolType => {
  if (typeof converterType == "undefined") {
    return PoolType.Traditional;
  } else if (Number(converterType) == 32) {
    return PoolType.Traditional;
  } else if (Number(converterType) == 1) {
    return PoolType.Traditional;
  } else if (Number(converterType) == 2) {
    return PoolType.ChainLink;
  } else if (Number(converterType) == 0) {
    return PoolType.Liquid;
  }
  throw new Error("Failed to determine the converter type");
};

const getHistoricFees = async (
  w3: Web3,
  id: string,
  converterAddress: string,
  blockHoursAgo: number
): Promise<PreviousPoolFee[]> => {
  let previousPoolFees: PreviousPoolFee[] = [];

  const contract = buildV28ConverterContract(converterAddress, w3);
  const options = {
    fromBlock: 0,
    toBlock: "latest"
  };

  try {
    const events = await contract.getPastEvents("ConversionFeeUpdate", options);

    previousPoolFees = events
      .filter(event => event.blockNumber >= blockHoursAgo)
      .map(event => ({
        id,
        oldDecFee: ppmToDec(event.returnValues["_prevFee"]),
        blockNumber: event.blockNumber
      }));
    return previousPoolFees;
  } catch (err) {
    console.error(err);
  }

  return previousPoolFees;
};

const blockNumberHoursAgo = async (hours: number, w3: Web3) => {
  const currentBlock = await w3.eth.getBlockNumber();
  const secondsPerBlock = 13.3;
  const secondsToRewind = moment.duration(hours, "hours").asSeconds();
  const blocksToRewind = parseInt(
    new BigNumber(secondsToRewind).div(secondsPerBlock).toString()
  );
  console.log(secondsToRewind, "are seconds to rewind", blocksToRewind);
  return {
    blockHoursAgo: currentBlock - blocksToRewind,
    currentBlock
  };
};

const smartTokenAnchor = (smartToken: Token) => ({
  anchor: smartToken,
  converterType: PoolType.Traditional
});

const poolsToAwait = ["0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533"];

const newRelayToRelayWithBalances = (
  newRelay: NewRelay
): RelayWithReserveBalances => ({
  anchor: {
    ...newRelay.poolToken,
    decimals: Number(newRelay.poolToken.decimals),
    network: "ETH"
  },
  contract: newRelay.converterAddress,
  converterType: newRelay.converterType,
  fee: newRelay.fee,
  id: newRelay.poolToken.contract,
  isMultiContract: false,
  network: "ETH",
  reserveBalances: newRelay.reserves.map(x => ({
    amount: x.reserveBalance,
    id: x.contract
  })),
  reserves: newRelay.reserves.map(x => ({
    ...x,
    reserveWeight: 0.5,
    network: "ETH",
    reserveBalance: x.reserveBalance,
    decimals: Number(x.decimals),
    symbol: x.symbol,
    contract: x.contract
  })),
  version: String(newRelay.version)
});

interface UsdValue {
  id: string;
  usdPrice: string;
}

const trustedStables = (network: EthNetworks): UsdValue[] => {
  if (network == EthNetworks.Mainnet) {
    return [
      { id: "0x309627af60f0926daa6041b8279484312f2bf060", usdPrice: "1" }
    ];
  }
  return [];
};

const calculateSlippage = (
  slippageLessRate: BigNumber,
  slippagedRate: BigNumber
): BigNumber => {
  if (slippagedRate.gt(slippageLessRate)) throw new Error("Rates are bad");
  const result = slippageLessRate.minus(slippagedRate).abs();
  return result.div(slippageLessRate);
};

const buildRate = (amountEntered: BigNumber, returnAmount: BigNumber) =>
  returnAmount.div(amountEntered);

const buildRelayFeedChainkLink = ({
  relays,
  usdPriceOfBnt
}: {
  relays: RawV2Pool[];
  usdPriceOfBnt: number;
}) => relays.flatMap(relay => buildReserveFeedsChainlink(relay, usdPriceOfBnt));

const buildReserveFeedsTraditional = (
  relay: RelayWithReserveBalances,
  knownUsdPrices: UsdValue[]
): ReserveFeed[] => {
  const reservesBalances = relay.reserves.map(reserve => {
    const reserveBalance = findOrThrow(
      relay.reserveBalances,
      balance => compareString(balance.id, reserve.contract),
      "failed to find a reserve balance for reserve"
    );

    const decAmount = shrinkToken(reserveBalance.amount, reserve.decimals);
    const knownUsdPrice = knownUsdPrices.find(price =>
      compareString(price.id, reserve.contract)
    );
    return {
      reserve,
      decAmount,
      knownUsdPrice
    };
  });

  const [networkReserve, tokenReserve] = sortByNetworkTokens(
    reservesBalances,
    balance => balance.reserve.symbol.toUpperCase()
  );

  const cryptoCostOfTokenReserve = new BigNumber(networkReserve.decAmount)
    .dividedBy(tokenReserve.decAmount)
    .toNumber();
  const cryptoCostOfNetworkReserve = new BigNumber(
    tokenReserve.decAmount
  ).dividedBy(networkReserve.decAmount);

  let usdCostOfTokenReserve: number;
  let usdCostOfNetworkReserve: number;

  if (networkReserve.knownUsdPrice) {
    usdCostOfTokenReserve = new BigNumber(cryptoCostOfTokenReserve)
      .times(networkReserve.knownUsdPrice.usdPrice)
      .toNumber();
    usdCostOfNetworkReserve = new BigNumber(cryptoCostOfNetworkReserve)
      .times(usdCostOfTokenReserve)
      .toNumber();
  } else if (tokenReserve.knownUsdPrice) {
    usdCostOfNetworkReserve = new BigNumber(cryptoCostOfNetworkReserve)
      .times(tokenReserve.knownUsdPrice.usdPrice)
      .toNumber();
    usdCostOfTokenReserve = new BigNumber(cryptoCostOfTokenReserve)
      .times(usdCostOfNetworkReserve)
      .toNumber();
  } else {
    throw new Error(
      `Cannot determine the price without knowing one of the reserve prices ${JSON.stringify(
        knownUsdPrices
      )}`
    );
  }

  if (Number.isNaN(usdCostOfNetworkReserve)) usdCostOfNetworkReserve = 0;

  const liqDepth = new BigNumber(networkReserve.decAmount)
    .times(usdCostOfNetworkReserve)
    .toNumber();

  return [
    {
      reserveAddress: tokenReserve.reserve.contract,
      poolId: relay.id,
      costByNetworkUsd: usdCostOfTokenReserve,
      liqDepth,
      priority: 10
    },
    {
      reserveAddress: networkReserve.reserve.contract,
      poolId: relay.id,
      liqDepth,
      costByNetworkUsd: usdCostOfNetworkReserve,
      priority: 10
    }
  ];
};

const duplicateWith = <T>(
  arr: readonly T[],
  comparator: (a: T, b: T) => boolean
) =>
  arr.filter(
    (item, index, arr) => arr.findIndex(i => comparator(item, i)) !== index
  );

const compareById = (a: { id: string }, b: { id: string }) =>
  compareString(a.id, b.id);

const compareReserveFeedByReserveAddress = (a: ReserveFeed, b: ReserveFeed) =>
  compareString(a.reserveAddress, b.reserveAddress);

const reserveFeedToUsdPrice = (reserveFeed: ReserveFeed): UsdValue => ({
  id: reserveFeed.reserveAddress,
  usdPrice: String(reserveFeed.costByNetworkUsd)
});

const buildPossibleReserveFeedsTraditional = (
  v1Pools: RelayWithReserveBalances[],
  initialKnownPrices: UsdValue[]
): ReserveFeed[] => {
  if (initialKnownPrices.length == 0)
    throw new Error("Must know the price of at least one token");
  const duplicatePrices = duplicateWith(initialKnownPrices, compareById);
  if (duplicatePrices.length > 0)
    throw new Error("Cannot pass multiple prices of a single token");

  const attemptedRelays = v1Pools.map(pool => {
    try {
      const res = buildReserveFeedsTraditional(pool, initialKnownPrices);
      return res;
    } catch (e) {
      return false;
    }
  });

  const [fulfilled, failed] = partition(attemptedRelays, Boolean);
  const flatReserveFeeds = ((fulfilled as unknown) as ReserveFeed[][])
    .flat(2)
    .sort(sortByLiqDepth);
  if (failed.length == 0) return flatReserveFeeds;
  const uniquePrices = uniqWith(
    flatReserveFeeds,
    compareReserveFeedByReserveAddress
  ).map(reserveFeedToUsdPrice);
  const learntPrices = uniqWith(
    [...initialKnownPrices, ...uniquePrices],
    compareById
  );
  const hasLearntNewPrices = learntPrices.length > initialKnownPrices.length;
  return hasLearntNewPrices
    ? buildPossibleReserveFeedsTraditional(v1Pools, learntPrices)
    : flatReserveFeeds;
};

const buildReserveFeedsChainlink = (
  relay: RawV2Pool,
  usdPriceOfBnt: number
): ReserveFeed[] => {
  const reserveBalances = relay.reserves;
  const reserveWeights = relay.reserves.map(balance => balance.reserveWeight);

  const noReserveWeights = reserveWeights.every(
    weight => typeof weight == "undefined"
  );
  if (noReserveWeights) return [];

  const sortedTokens = sortByNetworkTokens(
    reserveBalances,
    reserve => reserve.token.symbol
  ).map(token => ({
    ...token,
    decAmount: shrinkToken(token.stakedBalance, token.token.decimals),
    decWeight: new BigNumber(token.reserveWeight as string).div(oneMillion)
  }));

  const [secondaryReserveToken, primaryReserveToken] = sortedTokens;

  const secondarysPrice =
    secondaryReserveToken.token.symbol == "USDB" ? 1 : usdPriceOfBnt;

  const secondarysLiqDepth = new BigNumber(
    secondaryReserveToken.decAmount
  ).times(secondarysPrice);

  const wholeLiquidityDepth = secondarysLiqDepth.div(
    secondaryReserveToken.decWeight
  );
  const primaryLiquidityDepth = wholeLiquidityDepth.minus(secondarysLiqDepth);

  const result = [
    {
      reserveAddress: primaryReserveToken.token.contract,
      poolId: relay.anchorAddress,
      priority: 10,
      liqDepth: primaryLiquidityDepth.toNumber(),
      costByNetworkUsd: primaryLiquidityDepth
        .div(primaryReserveToken.decAmount)
        .toNumber()
    },
    {
      reserveAddress: secondaryReserveToken.token.contract,
      poolId: relay.anchorAddress,
      priority: 10,
      liqDepth: secondarysLiqDepth.toNumber(),
      costByNetworkUsd: secondarysPrice
    }
  ];
  return result;
};

const defaultImage = "https://ropsten.etherscan.io/images/main/empty-token.png";
const ORIGIN_ADDRESS = DataTypes.originAddress;

const calculatePercentIncrease = (
  small: number | string,
  big: number | string
): string => {
  const profit = new BigNumber(big).minus(small);
  return profit.div(small).toString();
};

const notBlackListed = (blackListedAnchors: string[]) => (
  converterAnchor: ConverterAndAnchor
) =>
  !blackListedAnchors.some(black =>
    compareString(black, converterAnchor.anchorAddress)
  );

interface RawV2Pool {
  reserves: {
    token: Token;
    reserveAddress: string;
    stakedBalance: string;
    reserveWeight: string | undefined;
    poolTokenAddress: string;
  }[];
  converterAddress: string;
  anchorAddress: string;
}

interface NewReserve extends RawAbiToken {
  reserveBalance: string;
}

interface NewRelay {
  reserves: NewReserve[];
  fee: number;
  converterAddress: string;
  converterType: number;
  version: number;
  poolToken: {
    symbol: string;
    decimals: string;
    contract: string;
  };
}

const calculateMean = (a: string, b: string) =>
  new BigNumber(a).plus(b).div(2).toString();

interface V2Response {
  reserveFeeds: ReserveFeed[];
  pools: (RelayWithReserveBalances | ChainLinkRelay)[];
}

const compareAnchorAndConverter = (
  a: ConverterAndAnchor,
  b: ConverterAndAnchor
) =>
  compareString(a.anchorAddress, b.anchorAddress) &&
  compareString(a.converterAddress, b.converterAddress);

interface RawAbiRelay {
  connectorToken1: string;
  connectorToken2: string;
  connectorTokenCount: string;
  conversionFee: string;
  owner: string;
  version: string;
  converterType?: string;
}

const zipAnchorAndConverters = (
  anchorAddresses: string[],
  converterAddresses: string[]
): ConverterAndAnchor[] => {
  if (anchorAddresses.length !== converterAddresses.length)
    throw new Error(
      "was expecting as many anchor addresses as converter addresses"
    );
  const zipped = zip(anchorAddresses, converterAddresses) as [string, string][];
  return zipped.map(([anchorAddress, converterAddress]) => ({
    anchorAddress: anchorAddress!,
    converterAddress: converterAddress!
  }));
};

const pickEthToken = (obj: any): Token => ({
  contract: obj.contract,
  decimals: obj.decimals,
  network: "ETH",
  symbol: obj.symbol
});

interface AbiRelay extends RawAbiRelay {
  converterAddress: string;
}

export interface AbiStaticRelay {
  converterAddress: string;
  converterType: string;
  version: string;
  connectorToken1: string;
  connectorToken2: string;
}

export interface RawABIDynamicRelay {
  connectorTokenCount: string;
  conversionFee: string;
  converterAddress: string;
  reserveOne: string;
  reserveOneAddress: string;
  reserveTwo: string;
  reserveTwoAddress: string;
}

export interface AbiDynamicRelay {
  converterAddress: string;
  reserves: {
    contract: string;
    balance: string;
  }[];
  fee: string;
}

interface RawAbiToken {
  contract: string;
  symbol: string;
  decimals: string;
}
export interface StaticRelay {
  converterAddress: string;
  converterType: number;
  version: number;
  reserves: RawAbiToken[];
  poolToken: RawAbiToken;
}

const prioritiseV2Pools = (a: ViewRelay, b: ViewRelay) => {
  if (a.v2 && b.v2) return 0;
  if (!a.v2 && !b.v2) return 0;
  if (a.v2 && !b.v2) return -1;
  if (!a.v2 && b.v2) return 1;
  return 0;
};

interface RawAbiCentralPoolToken extends RawAbiToken {
  poolTokens?: string[];
}

interface AbiCentralPoolToken extends RawAbiCentralPoolToken {
  contract: string;
}

const metaToModalChoice = (meta: TokenMeta): ModalChoice => ({
  id: meta.contract,
  contract: meta.contract,
  symbol: meta.symbol,
  img: meta.image
});

const isTraditional = (relay: Relay): boolean =>
  typeof relay.anchor == "object" &&
  relay.converterType == PoolType.Traditional;

const isChainLink = (relay: Relay): boolean =>
  Array.isArray((relay.anchor as PoolContainer).poolTokens) &&
  relay.converterType == PoolType.ChainLink;

const assertTraditional = (relay: Relay): TraditionalRelay => {
  if (isTraditional(relay)) {
    return relay as TraditionalRelay;
  }
  throw new Error("Not a traditional relay");
};

const assertChainlink = (relay: Relay): ChainLinkRelay => {
  if (isChainLink(relay)) {
    return relay as ChainLinkRelay;
  }
  throw new Error("Not a chainlink relay");
};

const generateEtherscanTxLink = (txHash: string, ropsten: boolean = false) =>
  `https://${ropsten ? "ropsten." : ""}etherscan.io/tx/${txHash}`;

const generateEtherscanAccountLink = (
  account: string,
  ropsten: boolean = false
) => `https://${ropsten ? "ropsten." : ""}etherscan.io/address/${account}`;

const iouTokensInRelay = (relay: Relay): Token[] => {
  if (relay.converterType == PoolType.ChainLink) {
    const poolContainer = relay.anchor as PoolContainer;
    const poolTokens = poolContainer.poolTokens;
    const tokens = poolTokens.map(token => token.poolToken);
    return tokens;
  } else if (relay.converterType == PoolType.Traditional) {
    const smartToken = relay.anchor as SmartToken;
    return [smartToken];
  } else throw new Error("Failed to identify pool");
};

const reserveTokensInRelay = (relay: Relay): Token[] => relay.reserves;

const tokensInRelay = (relay: Relay): Token[] => [
  ...reserveTokensInRelay(relay),
  ...iouTokensInRelay(relay)
];

const relayToMinimal = (relay: Relay): MinimalRelay => ({
  contract: relay.contract,
  reserves: relay.reserves.map(
    (reserve): TokenSymbol => ({
      contract: reserve.contract,
      symbol: reserve.symbol
    })
  ),
  anchorAddress: isTraditional(relay)
    ? (relay.anchor as SmartToken).contract
    : (relay.anchor as PoolContainer).poolContainerAddress
});

const sortSmartTokenAddressesByHighestLiquidity = (
  tokens: TokenPrice[],
  smartTokenAddresses: string[]
): string[] => {
  const sortedTokens = tokens
    .slice()
    .sort((a, b) => b.liquidityDepth - a.liquidityDepth);

  const sortedDictionary = sortedTokens
    .map(
      token =>
        ethBancorApiDictionary.find(dic =>
          compareString(token.id, dic.tokenId)
        )!
    )
    .filter(Boolean);

  const res = sortAlongSide(
    smartTokenAddresses,
    pool => pool,
    sortedDictionary.map(x => x.smartTokenAddress)
  );

  const isSame = res.every((item, index) => smartTokenAddresses[index] == item);
  if (isSame)
    console.warn(
      "Sorted by Highest liquidity sorter is returning the same array passed"
    );
  return res;
};

interface EthOpposingLiquid {
  smartTokenAmountWei: ViewAmount;
  opposingAmount?: string;
  shareOfPool: number;
  singleUnitCosts: ViewAmount[];
  reserveBalancesAboveZero: boolean;
}

interface RawAbiV2PoolBalances {
  converterAddress: string;
  reserveOne: string;
  reserveTwo: string;
  reserveOnePoolToken: string;
  reserveTwoPoolToken: string;
  primaryReserveToken: string;
  secondaryReserveToken: string;
  reserveOneStakedBalance: string;
  reserveTwoStakedBalance: string;
  effectiveReserveWeights: { 0: string; 1: string } | undefined;
}

interface RawAbiReserveBalance {
  converterAddress: string;
  reserveOne: string;
  reserveOneAddress: string;
  reserveTwoAddress: string;
  reserveTwo: string;
}

const hasTwoConnectors = (relay: RefinedAbiRelay) => {
  const test = Number(relay.connectorTokenCount) == 2;
  if (!test)
    console.warn(
      "Dropping relay",
      relay.anchorAddress,
      "because it does not have a connector count of two"
    );
  return test;
};

interface StakedAndReserve {
  converterAddress: string;
  reserves: {
    reserveAddress: string;
    stakedBalance: string;
    reserveWeight: string | undefined;
    poolTokenAddress: string;
  }[];
}

const polishTokens = (tokenMeta: TokenMeta[], tokens: Token[]) => {
  const ethReserveToken: Token = {
    contract: ethReserveAddress,
    decimals: 18,
    network: "ETH",
    symbol: "ETH"
  };

  const ethHardCode = updateArray(
    tokens,
    token => compareString(token.contract, ethReserveAddress),
    () => ethReserveToken
  );

  const decimalIsWrong = (decimals: number | undefined) =>
    typeof decimals == "undefined" || Number.isNaN(decimals);

  const missingDecimals = updateArray(
    ethHardCode,
    token => decimalIsWrong(token.decimals),
    missingDecimal => {
      const meta = tokenMeta.find(x =>
        compareString(x.contract, missingDecimal.contract)
      )!;
      if (Object.keys(meta).includes("precision")) {
        return {
          ...missingDecimal,
          decimals: meta.precision!
        };
      }
      console.warn(
        "Token Meta couldnt help determine decimals of token address",
        missingDecimal.contract
      );
      return {
        ...missingDecimal
      };
    }
  ).filter(token => !decimalIsWrong(token.decimals));

  const missingSymbol = updateArray(
    missingDecimals,
    token => !token.symbol,
    tokenWithoutSymbol => {
      const meta = tokenMeta.find(x =>
        compareString(x.contract, tokenWithoutSymbol.contract)
      )!;
      if (meta.symbol) {
        return {
          ...tokenWithoutSymbol,
          symbol: meta.symbol
        };
      } else {
        console.warn("Dropping", tokenWithoutSymbol, "due to no symbol");
        return {
          ...tokenWithoutSymbol
        };
      }
    }
  ).filter(token => token.symbol);

  const addedEth = [...missingSymbol, ethReserveToken];
  const uniqueTokens = uniqWith(addedEth, (a, b) =>
    compareString(a.contract, b.contract)
  );

  const difference = differenceWith(tokens, uniqueTokens, (a, b) =>
    compareString(a.contract, b.contract)
  );
  if (difference.length > 0) {
    console.warn(
      "Polish tokens is dropping",
      difference,
      "tokens",
      "sending back",
      uniqueTokens
    );
  }
  return uniqueTokens;
};

const seperateMiniTokens = (tokens: AbiCentralPoolToken[]) => {
  const smartTokens = tokens
    .filter(token => !token.poolTokens)
    .map(pickEthToken);

  const poolTokenAddresses = tokens
    .filter(token => Array.isArray(token.poolTokens))
    .map(token => ({
      anchorAddress: token.contract,
      poolTokenAddresses: token.poolTokens as string[]
    }));

  const rebuiltLength = poolTokenAddresses.length + smartTokens.length;
  if (rebuiltLength !== tokens.length) {
    console.error("failed to rebuild properly");
  }
  return { smartTokens, poolTokenAddresses };
};

interface RegisteredContracts {
  BancorNetwork: string;
  BancorConverterRegistry: string;
  LiquidityProtection: string;
  LiquidityProtectionStore: string;
}

const percentageOfReserve = (percent: number, existingSupply: string): string =>
  new Decimal(percent).times(existingSupply).toFixed(0);

const percentageIncrease = (deposit: string, existingSupply: string): number =>
  new Decimal(deposit).div(existingSupply).toNumber();

const calculateOppositeFundRequirement = (
  deposit: string,
  depositsSupply: string,
  oppositesSupply: string
): string => {
  const increase = percentageIncrease(deposit, depositsSupply);
  return percentageOfReserve(increase, oppositesSupply);
};

const calculateOppositeLiquidateRequirement = (
  reserveAmount: string,
  reserveBalance: string,
  oppositeReserveBalance: string
) => {
  const increase = percentageIncrease(reserveAmount, reserveBalance);
  return percentageOfReserve(increase, oppositeReserveBalance);
};

const oneMillion = new BigNumber(1000000);

const calculateFundReward = (
  reserveAmount: string,
  reserveSupply: string,
  smartSupply: string
) => {
  Decimal.set({ rounding: 0 });

  const smartSupplyNumber = new Decimal(smartSupply);
  if (smartSupplyNumber.eq(0)) {
    throw new Error("Client side geometric mean not yet supported");
  }
  return new Decimal(reserveAmount)
    .div(reserveSupply)
    .times(smartSupplyNumber)
    .times(0.99)
    .toFixed(0);
};

const calculateLiquidateCost = (
  reserveAmount: string,
  reserveBalance: string,
  smartSupply: string
) => {
  const percent = percentageIncrease(reserveAmount, reserveBalance);
  return percentageOfReserve(percent, smartSupply);
};

const percentDifference = (smallAmount: string, bigAmount: string) =>
  new Decimal(smallAmount).div(bigAmount).toNumber();

const tokenMetaDataEndpoint =
  "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/tokens.json";

interface TokenMeta {
  id: string;
  image: string;
  contract: string;
  symbol: string;
  name: string;
  precision?: number;
}

const metaToTokenAssumedPrecision = (token: TokenMeta): Token => ({
  contract: token.contract,
  decimals: token.precision!,
  network: "ETH",
  symbol: token.symbol
});

const getTokenMeta = async (currentNetwork: EthNetworks) => {
  const networkVars = getNetworkVariables(currentNetwork);
  if (currentNetwork == EthNetworks.Ropsten) {
    return [
      {
        symbol: "BNT",
        contract: networkVars.bntToken,
        precision: 18
      },
      {
        symbol: "DAI",
        contract: "0xc2118d4d90b274016cb7a54c03ef52e6c537d957",
        precision: 18
      },
      {
        symbol: "WBTC",
        contract: "0xbde8bb00a7ef67007a96945b3a3621177b615c44",
        precision: 8
      },
      {
        symbol: "BAT",
        contract: "0x443fd8d5766169416ae42b8e050fe9422f628419",
        precision: 18
      },
      {
        symbol: "LINK",
        contract: "0x20fe562d797a42dcb3399062ae9546cd06f63280",
        precision: 18
      },
      {
        contract: "0x4F5e60A76530ac44e0A318cbc9760A2587c34Da6",
        symbol: "YYYY"
      },
      {
        contract: "0x63B75DfA4E87d3B949e876dF2Cd2e656Ec963466",
        symbol: "YYY"
      },
      {
        contract: "0xAa2A908Ca3E38ECEfdbf8a14A3bbE7F2cA2a1BE4",
        symbol: "XXX"
      },
      {
        contract: "0xe4158797A5D87FB3080846e019b9Efc4353F58cC",
        symbol: "XXX"
      }
    ].map(
      (x): TokenMeta => ({
        ...x,
        id: x.contract,
        image: defaultImage,
        name: x.symbol
      })
    );
  }
  if (currentNetwork !== EthNetworks.Mainnet)
    throw new Error("Ropsten and Mainnet supported only.");

  const res: AxiosResponse<TokenMeta[]> = await axios.get(
    tokenMetaDataEndpoint
  );

  const drafted = res.data
    .filter(({ symbol, contract, image }) =>
      [symbol, contract, image].every(Boolean)
    )
    .map(x => ({ ...x, id: x.contract }));

  const existingEth = drafted.find(x => compareString(x.symbol, "eth"))!;

  const withoutEth = drafted.filter(meta => !compareString(meta.symbol, "eth"));
  const addedEth = {
    ...existingEth,
    id: ethReserveAddress,
    contract: ethReserveAddress
  };
  const final = [addedEth, existingEth, ...withoutEth];
  return uniqWith(final, (a, b) => compareString(a.id, b.id));
};

const compareRelayById = (a: Relay, b: Relay) => compareString(a.id, b.id);

const VuexModule = createModule({
  strict: false
});

interface LiquidityProtectionSettings {
  minDelay: number;
  maxDelay: number;
  lockedDelay: number;
  govToken: string;
  networkToken: string;
  maxSystemNetworkTokenAmount: string;
  maxSystemNetworkTokenRatio: string;
}

interface RawLiquidityProtectionSettings {
  minProtectionDelay: string;
  maxProtectionDelay: string;
  lockDuration: string;
  govToken: string;
  networkToken: string;
  maxSystemNetworkTokenAmount: string;
  maxSystemNetworkTokenRatio: string;
}

export class EthBancorModule
  extends VuexModule.With({ namespaced: "ethBancor/" })
  implements TradingModule, LiquidityModule, CreatePoolModule, HistoryModule {
  registeredAnchorAddresses: string[] = [];
  convertibleTokenAddresses: string[] = [];
  loadingPools: boolean = true;

  bancorApiTokens: TokenPrice[] = [];
  relaysList: readonly Relay[] = [];
  tokenBalances: Balance[] = [];
  bntUsdPrice: number = 0;
  tokenMeta: TokenMeta[] = [];
  availableHistories: string[] = [];
  contracts: RegisteredContracts = {
    BancorNetwork: "",
    BancorConverterRegistry: "",
    LiquidityProtection: "",
    LiquidityProtectionStore: ""
  };
  initiated: boolean = false;
  failedPools: string[] = [];
  currentNetwork: EthNetworks = EthNetworks.Mainnet;
  slippageTolerance = 0;

  liquidityProtectionSettings: LiquidityProtectionSettings = {
    minDelay: moment.duration("30", "days").asSeconds(),
    maxDelay: moment.duration("100", "days").asSeconds(),
    lockedDelay: moment.duration("24", "hours").asSeconds(),
    networkToken: "",
    govToken: "",
    maxSystemNetworkTokenAmount: "",
    maxSystemNetworkTokenRatio: ""
  };

  @mutation setLiquidityProtectionSettings(
    settings: LiquidityProtectionSettings
  ) {
    this.liquidityProtectionSettings = settings;
  }

  @action async fetchLiquidityProtectionSettings(contractAddress: string) {
    const [[settings]] = ((await this.multi({
      groupsOfShapes: [
        [liquidityProtectionShape(contractAddress, this.currentNetwork)]
      ]
    })) as unknown) as [RawLiquidityProtectionSettings][];

    const newSettings = {
      minDelay: Number(settings.minProtectionDelay),
      maxDelay: Number(settings.maxProtectionDelay),
      lockedDelay: Number(settings.lockDuration),
      govToken: settings.govToken,
      networkToken: settings.networkToken,
      maxSystemNetworkTokenRatio: settings.maxSystemNetworkTokenRatio,
      maxSystemNetworkTokenAmount: settings.maxSystemNetworkTokenAmount
    } as LiquidityProtectionSettings;
    if (this.currentUser) {
      this.fetchAndSetTokenBalances([newSettings.govToken]);
    }
    return newSettings;
  }

  get stats() {
    const ethToken = this.tokens.find(token =>
      compareString("ETH", token.symbol)
    );
    return {
      totalLiquidityDepth: this.tokens.reduce(
        (acc, item) => acc + (item.liqDepth || 0),
        0
      ),
      stakedBntPercent: this.stakedBntPercent,
      nativeTokenPrice: {
        symbol: "ETH",
        price: (ethToken && ethToken.price) || 0
      },
      twentyFourHourTradeCount: this.liquidityHistory.data.length,
      totalVolume24h: this.relays
        .map(x => Number(x.volume || 0))
        .reduce((sum, current) => sum + current),
      bntUsdPrice: this.bntUsdPrice
    };
  }

  whiteListedPools: string[] = [];

  @mutation setWhiteListedPools(anchors: string[]) {
    this.whiteListedPools = anchors;
  }

  @action async fetchWhiteListedV1Pools(
    liquidityProtectionStoreAddress?: string
  ) {
    const contractAddress =
      liquidityProtectionStoreAddress ||
      this.contracts.LiquidityProtectionStore;
    const liquidityProtection = buildLiquidityProtectionStoreContract(
      contractAddress,
      w3
    );
    const whiteListedPools = await liquidityProtection.methods
      .whitelistedPools()
      .call();
    this.setWhiteListedPools(whiteListedPools);
    return whiteListedPools;
  }

  @action async protectLiquidityTx({
    anchorAddress,
    amountWei
  }: {
    anchorAddress: string;
    amountWei: string;
  }) {
    const liquidityProtectionAddress = this.contracts.LiquidityProtection;
    const contract = buildLiquidityProtectionContract(
      liquidityProtectionAddress
    );
    return this.resolveTxOnConfirmation({
      tx: contract.methods.protectLiquidity(anchorAddress, amountWei)
    });
  }

  @action async unProtectLiquidityTx({
    id1,
    id2
  }: {
    id1: string;
    id2: string;
  }) {
    const liquidityProtectionAddress = this.contracts.LiquidityProtection;
    const contract = buildLiquidityProtectionContract(
      liquidityProtectionAddress
    );
    return this.resolveTxOnConfirmation({
      tx: contract.methods.unprotectLiquidity(id1, id2)
    });
  }

  @action async unprotectLiquidity({
    id1,
    id2
  }: {
    id1: string;
    id2: string;
  }): Promise<TxResponse> {
    const res = await this.unProtectLiquidityTx({ id1, id2 });

    (async () => {
      await wait(700);
      this.fetchLockedBalances();
      this.fetchProtectionPositions({});
      await wait(4000);
      this.fetchLockedBalances();
      this.fetchProtectionPositions({});
    })();

    return {
      blockExplorerLink: await this.createExplorerLink(res),
      txId: res
    };
  }

  highTierPoolsArr: string[] = [];

  @mutation setHighTierPools(highTierPools: string[]) {
    console.log("high tier pools", highTierPools);
    this.highTierPoolsArr = highTierPools;
  }

  @action async fetchAndSetHighTierPools(liquidityProtectionContract: string) {
    const lpContract = buildLiquidityProtectionContract(
      liquidityProtectionContract || this.contracts.LiquidityProtection,
      w3
    );

    const highTierPools = await lpContract.methods.highTierPools().call();

    this.setHighTierPools(highTierPools);
  }

  protectedPositionsArr: ProtectedLiquidityCalculated[] = [];

  @mutation setProtectedPositions(positions: ProtectedLiquidityCalculated[]) {
    console.log(positions, "are the positions getting set!");
    this.protectedPositionsArr = positions;
  }

  @action async fetchPositionsMulti({
    positionIds,
    liquidityStore
  }: {
    positionIds: string[];
    liquidityStore: string;
  }): Promise<ProtectedLiquidity[]> {
    const positionShapes = positionIds.map(id =>
      protectedPositionShape(liquidityStore, id)
    );

    const [multiPositions] = await this.multi({
      groupsOfShapes: [positionShapes]
    });

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

    // @ts-ignore
    return multiPositions
      .map(res => ({ ...res.position, "8": res.positionId }))
      .map(res => fromPairs(keys.map((key, index) => [key, res[index]])));
  }

  @action async fetchProtectionPositions({
    storeAddress,
    blockNumberNow
  }: {
    storeAddress?: string;
    blockNumberNow?: number;
  }) {
    const liquidityStore =
      storeAddress || this.contracts.LiquidityProtectionStore;
    if (!this.currentUser) {
      return;
    }
    try {
      const contract = buildLiquidityProtectionStoreContract(
        liquidityStore,
        w3
      );
      const owner = this.currentUser;
      console.time("time to get ID count");
      console.log("getting id count", owner, "was the owner");
      const idCount = Number(
        await contract.methods.protectedLiquidityCount(owner).call()
      );
      console.log("got id count", idCount);
      console.timeEnd("time to get ID count");
      if (idCount == 0) return;
      const positionIds = await contract.methods
        .protectedLiquidityIds(owner)
        .call();

      const [allPositions, currentBlockNumber] = await Promise.all([
        this.fetchPositionsMulti({
          positionIds,
          liquidityStore
        }),
        (async () => {
          return blockNumberNow || w3.eth.getBlockNumber();
        })()
      ]);

      if (allPositions.length !== idCount)
        throw new Error("ID count does not match returned positions");

      const lpContract = buildLiquidityProtectionContract(
        this.contracts.LiquidityProtection,
        w3
      );

      const uniqueAnchors = uniqWith(
        allPositions.map(pos => pos.poolToken),
        compareString
      ) as string[];

      const timeScales: {
        blockHeight: number;
        days: number;
        label: string;
      }[] = ([
        [1, "day"],
        [7, "week"]
      ] as [number, string][]).map(([days, label]) => ({
        blockHeight: rewindBlocksByDays(currentBlockNumber, days),
        days,
        label
      }));

      const [withAprs, withLiquidityReturn, withFees] = await Promise.all([
        (async () => {
          try {
            const poolHistoricalBalances = await Promise.all(
              uniqueAnchors.map(async anchor => {
                const historicalBalances = await Promise.all(
                  timeScales.map(async scale => {
                    const balance = await this.fetchRelayBalances({
                      poolId: anchor,
                      blockHeight: scale.blockHeight
                    });
                    return {
                      balance,
                      scale: scale.label
                    };
                  })
                );

                return {
                  poolId: anchor,
                  historicalBalances
                };
              })
            );

            return await Promise.all(
              allPositions.map(async position => {
                const pool = findOrThrow(poolHistoricalBalances, pool =>
                  compareString(pool.poolId, position.poolToken)
                );
                const aprs = await Promise.all(
                  timeScales.map(async scale => {
                    const poolBalance = findOrThrow(
                      pool.historicalBalances,
                      balance => compareString(balance.scale, scale.label)
                    ).balance;

                    const historicalReserveBalances = poolBalance.reserves.map(
                      (reserve): WeiExtendedAsset => ({
                        weiAmount: reserve.weiAmount,
                        contract: reserve.contract
                      })
                    );

                    const poolTokenSupply = poolBalance.smartTokenSupplyWei;

                    const [
                      tknReserveBalance,
                      opposingTknBalance
                    ] = sortAlongSide(
                      historicalReserveBalances,
                      balance => balance.contract,
                      [position.reserveToken]
                    );

                    const poolToken = position.poolToken;
                    const reserveToken = position.reserveToken;
                    const reserveAmount = position.reserveAmount;
                    const poolRateN = new BigNumber(tknReserveBalance.weiAmount)
                      .times(2)
                      .toString();
                    const poolRateD = poolTokenSupply;

                    const reserveRateN = opposingTknBalance.weiAmount;
                    const reserveRateD = tknReserveBalance.weiAmount;

                    let poolRoi = "";

                    try {
                      poolRoi = await lpContract.methods
                        .poolROI(
                          poolToken,
                          reserveToken,
                          reserveAmount,
                          poolRateN,
                          poolRateD,
                          reserveRateN,
                          reserveRateD
                        )
                        .call();
                    } catch (err) {
                      console.error("getting pool roi failed!", err, {
                        address: this.contracts.LiquidityProtection,
                        poolToken,
                        reserveToken,
                        reserveAmount,
                        poolRateN,
                        poolRateD,
                        reserveRateN,
                        reserveRateD
                      });
                    }

                    const magnitude =
                      scale.label == "day"
                        ? 365
                        : scale.label == "week"
                        ? 52
                        : 365 / scale.days;

                    const calculatedAprDec = new BigNumber(poolRoi)
                      .div(1000000)
                      .minus(1)
                      .times(magnitude);

                    return {
                      calculatedAprDec: calculatedAprDec.isNegative()
                        ? "0"
                        : calculatedAprDec.toString(),
                      scaleId: scale.label
                    };
                  })
                );

                return {
                  positionId: position.id,
                  oneDayDec: aprs.find(apr => apr.scaleId == "day")!
                    .calculatedAprDec,
                  oneWeekDec: aprs.find(apr => apr.scaleId == "week")!
                    .calculatedAprDec
                };
              })
            );
          } catch (e) {
            console.log(e, "error doing rois");
          }
        })(),
        Promise.all(
          allPositions.map(async position => {
            const now = moment();
            const fullWaitTime = now.clone().add(1, "year").unix();

            const timeNow = moment().unix();

            const [
              fullLiquidityReturn,
              currentLiquidityReturn
            ] = await Promise.all([
              getRemoveLiquidityReturn(
                this.contracts.LiquidityProtection,
                position.id,
                oneMillion.toString(),
                fullWaitTime,
                w3
              ),
              getRemoveLiquidityReturn(
                this.contracts.LiquidityProtection,
                position.id,
                oneMillion.toString(),
                timeNow,
                w3
              )
            ]);

            return {
              positionId: position.id,
              fullLiquidityReturn,
              currentLiquidityReturn,
              roiDec: calculateReturnOnInvestment(
                position.reserveAmount,
                fullLiquidityReturn.targetAmount
              )
            };
          })
        ).catch(e => {
          console.warn("Error fetching ROIs", e);
        }),
        Promise.all(
          allPositions.map(async position => {
            const currentPoolBalances = await this.fetchRelayBalances({
              poolId: position.poolToken
            });

            const [
              depositedReserve,
              opposingReserve
            ] = sortAlongSide(
              currentPoolBalances.reserves,
              reserve => reserve.contract,
              [position.reserveToken]
            );
            const rate0 = new BigNumber(position.reserveRateN)
              .div(position.reserveRateD)
              .toString();

            const feeAmountWei = calculatePositionFees(
              position.poolAmount,
              currentPoolBalances.smartTokenSupplyWei,
              position.reserveAmount,
              depositedReserve.weiAmount,
              opposingReserve.weiAmount,
              rate0
            );
            const debugInfo = {
              originalPoolTokenAmount: position.poolAmount,
              currentPoolTokenSupply: currentPoolBalances.smartTokenSupplyWei,
              depositedAmount: position.reserveAmount,
              depositedReserveCurrentBalance: depositedReserve.weiAmount,
              opposingDepositedReserveCurrentBalance: opposingReserve.weiAmount,
              reserveRate: rate0
            };
            console.log(
              "asaf - id:",
              position.id,
              new Date(Number(position.timestamp) * 1000),
              debugInfo
            );

            const shrunk = shrinkToken(feeAmountWei, 18);

            console.log(shrunk, "is the fee amount");

            return {
              positionId: position.id,
              amount: shrunk
            };
          })
        )
      ]);

      const positions = allPositions.map(
        (position): ProtectedLiquidityCalculated => {
          const liqReturn =
            withLiquidityReturn &&
            withLiquidityReturn.find(p => position.id == p.positionId);
          const roiReturn =
            withAprs && withAprs.find(p => position.id == p.positionId);

          const fee = withFees.find(p => position.id == p.positionId);

          return {
            ...position,
            ...(liqReturn && omit(liqReturn, ["positionId"])),
            ...(roiReturn && omit(roiReturn, ["positionId"])),
            ...(fee && { fee: omit(fee, ["positionId"]) })
          };
        }
      );

      console.log("success!", positions, "are positions");

      this.setProtectedPositions(positions);
      if (this.loadingProtectedPositions) {
        await wait(2);
        this.setLoadingPositions(false);
      }
      return positions;
    } catch (e) {
      console.error("Failed fetching protection positions", e.message);
    }
  }

  @action async addProtection({
    poolId,
    reserveAmount,
    onUpdate
  }: {
    poolId: string;
    reserveAmount: ViewAmount;
    onUpdate: OnUpdate;
  }): Promise<TxResponse> {
    const pool = this.relay(poolId);

    if (!pool.whitelisted) {
      throw new Error("Pool must be whitelisted to protect liquidity");
    }

    const liqudityProtectionContractAddress = this.contracts
      .LiquidityProtection;
    const contract = buildLiquidityProtectionContract(
      liqudityProtectionContractAddress
    );

    const reserveTokenAddress = reserveAmount.id;
    const token = this.token(reserveTokenAddress);
    const reserveAmountWei = expandToken(reserveAmount.amount, token.precision);

    const depositIsEth = compareString(reserveAmount.id, ethReserveAddress);

    const txHash = (await multiSteps({
      items: [
        {
          description: "Triggering approval..",
          task: async () => {
            if (!depositIsEth) {
              await this.triggerApprovalIfRequired({
                owner: this.currentUser,
                spender: liqudityProtectionContractAddress,
                amount: reserveAmountWei,
                tokenAddress: reserveTokenAddress
              });
            }
          }
        },
        {
          description: "Adding liquidity..",
          task: async () => {
            return this.resolveTxOnConfirmation({
              tx: contract.methods.addLiquidity(
                poolId,
                reserveTokenAddress,
                reserveAmountWei
              ),
              ...(depositIsEth && { value: reserveAmountWei })
            });
          }
        }
      ],
      onUpdate
    })) as string;

    this.fetchProtectionPositions({});
    this.spamBalances([
      this.liquidityProtectionSettings.govToken,
      reserveTokenAddress
    ]);
    wait(3000).then(() => {
      this.fetchProtectionPositions({});
    });

    return {
      blockExplorerLink: await this.createExplorerLink(txHash),
      txId: txHash
    };
  }

  @action async removeProtection({
    decPercent,
    id
  }: {
    decPercent: number;
    id: string;
  }): Promise<TxResponse> {
    const dbId = id.split(":")[1];

    const liquidityProtectionContract = this.contracts.LiquidityProtection;
    const contract = buildLiquidityProtectionContract(
      this.contracts.LiquidityProtection
    );

    const position = findOrThrow(
      this.protectedPositionsArr,
      position => compareString(position.id, dbId),
      `failed to find the referenced position of ${dbId}`
    );
    const isDissolvingNetworkToken = compareString(
      this.liquidityProtectionSettings.networkToken,
      position.reserveToken
    );
    const ppmPercent = decToPpm(decPercent);

    console.log({ ppmPercent, decPercent }, "issue 560");
    console.assert(
      decPercent == 1,
      "dec percent passed from View layer was not 1!"
    );
    console.assert();

    if (isDissolvingNetworkToken) {
      const dissolvingFullPosition = decPercent === 1;
      const roundingBuffer = 0.01;
      const weiApprovalAmount = dissolvingFullPosition
        ? position.reserveAmount
        : new BigNumber(position.reserveAmount)
            .times(decPercent + roundingBuffer)
            .toFixed(0);
      await this.triggerApprovalIfRequired({
        owner: this.currentUser,
        spender: liquidityProtectionContract,
        amount: weiApprovalAmount,
        tokenAddress: this.liquidityProtectionSettings.govToken
      });
    }

    const txHash = await this.resolveTxOnConfirmation({
      tx: contract.methods.removeLiquidity(dbId, ppmPercent)
    });

    (async () => {
      await wait(600);
      this.fetchLockedBalances();
      this.fetchProtectionPositions({});
      await wait(2000);
      this.fetchLockedBalances();
      this.fetchProtectionPositions({});
    })();

    return {
      blockExplorerLink: await this.createExplorerLink(txHash),
      txId: txHash
    };
  }

  @action async protectLiquidity({
    amount,
    onUpdate
  }: ProtectLiquidityParams): Promise<TxResponse> {
    const liquidityProtectionContractAddress = this.contracts
      .LiquidityProtection;

    const pool = await this.traditionalRelayById(amount.id);
    const poolToken = pool.anchor;
    if (!compareString(amount.id, poolToken.contract))
      throw new Error("Pool token does not match anchor ID");
    const poolTokenWei = expandToken(amount.amount, poolToken.decimals);

    const txHash = await multiSteps({
      items: [
        {
          description: "Approving transfer...",
          task: async () => {
            await this.triggerApprovalIfRequired({
              amount: poolTokenWei,
              owner: this.currentUser,
              spender: liquidityProtectionContractAddress,
              tokenAddress: poolToken.contract
            });
          }
        },
        {
          description: "Adding liquidity protection...",
          task: async () => {
            return this.protectLiquidityTx({
              anchorAddress: poolToken.contract,
              amountWei: poolTokenWei
            });
          }
        }
      ],
      onUpdate
    });

    this.spamBalances([
      poolToken.contract,
      this.liquidityProtectionSettings.govToken
    ]);

    (async () => {
      this.fetchProtectionPositions({});
      await wait(2000);
      this.fetchProtectionPositions({});
      await wait(5000);
      this.fetchProtectionPositions({});
    })();

    return {
      blockExplorerLink: await this.createExplorerLink(txHash),
      txId: txHash
    };
  }

  @mutation setTolerance(tolerance: number) {
    this.slippageTolerance = tolerance;
  }

  @action async setSlippageTolerance(tolerance: number) {
    this.setTolerance(tolerance);
  }

  @mutation setNetwork(network: EthNetworks) {
    this.currentNetwork = network;
  }

  @mutation setBancorApiTokens(tokens: TokenPrice[]) {
    this.bancorApiTokens = tokens;
  }

  lockedBalancesArr: LockedBalance[] = [];

  get lockedEth() {
    return this.lockedBalancesArr;
  }

  @mutation setLockedBalances(lockedBalances: LockedBalance[]) {
    this.lockedBalancesArr = lockedBalances;
  }

  @mutation setLoadingPositions(value: boolean) {
    this.loadingProtectedPositions = value;
  }

  @mutation updateHistoricPoolFees(newFees: PreviousPoolFee[]) {
    const currentFees = this.previousPoolFeesArr;
    console.log("historical fees", newFees);
    this.previousPoolFeesArr = [...currentFees, ...newFees];
  }

  @action async fetchLockedBalances(storeAddress?: string) {
    const owner = this.currentUser;
    if (!owner) return;

    const contractAddress =
      storeAddress || this.contracts.LiquidityProtectionStore;
    const storeContract = buildLiquidityProtectionStoreContract(
      contractAddress,
      w3
    );
    const lockedBalanceCount = Number(
      await storeContract.methods.lockedBalanceCount(owner).call()
    );

    const lockedBalances =
      lockedBalanceCount > 0
        ? await traverseLockedBalances(
            contractAddress,
            owner,
            lockedBalanceCount,
            w3
          )
        : [];
    this.setLockedBalances(lockedBalances);

    return lockedBalances;
  }

  loadingProtectedPositions = true;

  get protectedPositions(): ViewProtectedLiquidity[] {
    const owner = this.currentUser;
    if (!owner) return [];

    const { minDelay, maxDelay } = this.liquidityProtectionSettings;

    const whiteListedPools = this.whiteListedPools;

    const allPositions = this.protectedPositionsArr
      .filter(position => compareString(position.owner, owner))
      .filter(position =>
        whiteListedPools.some(anchor =>
          compareString(position.poolToken, anchor)
        )
      );

    const allRelays = this.relaysList;
    const uniqueAnchors = uniqWith(
      allPositions.map(pos => pos.poolToken),
      compareString
    );
    const relays = uniqueAnchors.map(anchor =>
      findOrThrow(allRelays, relay => compareString(relay.id, anchor))
    );

    const viewPositions = allPositions.map(
      (singleEntry): ViewProtectedLiquidity => {
        const isWhiteListed = true;

        const startTime = Number(singleEntry.timestamp);

        const relay = findOrThrow(relays, relay =>
          compareString(relay.id, singleEntry.poolToken)
        );

        const reserveToken = this.token(singleEntry.reserveToken);
        const reservePrecision = reserveToken.precision;

        const reserveTokenDec = shrinkToken(
          singleEntry.reserveAmount,
          reservePrecision
        );

        const fullyProtectedDec =
          singleEntry.fullLiquidityReturn &&
          shrinkToken(
            singleEntry.fullLiquidityReturn.targetAmount,
            reservePrecision
          );

        const currentProtectedDec =
          singleEntry.currentLiquidityReturn &&
          shrinkToken(
            singleEntry.currentLiquidityReturn.targetAmount,
            reservePrecision
          );

        const progressPercent = calculateProgressLevel(
          startTime,
          startTime + maxDelay
        );

        const givenVBnt =
          compareString(
            reserveToken.id,
            this.liquidityProtectionSettings.networkToken
          ) && reserveTokenDec;

        // stake - original
        // full coverage - full wait time
        // protectedAmount - current wait time

        return {
          id: `${singleEntry.poolToken}:${singleEntry.id}`,
          whitelisted: isWhiteListed,
          ...(givenVBnt && { givenVBnt }),
          single: true,
          apr: {
            day: Number(singleEntry.oneDayDec),
            // month: Number(singleEntry.on)
            week: Number(singleEntry.oneWeekDec)
          },
          insuranceStart: startTime + minDelay,
          fullCoverage: startTime + maxDelay,
          stake: {
            amount: reserveTokenDec,
            symbol: reserveToken.symbol,
            poolId: relay.id,
            unixTime: startTime,
            ...(reserveToken.price && {
              usdValue: new BigNumber(reserveTokenDec)
                .times(reserveToken.price)
                .toNumber()
            })
          },
          ...(fullyProtectedDec && {
            fullyProtected: {
              amount: fullyProtectedDec,
              symbol: reserveToken.symbol,
              ...(reserveToken.price && {
                usdValue: new BigNumber(fullyProtectedDec)
                  .times(reserveToken.price)
                  .toNumber()
              })
            }
          }),
          ...(currentProtectedDec && {
            protectedAmount: {
              amount: currentProtectedDec,
              symbol: reserveToken.symbol,
              ...(reserveToken.price &&
                fullyProtectedDec && {
                  usdValue: new BigNumber(currentProtectedDec)
                    .times(reserveToken.price!)
                    .toNumber()
                })
            }
          }),
          coverageDecPercent: progressPercent,
          ...(singleEntry.fee && {
            fees: {
              amount: singleEntry.fee.amount,
              symbol: reserveToken.symbol
              // ...(reserveToken.price &&
              //   fullyProtectedDec && {
              //     usdValue: new BigNumber(1)
              //       .times(reserveToken.price!)
              //       .toNumber()
              //   })
            }
          }),
          roi:
            fullyProtectedDec &&
            Number(calculatePercentIncrease(reserveTokenDec, fullyProtectedDec))
        } as ViewProtectedLiquidity;
      }
    );

    console.log({ reviewedSingles: viewPositions });
    return viewPositions;
  }

  get poolTokenPositions(): PoolTokenPosition[] {
    const relaysList = this.relaysList;
    const allIouTokens = relaysList.flatMap(iouTokensInRelay);
    const existingBalances = this.tokenBalances.filter(
      balance =>
        balance.balance !== "0" &&
        allIouTokens.some(iouToken =>
          compareString(balance.id, iouToken.contract)
        )
    );

    const relevantRelays = relaysList.filter(relay =>
      iouTokensInRelay(relay).some(token =>
        existingBalances.some(balance =>
          compareString(balance.id, token.contract)
        )
      )
    );

    return relevantRelays.map(relay => {
      const anchorTokens = iouTokensInRelay(relay);
      const iouTokens = existingBalances.filter(existingBalance =>
        anchorTokens.some(anchor =>
          compareString(existingBalance.id, anchor.contract)
        )
      );

      const viewRelay = this.relay(relay.id);
      const isV1 = relay.converterType == PoolType.Traditional;
      if (isV1) {
        return {
          relay: viewRelay,
          smartTokenAmount: iouTokens[0].balance
        };
      } else {
        const chainkLinkRelay = relay as ChainLinkRelay;
        const reserveBalances = iouTokens.map(iouToken => {
          const relevantPoolTokenData = chainkLinkRelay.anchor.poolTokens.find(
            poolToken =>
              compareString(poolToken.poolToken.contract, iouToken.id)
          )!;
          return {
            balance: iouToken.balance,
            reserveId: relevantPoolTokenData.reserveId
          };
        });
        return {
          relay: viewRelay,
          poolTokens: reserveBalances
        };
      }
    });
  }

  get morePoolsAvailable() {
    const allPools = this.registeredAnchorAddresses;
    const remainingPools = allPools
      .filter(
        poolAddress =>
          !this.relaysList.some(relay => compareString(poolAddress, relay.id))
      )
      .filter(
        poolAddress =>
          !this.failedPools.some(failedPool =>
            compareString(failedPool, poolAddress)
          )
      );
    return remainingPools.length > 0;
  }

  @mutation setLoadingPools(status: boolean) {
    this.loadingPools = status;
  }

  @mutation updateFailedPools(ids: string[]) {
    this.failedPools = uniqWith([...this.failedPools, ...ids], compareString);
  }

  @action async loadMorePools() {
    this.setLoadingPools(true);
    const remainingAnchorAddresses = this.registeredAnchorAddresses
      .filter(
        address =>
          !this.relaysList.some(relay => compareString(relay.id, address))
      )
      .filter(
        address =>
          !this.failedPools.some(failedPoolAddress =>
            compareString(address, failedPoolAddress)
          )
      );

    if (remainingAnchorAddresses && remainingAnchorAddresses.length > 0) {
      const remainingPools = await this.add(remainingAnchorAddresses);

      await this.addPoolsBulk(remainingPools);
    }
    this.setLoadingPools(false);
  }

  @action async checkPriceDeviationTooHigh({
    relayId,
    selectedTokenAddress
  }: {
    relayId: string;
    selectedTokenAddress: string;
  }): Promise<boolean> {
    let priceDeviationTooHigh = false;

    const relay = await this.relayById(relayId);

    const converter = buildV28ConverterContract(relay.contract, w3);
    const liquidityProtection = buildLiquidityProtectionContract(
      this.contracts.LiquidityProtection,
      w3
    );

    const [
      recentAverageRateResult,
      averageRateMaxDeviationResult,
      primaryReserveBalanceResult,
      secondaryReserveBalanceResult
    ] = await Promise.all([
      converter.methods.recentAverageRate(selectedTokenAddress).call(),
      liquidityProtection.methods.averageRateMaxDeviation().call(),
      converter.methods
        .reserveBalance(
          // the selected token
          relay.reserves.find(r =>
            compareString(r.contract, selectedTokenAddress)
          )!.contract
        )
        .call(),
      converter.methods
        .reserveBalance(
          // the other token
          relay.reserves.find(
            r => !compareString(r.contract, selectedTokenAddress)
          )!.contract
        )
        .call()
    ]);

    const averageRate = new BigNumber(recentAverageRateResult["1"]).dividedBy(
      recentAverageRateResult["0"]
    );

    console.log("averageRate", averageRate);

    priceDeviationTooHigh = calculatePriceDeviationTooHigh(
      averageRate,
      new BigNumber(primaryReserveBalanceResult),
      new BigNumber(secondaryReserveBalanceResult),
      new BigNumber(averageRateMaxDeviationResult)
    );

    return priceDeviationTooHigh;
  }

  get secondaryReserveChoices(): ModalChoice[] {
    return this.newNetworkTokenChoices;
  }

  get primaryReserveChoices() {
    return (secondaryReserveId: string): ModalChoice[] => {
      const metaTokens = this.tokenMeta.filter(
        meta => !compareString(meta.id, secondaryReserveId)
      );
      const modalChoices = metaTokens.map(metaToModalChoice);
      const balances = this.tokenBalances;
      const tokensWithBalances = updateArray(
        modalChoices,
        token => balances.some(balance => compareString(balance.id, token.id)),
        token => ({
          ...token,
          balance: findOrThrow(balances, balance =>
            compareString(balance.id, token.id)
          ).balance
        })
      );

      return sortAlongSide(
        tokensWithBalances,
        choice => choice.id.toLowerCase(),
        this.tokens.map(token => token.id.toLowerCase())
      );
    };
  }

  get newNetworkTokenChoices(): ModalChoice[] {
    const toOffer = [
      { symbolName: "BNT", value: this.bntUsdPrice },
      { symbolName: "USDB", value: 1 }
    ];

    const addedMeta = toOffer
      .map(offer => ({
        ...offer,
        meta: this.tokenMeta.find(meta =>
          compareString(meta.symbol, offer.symbolName)
        )!
      }))
      .filter(offer => offer.meta);

    return addedMeta.map(meta => {
      const balance = this.tokenBalance(meta.meta.contract);
      const stringBalance =
        balance && new BigNumber(balance.balance).toString();
      return {
        id: meta.meta.id,
        contract: meta.meta.contract,
        img: meta.meta.image,
        symbol: meta.meta.symbol,
        balance: stringBalance,
        usdValue: meta.value
      };
    });
  }

  get newPoolTokenChoices() {
    return (networkToken: string): ModalChoice[] => {
      const tokenChoices = this.tokenMeta
        .map(metaToModalChoice)
        .map(modalChoice => {
          const balance = this.tokenBalance(modalChoice.contract);
          const stringBalance =
            balance && new BigNumber(balance.balance).toString();
          return {
            ...modalChoice,
            balance: stringBalance
          };
        })
        .filter(meta =>
          this.newNetworkTokenChoices.some(
            networkChoice => !compareString(networkChoice.id, meta.id)
          )
        )
        .filter(tokenChoice => tokenChoice.id !== networkToken)
        .filter(meta => {
          const suggestedReserveIds = [meta.id, networkToken];
          const existingRelayWithSameReserves = this.relaysList.some(relay => {
            const reserves = relay.reserves.map(reserve => reserve.contract);
            return suggestedReserveIds.every(id =>
              reserves.some(r => compareString(id, r))
            );
          });
          return !existingRelayWithSameReserves;
        })
        .filter((_, index) => index < 200);

      const sorted = sortAlongSide(
        tokenChoices,
        token => token.id.toLowerCase(),
        this.tokens.map(token => token.id.toLowerCase())
      ).sort((a, b) => Number(b.balance) - Number(a.balance));
      return sorted;
    };
  }

  get currentUser() {
    return vxm.wallet.currentUser;
  }

  @mutation moduleInitiated() {
    this.initiated = true;
  }

  @action async fetchNewConverterAddressFromHash(
    hash: string
  ): Promise<string> {
    const interval = 1000;
    const attempts = 10;

    for (let i = 0; i < attempts; i++) {
      const info = await web3.eth.getTransactionReceipt(hash);
      if (info) {
        return removeLeadingZeros(info.logs[0].address);
      }
      await wait(interval);
    }
    throw new Error("Failed to find new address in decent time");
  }

  @action async fetchNewSmartContractAddressFromHash(
    hash: string
  ): Promise<string> {
    const interval = 1000;
    const attempts = 10;

    for (let i = 0; i < attempts; i++) {
      const info = await web3.eth.getTransactionReceipt(hash);
      console.log(info, "was info");
      if (info) {
        return info.contractAddress!;
      }
      await wait(interval);
    }
    throw new Error("Failed to find new address in decent time");
  }

  @mutation resetData() {
    this.relaysList = [];
    this.tokenBalances = [];
    this.initiated = false;
  }

  @action async onNetworkChange(updatedNetwork: EthNetworks) {
    if (this.currentNetwork !== updatedNetwork) {
      this.resetData();
      this.init();
    }
  }

  @action async deployConverter({
    smartTokenName,
    smartTokenSymbol,
    reserveTokenAddresses,
    precision = 18
  }: {
    smartTokenName: string;
    smartTokenSymbol: string;
    reserveTokenAddresses: string[];
    precision?: number;
  }): Promise<string> {
    if (reserveTokenAddresses.length !== 2)
      throw new Error("Method deployConverter only supports 2 reserves");
    const contract = buildRegistryContract(
      this.contracts.BancorConverterRegistry
    );

    const smartTokenDecimals = precision;

    return this.resolveTxOnConfirmation({
      tx: contract.methods.newConverter(
        1,
        smartTokenName,
        smartTokenSymbol,
        smartTokenDecimals,
        50000,
        reserveTokenAddresses,
        ["500000", "500000"]
      )
    });
  }

  @action async deployV1Converter({
    poolTokenName,
    poolTokenSymbol,
    poolTokenPrecision,
    reserves
  }: {
    poolTokenName: string;
    poolTokenSymbol: string;
    poolTokenPrecision: number;
    reserves: { contract: string; ppmReserveWeight: string }[];
  }): Promise<string> {
    if (reserves.length == 0) throw new Error("Must have at least one reserve");
    const converterRegistryAddress = this.contracts.BancorConverterRegistry;
    const contract = buildRegistryContract(converterRegistryAddress);

    const reserveTokenAddresses = reserves.map(reserve => reserve.contract);
    const reserveWeights = reserves.map(reserve => reserve.ppmReserveWeight);

    const poolType = PoolType.Traditional;

    const poolAlreadyExists = await existingPool(
      converterRegistryAddress,
      poolType,
      reserveTokenAddresses,
      reserveWeights,
      this.currentNetwork
    );
    if (poolAlreadyExists)
      throw new Error(`Similar pool already exists (${poolAlreadyExists})`);

    return this.resolveTxOnConfirmation({
      tx: contract.methods.newConverter(
        poolType,
        poolTokenName,
        poolTokenSymbol,
        poolTokenPrecision,
        50000,
        reserveTokenAddresses,
        reserveWeights
      )
    });
  }

  @action async fetchHistoryData(poolId: string) {
    const pool = await this.relayById(poolId);
    const reserveSymbols = pool.reserves.map(reserve => reserve.symbol);
    const sortedSymbols = sortByNetworkTokens(reserveSymbols, x => x);
    const [, primaryReserveToken] = sortedSymbols;
    return getSmartTokenHistory(primaryReserveToken.toLowerCase());
  }

  @action async createV1Pool({
    onUpdate,
    decFee,
    decimals,
    poolName,
    poolSymbol,
    reserves
  }: CreateV1PoolEthParams): Promise<V1PoolResponse> {
    const hasFee = new BigNumber(decFee).isGreaterThan(0);

    const {
      poolId,
      newConverterTx
    }: { poolId: string; newConverterTx: string } = await multiSteps({
      items: [
        {
          description: "Creating pool...",
          task: async () => {
            const converterRes = await this.deployV1Converter({
              reserves: reserves.map(reserve => ({
                contract: reserve.tokenId,
                ppmReserveWeight: decToPpm(reserve.decReserveWeight)
              })),
              poolTokenName: poolName,
              poolTokenSymbol: poolSymbol,
              poolTokenPrecision: decimals
            });

            const converterAddress = await this.fetchNewConverterAddressFromHash(
              converterRes
            );
            return { converterAddress, newConverterTx: converterRes };
          }
        },
        {
          description: "Transferring ownership...",
          task: async ({ converterAddress, newConverterTx }) => {
            await this.claimOwnership(converterAddress);
            return { converterAddress, newConverterTx };
          }
        },
        ...(hasFee
          ? [
              {
                description: "Setting fee...",
                task: async ({
                  converterAddress,
                  newConverterTx
                }: {
                  converterAddress: string;
                  newConverterTx: string;
                }) => {
                  await this.setFee({
                    converterAddress,
                    ppmFee: decToPpm(decFee)
                  });
                  return { converterAddress, newConverterTx };
                }
              }
            ]
          : []),
        {
          description: "Adding pool...",
          task: async ({
            converterAddress,
            newConverterTx
          }: {
            converterAddress: string;
            newConverterTx: string;
          }) => {
            const registeredAnchorAddresses = await this.fetchAnchorAddresses({
              converterRegistryAddress: this.contracts.BancorConverterRegistry
            });
            const convertersAndAnchors = await this.add(
              registeredAnchorAddresses
            );
            const converterAndAnchor = findOrThrow(
              convertersAndAnchors,
              converterAndAnchor =>
                compareString(
                  converterAndAnchor.converterAddress,
                  converterAddress
                ),
              "failed to find new pool in the contract registry"
            );
            await this.addPoolsBulk([converterAndAnchor]);
            return { newConverterTx, poolId: converterAndAnchor.anchorAddress };
          }
        }
      ],
      onUpdate
    });

    return {
      txId: newConverterTx,
      blockExplorerLink: await this.createExplorerLink(newConverterTx),
      poolId
    };
  }

  @action async createExplorerLink(txHash: string) {
    return generateEtherscanTxLink(
      txHash,
      this.currentNetwork == EthNetworks.Ropsten
    );
  }

  @action async approveTokenWithdrawals(
    approvals: {
      approvedAddress: string;
      amount: string;
      tokenAddress: string;
    }[]
  ) {
    return Promise.all(
      approvals.map(approval => {
        const tokenContract = buildTokenContract(approval.tokenAddress);

        return this.resolveTxOnConfirmation({
          tx: tokenContract.methods.approve(
            approval.approvedAddress,
            approval.amount
          ),
          gas: 70000
        });
      })
    );
  }

  @action async claimBnt(): Promise<TxResponse> {
    const contract = buildLiquidityProtectionContract(
      this.contracts.LiquidityProtection
    );

    const now = moment();
    const availableClaims = this.lockedBalancesArr
      .filter(balance => moment.unix(balance.expirationTime).isBefore(now))
      .sort((a, b) => a.index - b.index);

    const chunked = chunk(availableClaims, 5);
    const txRes = await Promise.all(
      chunked.map(arr => {
        const first = arr[0].index;
        return this.resolveTxOnConfirmation({
          tx: contract.methods.claimBalance(String(first), String(50))
        });
      })
    );
    const hash = last(txRes) as string;

    const bntAddress = getNetworkVariables(this.currentNetwork).bntToken;
    this.spamBalances([bntAddress]);

    (async () => {
      await wait(2000);
      this.fetchLockedBalances();
    })();
    this.fetchLockedBalances();

    return {
      blockExplorerLink: await this.createExplorerLink(hash),
      txId: hash
    };
  }

  @action async claimOwnership(converterAddress: string) {
    const converter = buildConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: converter.methods.acceptOwnership()
    });
  }

  @action async setFee({
    converterAddress,
    ppmFee
  }: {
    converterAddress: string;
    ppmFee: string;
  }) {
    const converterContract = buildConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: converterContract.methods.setConversionFee(ppmFee),
      resolveImmediately: true
    });
  }

  @action async resolveTxOnConfirmation({
    tx,
    gas,
    value,
    resolveImmediately = false,
    onHash
  }: {
    tx: ContractSendMethod;
    value?: string;
    gas?: number;
    resolveImmediately?: boolean;
    onHash?: (hash: string) => void;
  }): Promise<string> {
    console.log("received", tx);
    return new Promise((resolve, reject) => {
      let txHash: string;
      tx.send({
        from: this.currentUser,
        ...(gas && { gas }),
        ...(value && { value: toHex(value) })
      })
        .on("transactionHash", (hash: string) => {
          txHash = hash;
          if (onHash) onHash(hash);
          if (resolveImmediately) {
            resolve(txHash);
          }
        })
        .on("confirmation", () => {
          resolve(txHash);
        })
        .on("error", (error: any) => reject(error));
    });
  }

  @action async addReserveToken({
    converterAddress,
    reserveTokenAddress
  }: {
    converterAddress: string;
    reserveTokenAddress: string;
  }) {
    const converter = buildConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: converter.methods.addReserve(reserveTokenAddress, 500000)
    });
  }

  get supportedFeatures() {
    return () => {
      return ["addLiquidity", "removeLiquidity"];
    };
  }

  get wallet() {
    return "eth";
  }

  get tokens(): ViewToken[] {
    console.time("tokens");

    const whitelistedPools = this.whiteListedPools;

    const ret = this.relaysList
      .filter(relay =>
        relay.reserves.every(reserve => reserve.reserveFeed && reserve.meta)
      )
      .flatMap(relay => {
        const whitelisted = whitelistedPools.some(anchor =>
          compareString(anchor, relay.id)
        );

        const liquidityProtection =
          whitelisted &&
          relay.reserves.some(reserve =>
            compareString(
              reserve.contract,
              this.liquidityProtectionSettings.networkToken
            )
          ) &&
          relay.reserves.length == 2 &&
          relay.reserves.every(reserve => reserve.reserveWeight == 0.5) &&
          Number(relay.version) >= 41;

        return relay.reserves.map(reserve => {
          const { logo, name } = reserve.meta!;
          const balance = this.tokenBalance(reserve.contract);
          const balanceString =
            balance && new BigNumber(balance.balance).toString();

          const reserveFeed = reserve.reserveFeed!;
          return {
            id: reserve.contract,
            contract: reserve.contract,
            precision: reserve.decimals,
            symbol: reserve.symbol,
            liquidityProtection,
            name: name || reserve.symbol,
            ...(reserveFeed.costByNetworkUsd && {
              price: reserveFeed.costByNetworkUsd
            }),
            liqDepth: reserveFeed.liqDepth,
            logo,
            ...(reserveFeed.change24H && { change24h: reserveFeed.change24H }),
            ...(reserveFeed.volume24H && { volume24h: reserveFeed.volume24H }),
            ...(balance && { balance: balanceString })
          };
        });
      })
      .sort(sortByLiqDepth)
      .reduce<ViewToken[]>((acc, item) => {
        const existingToken = acc.find(token =>
          compareString(token.id!, item.id)
        );
        return existingToken
          ? updateArray(
              acc,
              token =>
                compareString(token.id!, item.id) && !isNaN(item.liqDepth),
              token => ({
                ...token,
                liqDepth: token.liqDepth! + item.liqDepth,
                liquidityProtection:
                  token.liquidityProtection || item.liquidityProtection
              })
            )
          : [...acc, item as ViewToken];
      }, []);
    console.timeEnd("tokens");
    return ret;
  }

  get tokenMetaObj() {
    return (id: string) => {
      return findOrThrow(
        this.tokenMeta,
        meta => compareString(id, meta.id),
        `Failed to find token meta for symbol with token contract of ${id}`
      );
    };
  }

  get tokenBalance() {
    return (tokenId: string) =>
      this.tokenBalances.find(token => compareString(token.id, tokenId));
  }

  get token(): (arg0: string) => ViewToken {
    return (id: string) =>
      findOrThrow(
        this.tokens,
        token => compareString(token.id, id),
        `failed to find token() with ID ${id} ethBancor`
      );
  }

  get relay() {
    return (id: string) =>
      findOrThrow(
        this.relays,
        relay => compareString(relay.id, id),
        `failed to find relay with id of ${id} in eth relay getter`
      );
  }

  get relays(): ViewRelay[] {
    const toReturn = [...this.chainkLinkRelays, ...this.traditionalRelays]
      .sort(sortByLiqDepth)
      .sort(prioritiseV2Pools);

    return toReturn;
  }

  get chainkLinkRelays(): ViewRelay[] {
    return (this.relaysList.filter(isChainLink) as ChainLinkRelay[])
      .filter(relay =>
        relay.reserves.every(reserve => reserve.reserveFeed && reserve.meta)
      )
      .map(relay => {
        const [, tokenReserve] = relay.reserves;

        const { poolContainerAddress } = relay.anchor;

        return {
          id: poolContainerAddress,
          version: Number(relay.version),
          reserves: relay.reserves.map(reserve => ({
            reserveWeight: reserve.reserveWeight,
            id: reserve.contract,
            reserveId: poolContainerAddress + reserve.contract,
            logo: [reserve.meta!.logo],
            symbol: reserve.symbol,
            contract: reserve.contract,
            smartTokenSymbol: poolContainerAddress
          })),
          fee: relay.fee,
          liqDepth: relay.reserves.reduce(
            (acc, item) => acc + item.reserveFeed!.liqDepth,
            0
          ),
          symbol: tokenReserve.symbol,
          addLiquiditySupported: true,
          removeLiquiditySupported: true,
          whitelisted: false,
          liquidityProtection: false,
          focusAvailable: false,
          v2: true
        } as ViewRelay;
      });
  }

  get traditionalRelays(): ViewRelay[] {
    const availableHistories = this.availableHistories;

    const aprs = this.poolAprs;
    const poolLiquidityMiningAprs = this.poolLiqMiningAprs;
    const whiteListedPools = this.whiteListedPools;
    const previousRelayBalances = this.previousRelayBalances;

    return (this.relaysList.filter(isTraditional) as TraditionalRelay[])
      .filter(relay =>
        relay.reserves.every(reserve => reserve.reserveFeed && reserve.meta)
      )
      .map(relay => {
        const [, tokenReserve] = relay.reserves;

        const smartTokenSymbol = relay.anchor.symbol;
        const hasHistory = availableHistories.some(history =>
          compareString(smartTokenSymbol, history)
        );

        let liqDepth = relay.reserves.reduce(
          (acc, item) => acc + item.reserveFeed!.liqDepth,
          0
        );

        if (Number.isNaN(liqDepth)) {
          liqDepth = 0;
        }

        const whitelisted = whiteListedPools.some(whitelistedAnchor =>
          compareString(whitelistedAnchor, relay.anchor.contract)
        );

        const liquidityProtection =
          relay.reserves.some(reserve =>
            compareString(
              reserve.contract,
              this.liquidityProtectionSettings.networkToken
            )
          ) &&
          relay.reserves.length == 2 &&
          relay.reserves.every(reserve => reserve.reserveWeight == 0.5) &&
          Number(relay.version) >= 41 &&
          whitelisted;

        const apr = aprs.find(apr =>
          compareString(apr.poolId, relay.anchor.contract)
        );

        const feesGenerated = previousRelayBalances.find(r =>
          compareString(r.relay.id, relay.id)
        );

        const feesVsLiquidity =
          feesGenerated &&
          new BigNumber(feesGenerated.totalFees)
            .times(365)
            .div(liqDepth)
            .toString();

        const volume = feesGenerated && feesGenerated.totalVolume;

        const aprMiningRewards = poolLiquidityMiningAprs.find(apr =>
          compareString(apr.poolId, relay.id)
        );

        return {
          id: relay.anchor.contract,
          version: Number(relay.version),
          reserves: relay.reserves.map(reserve => ({
            id: reserve.contract,
            reserveWeight: reserve.reserveWeight,
            reserveId: relay.anchor.contract + reserve.contract,
            logo: [reserve.meta!.logo],
            symbol: reserve.symbol,
            contract: reserve.contract,
            smartTokenSymbol: relay.anchor.contract
          })),
          fee: relay.fee,
          liqDepth,
          symbol: tokenReserve.symbol,
          addLiquiditySupported: true,
          removeLiquiditySupported: true,
          liquidityProtection,
          whitelisted,
          focusAvailable: hasHistory,
          v2: false,
          ...(apr && { apr: apr.oneWeekApr }),
          ...(feesGenerated && { feesGenerated: feesGenerated.totalFees }),
          ...(feesVsLiquidity && { feesVsLiquidity }),
          ...(volume && { volume }),
          aprMiningRewards
        } as ViewRelay;
      });
  }

  @action async getGeometricMean(amounts: string[]) {
    const converter = buildConverterContract(
      getNetworkVariables(this.currentNetwork).converterContractForMaths,
      w3
    );
    return converter.methods.geometricMean(amounts).call();
  }

  @mutation setTokenMeta(tokenMeta: TokenMeta[]) {
    this.tokenMeta = tokenMeta.map(meta => {
      const hasDecimals = typeof meta.precision !== "undefined";
      return hasDecimals
        ? { ...meta, precision: Number(meta.precision!) }
        : meta;
    });
  }

  @action async triggerTx(actions: any[]) {
    // @ts-ignore
    return this.$store.dispatch("ethWallet/tx", actions, { root: true });
  }

  @action async fetchRelayBalances({
    poolId,
    blockHeight
  }: {
    poolId: string;
    blockHeight?: number;
  }) {
    const { reserves, version, contract } = await this.relayById(poolId);

    const converterContract = buildConverterContract(contract, w3);
    const smartTokenContract = buildTokenContract(poolId, w3);

    const requestAtParticularBlock = typeof blockHeight !== undefined;

    const [reserveBalances, smartTokenSupplyWei] = await Promise.all([
      Promise.all(
        reserves.map(reserve =>
          fetchReserveBalance(
            converterContract,
            reserve.contract,
            version,
            blockHeight
          )
        )
      ),
      requestAtParticularBlock
        ? // @ts-ignore
          smartTokenContract.methods.totalSupply().call(null, blockHeight)
        : smartTokenContract.methods.totalSupply().call()
    ]);

    return {
      reserves: reserves.map((reserve, index) => ({
        ...reserve,
        weiAmount: reserveBalances[index]
      })),
      smartTokenSupplyWei
    };
  }

  @action async calculateOpposingDepositInfo(
    opposingDeposit: OpposingLiquidParams
  ): Promise<EthOpposingLiquid> {
    const {
      id,
      reserves: reservesViewAmounts,
      changedReserveId
    } = opposingDeposit;
    const reserve = findChangedReserve(reservesViewAmounts, changedReserveId);

    const relay = await this.traditionalRelayById(id);

    const reserveToken = await this.tokenById(reserve.id);

    const tokenSymbol = reserveToken.symbol;
    const tokenAmount = reserve.amount;

    const smartTokenAddress = relay.anchor.contract;
    const smartTokenDecimals = relay.anchor.decimals;

    this.getUserBalance({ tokenContractAddress: smartTokenAddress });
    const { reserves, smartTokenSupplyWei } = await this.fetchRelayBalances({
      poolId: smartTokenAddress
    });

    const [sameReserve, opposingReserve] = sortByNetworkTokens(
      reserves,
      reserve => reserve.symbol,
      [tokenSymbol]
    );

    const reserveBalancesAboveZero = reserves.every(reserve =>
      new BigNumber(reserve.weiAmount).gt(0)
    );
    const sameReserveWei = expandToken(tokenAmount, sameReserve.decimals);

    const userSmartTokenBalance = this.tokenBalances.find(balance =>
      compareString(balance.id, smartTokenAddress)
    );

    const userSmartTokenBalanceWei =
      userSmartTokenBalance &&
      new BigNumber(userSmartTokenBalance.balance).gt(0)
        ? expandToken(userSmartTokenBalance.balance, smartTokenDecimals)
        : "0";

    if (!reserveBalancesAboveZero) {
      const matchedInputs = reservesViewAmounts.map(viewAmount => ({
        decAmount: viewAmount.amount,
        decimals: findOrThrow(reserves, reserve =>
          compareString(reserve.contract, viewAmount.id)
        ).decimals
      }));

      const notAllInputsAreNumbers = matchedInputs.some(input =>
        new BigNumber(input.decAmount).isNaN()
      );
      if (notAllInputsAreNumbers) {
        return {
          shareOfPool: 0,
          smartTokenAmountWei: { amount: "1", id: smartTokenAddress },
          singleUnitCosts: [],
          opposingAmount: undefined,
          reserveBalancesAboveZero
        };
      }
      const weiInputs = matchedInputs.map(input =>
        expandToken(input.decAmount, input.decimals)
      );
      const fundReward = await this.getGeometricMean(weiInputs);
      console.log(fundReward, "was returned with geometric mean");

      const shareOfPool = calculateShareOfPool(
        fundReward,
        smartTokenSupplyWei,
        userSmartTokenBalanceWei
      );

      const singleUnitCosts =
        matchedInputs.length == 2
          ? buildSingleUnitCosts(reservesViewAmounts[0], reservesViewAmounts[1])
          : [];

      return {
        shareOfPool,
        smartTokenAmountWei: { amount: fundReward, id: smartTokenAddress },
        singleUnitCosts,
        opposingAmount: undefined,
        reserveBalancesAboveZero
      };
    }

    const opposingAmount = calculateOppositeFundRequirement(
      sameReserveWei,
      sameReserve.weiAmount,
      opposingReserve.weiAmount
    );
    const fundReward = calculateFundReward(
      sameReserveWei,
      sameReserve.weiAmount,
      smartTokenSupplyWei
    );

    const shareOfPool = calculateShareOfPool(
      fundReward,
      smartTokenSupplyWei,
      userSmartTokenBalanceWei
    );

    const opposingReserveSupplyDec = shrinkToken(
      opposingReserve.weiAmount,
      opposingReserve.decimals
    );
    const sameReserveSupplyDec = shrinkToken(
      sameReserve.weiAmount,
      sameReserve.decimals
    );

    const singleUnitCosts = buildSingleUnitCosts(
      { id: opposingReserve.contract, amount: opposingReserveSupplyDec },
      { id: sameReserve.contract, amount: sameReserveSupplyDec }
    );

    const res = {
      opposingAmount: shrinkToken(opposingAmount, opposingReserve.decimals),
      smartTokenAmountWei: { id: smartTokenAddress, amount: fundReward },
      shareOfPool,
      singleUnitCosts: sortAlongSide(
        singleUnitCosts,
        unitCost => unitCost.id,
        relay.reserves.map(reserve => reserve.contract)
      ),
      reserveBalancesAboveZero
    };
    return res;
  }

  @action async fetchV2PoolBalances(
    relay: ChainLinkRelay
  ): Promise<StakedAndReserve> {
    const [reserveOne, reserveTwo] = relay.reserves;
    const [[poolBalace]] = ((await this.multi({
      groupsOfShapes: [
        [
          v2PoolBalanceShape(
            relay.contract,
            reserveOne.contract,
            reserveTwo.contract,
            this.currentNetwork
          )
        ]
      ]
    })) as unknown) as [RawAbiV2PoolBalances][];

    return rawAbiV2ToStacked(poolBalace);
  }

  @action async calculateOpposingDepositV2(
    opposingDeposit: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.chainLinkRelayById(opposingDeposit.id);

    const changedReserve = findChangedReserve(
      opposingDeposit.reserves,
      opposingDeposit.changedReserveId
    );
    const suggestedDepositDec = changedReserve.amount;

    const stakedAndReserveWeight = await this.fetchV2PoolBalances(relay);

    const [biggerWeight, smallerWeight] = stakedAndReserveWeight.reserves
      .map(reserve => ({
        ...reserve,
        decReserveWeight: new BigNumber(reserve.reserveWeight as string).div(
          oneMillion
        ),
        token: findOrThrow(
          relay.reserves,
          r => compareString(r.contract, reserve.reserveAddress),
          "failed to find token for weight"
        )
      }))
      .sort((a, b) => b.decReserveWeight.minus(a.decReserveWeight).toNumber());

    const weightsEqualOneMillion = new BigNumber(
      biggerWeight.reserveWeight as string
    )
      .plus(smallerWeight.reserveWeight as string)
      .eq(oneMillion);
    if (!weightsEqualOneMillion)
      throw new Error("Was expecting reserve weights to equal 100%");
    const distanceFromMiddle = biggerWeight.decReserveWeight.minus(0.5);

    const adjustedBiggerWeight = new BigNumber(biggerWeight.stakedBalance).div(
      new BigNumber(1).minus(distanceFromMiddle)
    );
    const adjustedSmallerWeight = new BigNumber(
      smallerWeight.stakedBalance
    ).div(new BigNumber(1).plus(distanceFromMiddle));

    const singleUnitCosts = buildSingleUnitCosts(
      {
        id: biggerWeight.reserveAddress,
        amount: shrinkToken(
          adjustedBiggerWeight.toString(),
          biggerWeight.token.decimals
        )
      },
      {
        id: smallerWeight.reserveAddress,
        amount: shrinkToken(
          adjustedSmallerWeight.toString(),
          smallerWeight.token.decimals
        )
      }
    );

    const sameReserve = findOrThrow(
      [biggerWeight, smallerWeight],
      weight => compareString(weight.reserveAddress, changedReserve.id),
      "failed to find same reserve"
    );

    const suggestedDepositWei = expandToken(
      suggestedDepositDec,
      sameReserve.token.decimals
    );

    const shareOfPool = new BigNumber(suggestedDepositWei)
      .div(sameReserve.stakedBalance)
      .toNumber();

    const v2Converter = buildV2Converter(relay.contract, w3);
    const maxStakingEnabled = await v2Converter.methods
      .maxStakedBalanceEnabled()
      .call();
    console.log({ maxStakingEnabled });
    if (maxStakingEnabled) {
      const maxStakedBalance = await v2Converter.methods
        .maxStakedBalances(sameReserve.reserveAddress)
        .call();

      console.log({ maxStakedBalance });
      if (maxStakedBalance !== "0") {
        const currentBalance = new BigNumber(sameReserve.stakedBalance);
        const proposedTotalBalance = new BigNumber(suggestedDepositWei).plus(
          currentBalance
        );
        const maxStakedBalanceWei = new BigNumber(maxStakedBalance);
        if (proposedTotalBalance.gt(maxStakedBalanceWei)) {
          const remainingSpaceAvailableWei = maxStakedBalanceWei.minus(
            currentBalance
          );
          const remainingSpaceAvailableDec = shrinkToken(
            remainingSpaceAvailableWei.toString(),
            sameReserve.token.decimals
          );
          if (remainingSpaceAvailableWei.isLessThanOrEqualTo(0))
            throw new Error("This pool has reached the max liquidity cap");
          throw new Error(
            `This pool is currently capped and can receive ${remainingSpaceAvailableDec} additional tokens`
          );
        }
      }
    }

    const result = {
      opposingAmount: undefined,
      shareOfPool,
      singleUnitCosts
    };
    console.log(result, "was the result");
    return result;
  }

  @action async fetchSystemBalance(tokenAddress: string): Promise<string> {
    const isValidAddress = web3.utils.isAddress(tokenAddress);
    if (!isValidAddress)
      throw new Error(`${tokenAddress} is not a valid address`);
    const contract = buildLiquidityProtectionStoreContract(
      this.contracts.LiquidityProtectionStore,
      w3
    );
    return contract.methods.systemBalance(tokenAddress).call();
  }

  @action async isHighTierPool(anchor: string): Promise<boolean> {
    return this.highTierPoolsArr.some(anchorId =>
      compareString(anchor, anchorId)
    );
  }

  @action async getMaxStakes({ poolId }: { poolId: string }) {
    const [balances, poolTokenBalance, isHighTierPool] = await Promise.all([
      this.fetchRelayBalances({ poolId }),
      this.fetchSystemBalance(poolId),
      this.isHighTierPool(poolId)
    ]);

    const [bntReserve, tknReserve] = sortAlongSide(
      balances.reserves,
      reserve => reserve.contract,
      [this.liquidityProtectionSettings.networkToken]
    );

    const [bntReserveBalance, tknReserveBalance] = [bntReserve, tknReserve].map(
      reserve => reserve.weiAmount
    );

    const maxStakes = calculateMaxStakes(
      tknReserveBalance,
      bntReserveBalance,
      balances.smartTokenSupplyWei,
      poolTokenBalance,
      this.liquidityProtectionSettings.maxSystemNetworkTokenAmount,
      this.liquidityProtectionSettings.maxSystemNetworkTokenRatio,
      isHighTierPool
    );

    return { maxStakes, bntReserve, tknReserve };
  }

  @action async getMaxStakesView({ poolId }: { poolId: string }) {
    const maxStakes = await this.getMaxStakes({ poolId });

    return [
      {
        amount: shrinkToken(
          maxStakes.maxStakes.maxAllowedBntWei,
          maxStakes.bntReserve.decimals
        ),
        token: maxStakes.bntReserve.symbol
      },
      {
        amount: shrinkToken(
          maxStakes.maxStakes.maxAllowedTknWei,
          maxStakes.tknReserve.decimals
        ),
        token: maxStakes.tknReserve.symbol
      }
    ];
  }

  @action async calculateProtectionSingle({
    poolId,
    reserveAmount
  }: {
    poolId: string;
    reserveAmount: ViewAmount;
  }): Promise<ProtectionRes> {
    const depositingNetworkToken = compareString(
      this.liquidityProtectionSettings.networkToken,
      reserveAmount.id
    );

    const inputToken = this.token(reserveAmount.id);

    const { maxStakes } = await this.getMaxStakes({ poolId });

    const inputAmountWei = expandToken(
      reserveAmount.amount,
      inputToken.precision
    );

    const overMaxLimit = new BigNumber(inputAmountWei).isGreaterThan(
      depositingNetworkToken
        ? maxStakes.maxAllowedBntWei
        : maxStakes.maxAllowedTknWei
    );

    return {
      outputs: [],
      ...(overMaxLimit && { error: "Insufficient store balance" })
    };
  }

  @action async calculateProtectionDouble({
    poolTokenAmount
  }: {
    poolTokenAmount: ViewAmount;
  }): Promise<ProtectionRes> {
    const relay = findOrThrow(this.relaysList, relay =>
      compareString(relay.id, poolTokenAmount.id)
    );
    const smartToken = relay.anchor as SmartToken;

    const balances = await this.fetchRelayBalances({
      poolId: smartToken.contract
    });

    const outputs = balances.reserves.map(reserve => {
      console.log(reserve, balances, "dishes");
      const rate = new BigNumber(
        calculatePoolTokenRate(balances.smartTokenSupplyWei, reserve.weiAmount)
      ).div(2);

      const reserveAmount = rate.times(poolTokenAmount.amount);
      console.log(rate, "is long string");
      return {
        id: reserve.contract,
        amount: reserveAmount.toString(),
        symbol: reserve.symbol
      };
    });

    return {
      outputs
    };
  }

  @action async calculateOpposingDeposit(
    opposingDeposit: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.relayById(opposingDeposit.id);

    if (relay.converterType == PoolType.ChainLink) {
      return this.calculateOpposingDepositV2(opposingDeposit);
    } else {
      return this.calculateOpposingDepositInfo(opposingDeposit);
    }
  }

  @action async fetchTokenBalances(
    tokenAddresses: string[]
  ): Promise<Balance[]> {
    if (!this.currentUser)
      throw new Error("Cannot fetch balances when not logged in");
    const uniqueAddresses = uniqWith(tokenAddresses, compareString);

    const meta = this.tokenMeta;

    const decimalIsKnown = (address: string) =>
      meta.some(
        meta =>
          compareString(meta.contract, address) &&
          !typeof meta.precision !== undefined
      );

    const [knownDecimals, unknownDecimals] = partition(
      uniqueAddresses,
      decimalIsKnown
    );

    const owner = this.currentUser;

    const knownDecimalShapes = knownDecimals.map(address =>
      slimBalanceShape(address, owner, this.currentNetwork)
    );

    const unknownDecimalShapes = unknownDecimals.map(address =>
      balanceShape(address, owner, this.currentNetwork)
    );

    try {
      const [knownDecimalsRes, unknownDecimalsRes] = (await this.multi({
        groupsOfShapes: [knownDecimalShapes, unknownDecimalShapes]
      })) as [
        { contract: string; balance: string }[],
        { contract: string; balance: string; decimals: string }[]
      ];

      const knownResDec = knownDecimalsRes.map(res => {
        const tokenMeta = meta.find(
          meta =>
            compareString(meta.contract, res.contract) &&
            decimalIsKnown(meta.contract)
        )!;
        const shrunkBalance = shrinkToken(res.balance, tokenMeta.precision!);
        return res.balance !== "0" ? { ...res, balance: shrunkBalance } : res;
      });

      const [passedUnknown, failedUnknown] = partition(
        unknownDecimalsRes,
        res => typeof res.decimals !== "undefined"
      );

      if (failedUnknown.length > 0) {
        // sentry warning
        console.warn("failed to find decimals for", failedUnknown);
      }

      const unknownResDec = passedUnknown.map(res => ({
        ...res,
        balance:
          res.balance !== "0"
            ? shrinkToken(res.balance, Number(res.decimals))
            : res.balance
      }));

      const decBalances = [...knownResDec, ...unknownResDec];

      return decBalances.map(
        (balance): Balance => ({
          balance: balance.balance,
          id: balance.contract
        })
      );
    } catch (e) {
      throw new Error("Failed to fetch balances");
    }
  }

  @action async getUserBalance({
    tokenContractAddress,
    userAddress,
    keepWei = false
  }: {
    tokenContractAddress: string;
    userAddress?: string;
    keepWei?: boolean;
  }) {
    console.count("getUserBalanceDirect");
    if (!tokenContractAddress)
      throw new Error("Token contract address cannot be falsy");
    const balance = await vxm.ethWallet.getBalance({
      accountHolder: userAddress || vxm.wallet.currentUser,
      tokenContractAddress,
      keepWei
    });
    const currentBalance = this.tokenBalance(tokenContractAddress);
    const balanceDifferentToAlreadyStored =
      currentBalance && currentBalance.balance !== balance && !keepWei;
    const balanceNotStoredAndNotZero = new BigNumber(balance).gt(0) && !keepWei;

    if (balanceDifferentToAlreadyStored || balanceNotStoredAndNotZero) {
      this.updateUserBalances([{ id: tokenContractAddress, balance }]);
    }
    return balance;
  }

  @mutation updateUserBalances(freshBalances: Balance[]) {
    const currentBalances = this.tokenBalances;

    const [actualBalances, nullBalances] = partition(freshBalances, balance =>
      new BigNumber(balance.balance).isGreaterThan(0)
    );
    const droppedNullBalances = currentBalances.filter(
      balance => !nullBalances.some(b => compareString(balance.id, b.id))
    );

    const freshBalancesToUpdate = actualBalances.filter(balance => {
      const alreadyExists = droppedNullBalances.find(b =>
        compareString(b.id, balance.id)
      );
      return alreadyExists && alreadyExists.balance !== balance.balance;
    });
    const balancesToAdd = differenceWith(
      actualBalances,
      freshBalancesToUpdate,
      compareById
    );

    const updatedBalances = updateArray(
      droppedNullBalances,
      balance =>
        freshBalancesToUpdate.some(b => compareString(balance.id, b.id)),
      balance =>
        freshBalancesToUpdate.find(b => compareString(balance.id, b.id))!
    );
    const addedBalances = [...updatedBalances, ...balancesToAdd];

    this.tokenBalances = addedBalances;
  }

  @action async relayById(relayId: string) {
    return findOrThrow(
      this.relaysList,
      relay => compareString(relay.id, relayId),
      "failed to find relay by id"
    );
  }

  @action async getUserBalancesTraditional({
    relayId,
    smartTokenDec
  }: {
    relayId: string;
    smartTokenDec?: string;
  }): Promise<UserPoolBalances> {
    const relay = await this.traditionalRelayById(relayId);

    const smartTokenUserBalance =
      smartTokenDec ||
      (await this.getUserBalance({
        tokenContractAddress: relay.anchor.contract
      }));

    const { smartTokenSupplyWei, reserves } = await this.fetchRelayBalances({
      poolId: relay.anchor.contract
    });

    const smartTokenDecimals = relay.anchor.decimals;

    const percent = new Decimal(smartTokenUserBalance).div(
      shrinkToken(smartTokenSupplyWei, smartTokenDecimals)
    );

    const maxWithdrawals: ViewAmount[] = reserves.map(reserve => ({
      id: reserve.contract,
      amount: shrinkToken(
        percent.times(reserve.weiAmount).toString(),
        reserve.decimals
      )
    }));

    return {
      maxWithdrawals,
      iouBalances: [{ id: "", amount: String(smartTokenUserBalance) }]
    };
  }

  @action async getPoolType(pool: string | Relay): Promise<PoolType> {
    let relay: Relay;
    if (typeof pool == "undefined") {
      throw new Error("Pool is undefined");
    } else if (typeof pool == "string") {
      const poolId = pool as string;
      relay = await this.relayById(poolId);
    } else {
      relay = pool as Relay;
    }
    return typeof relay.converterType !== "undefined" &&
      relay.converterType == PoolType.ChainLink
      ? PoolType.ChainLink
      : PoolType.Traditional;
  }

  @action async removeLiquidityReturn({
    converterAddress,
    poolTokenWei,
    poolTokenContract
  }: {
    converterAddress: string;
    poolTokenWei: string;
    poolTokenContract: string;
  }) {
    const v2Converter = buildV2Converter(converterAddress, w3);

    const res = await v2Converter.methods
      .removeLiquidityReturnAndFee(poolTokenContract, poolTokenWei)
      .call();

    return { feeAmountWei: res[1], returnAmountWei: res[0] };
  }

  @action async getUserBalancesChainLink(
    relayId: string
  ): Promise<UserPoolBalances> {
    const relay = await this.chainLinkRelayById(relayId);
    const poolTokenBalances = await Promise.all(
      relay.anchor.poolTokens.map(async reserveAndPool => {
        const poolUserBalance = await this.getUserBalance({
          tokenContractAddress: reserveAndPool.poolToken.contract,
          keepWei: false
        });

        BigNumber.config({ EXPONENTIAL_AT: 256 });

        return {
          ...reserveAndPool,
          poolUserBalance: Number(poolUserBalance),
          reserveToken: findOrThrow(
            relay.reserves,
            reserve =>
              compareString(reserve.contract, reserveAndPool.reserveId),
            "failed to find reserve token"
          )
        };
      })
    );

    const v2Converter = buildV2Converter(relay.contract, w3);
    const data = await Promise.all(
      poolTokenBalances.map(async poolTokenBalance => {
        const poolTokenBalanceWei = expandToken(
          poolTokenBalance.poolUserBalance,
          poolTokenBalance.poolToken.decimals
        );

        const maxWithdrawWei = (
          await v2Converter.methods
            .removeLiquidityReturnAndFee(
              poolTokenBalance.poolToken.contract,
              poolTokenBalanceWei
            )
            .call()
        )[0];

        return {
          ...poolTokenBalance,
          maxWithdraw: shrinkToken(
            maxWithdrawWei,
            poolTokenBalance.reserveToken.decimals
          )
        };
      })
    );

    const maxWithdrawals = data.map(
      (x): ViewAmount => ({
        id: x.reserveId,
        amount: String(x.maxWithdraw)
      })
    );

    const iouBalances = data.map(
      (x): ViewAmount => ({
        id: x.reserveId,
        amount: new BigNumber(x.poolUserBalance).toString()
      })
    );

    console.log({ iouBalances, maxWithdrawals });

    return { iouBalances, maxWithdrawals };
  }

  @action async getUserBalances(relayId: string): Promise<UserPoolBalances> {
    if (!vxm.wallet.currentUser)
      throw new Error("Cannot find users .currentUser");

    const poolType = await this.getPoolType(relayId);
    console.log("detected pool type is", poolType);
    return poolType == PoolType.Traditional
      ? this.getUserBalancesTraditional({ relayId })
      : this.getUserBalancesChainLink(relayId);
  }

  @action async getTokenSupply(tokenAddress: string) {
    const contract = buildTokenContract(tokenAddress, w3);
    return contract.methods.totalSupply().call();
  }

  @action async calculateOpposingWithdrawV2(
    opposingWithdraw: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.chainLinkRelayById(opposingWithdraw.id);

    const changedReserve = findChangedReserve(
      opposingWithdraw.reserves,
      opposingWithdraw.changedReserveId
    );
    const suggestedPoolTokenWithdrawDec = changedReserve.amount;

    const stakedAndReserveWeight = await this.fetchV2PoolBalances(relay);

    const matchedWeights = stakedAndReserveWeight.reserves.map(reserve => ({
      reserveWeight: reserve.reserveWeight,
      stakedBalance: reserve.stakedBalance,
      decReserveWeight: new BigNumber(reserve.reserveWeight as string).div(
        oneMillion
      ),
      reserveToken: findOrThrow(
        relay.reserves,
        r => compareString(r.contract, reserve.reserveAddress),
        "failed to find reserve token"
      ),
      poolToken: findOrThrow(
        relay.anchor.poolTokens,
        poolToken =>
          compareString(reserve.poolTokenAddress, poolToken.poolToken.contract),
        "failed to find pool token"
      )
    }));

    const [biggerWeight, smallerWeight] = matchedWeights.sort((a, b) =>
      b.decReserveWeight.minus(a.decReserveWeight).toNumber()
    );

    const weightsEqualOneMillion = new BigNumber(
      biggerWeight.reserveWeight as string
    )
      .plus(smallerWeight.reserveWeight as string)
      .eq(oneMillion);
    if (!weightsEqualOneMillion)
      throw new Error("Was expecting reserve weights to equal 100%");

    const distanceFromMiddle = biggerWeight.decReserveWeight.minus(0.5);

    const adjustedBiggerWeight = new BigNumber(biggerWeight.stakedBalance).div(
      new BigNumber(1).minus(distanceFromMiddle)
    );
    const adjustedSmallerWeight = new BigNumber(
      smallerWeight.stakedBalance
    ).div(new BigNumber(1).plus(distanceFromMiddle));

    const singleUnitCosts = sortAlongSide(
      buildSingleUnitCosts(
        {
          id: biggerWeight.reserveToken.contract,
          amount: shrinkToken(
            adjustedBiggerWeight.toString(),
            biggerWeight.reserveToken.decimals
          )
        },
        {
          id: smallerWeight.reserveToken.contract,
          amount: shrinkToken(
            adjustedSmallerWeight.toString(),
            smallerWeight.reserveToken.decimals
          )
        }
      ),
      unitCost => unitCost.id,
      relay.reserves.map(x => x.contract)
    );

    const sameReserve = findOrThrow(
      matchedWeights,
      weight => compareString(weight.reserveToken.contract, changedReserve.id),
      "failed to find same reserve"
    );

    const shareOfPool = new BigNumber(suggestedPoolTokenWithdrawDec)
      .div(
        shrinkToken(
          sameReserve.stakedBalance,
          sameReserve.reserveToken.decimals
        )
      )
      .toNumber();

    const suggestedWithdrawWei = expandToken(
      suggestedPoolTokenWithdrawDec,
      sameReserve.poolToken.poolToken.decimals
    );

    const [
      { returnAmountWei, feeAmountWei },
      liquidatationLimitWei
    ] = await Promise.all([
      this.removeLiquidityReturn({
        converterAddress: relay.contract,
        poolTokenContract: sameReserve.poolToken.poolToken.contract,
        poolTokenWei: suggestedWithdrawWei
      }),
      liquidationLimit({
        converterContract: relay.contract,
        poolTokenAddress: sameReserve.poolToken.poolToken.contract,
        web3: w3
      })
    ]);

    if (new BigNumber(suggestedWithdrawWei).gt(liquidatationLimitWei))
      throw new Error("Withdrawal amount above current liquidation limit");

    const noFeeLiquidityReturn = new BigNumber(returnAmountWei).plus(
      feeAmountWei
    );

    const feePercent = new BigNumber(feeAmountWei)
      .div(noFeeLiquidityReturn)
      .toNumber();

    const removeLiquidityReturnDec = shrinkToken(
      returnAmountWei,
      sameReserve.reserveToken.decimals
    );

    const result = {
      opposingAmount: undefined,
      shareOfPool,
      singleUnitCosts,
      withdrawFee: feePercent,
      expectedReturn: {
        id: sameReserve.reserveToken.contract,
        amount: removeLiquidityReturnDec
      }
    };
    console.log(result, "was the result");
    return result;
  }

  @action async calculateOpposingWithdraw(
    opposingWithdraw: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    const relay = await this.relayById(opposingWithdraw.id);
    if (relay.converterType == PoolType.ChainLink) {
      return this.calculateOpposingWithdrawV2(opposingWithdraw);
    } else {
      return this.calculateOpposingWithdrawInfo(opposingWithdraw);
    }
  }

  @action async traditionalRelayById(
    poolId: string
  ): Promise<TraditionalRelay> {
    const relay = await this.relayById(poolId);
    const traditionalRelay = assertTraditional(relay);
    return traditionalRelay;
  }

  @action async chainLinkRelayById(poolId: string): Promise<ChainLinkRelay> {
    const relay = await this.relayById(poolId);
    const chainlinkRelay = assertChainlink(relay);
    return chainlinkRelay;
  }

  @action async calculateOpposingWithdrawInfo(
    opposingWithdraw: OpposingLiquidParams
  ): Promise<EthOpposingLiquid> {
    const {
      id,
      reserves: reservesViewAmounts,
      changedReserveId
    } = opposingWithdraw;

    const reserve = findChangedReserve(reservesViewAmounts, changedReserveId);
    const tokenAmount = reserve.amount;
    const sameReserveToken = await this.tokenById(reserve.id);

    const relay = await this.traditionalRelayById(id);
    const smartTokenAddress = relay.anchor.contract;

    const { reserves, smartTokenSupplyWei } = await this.fetchRelayBalances({
      poolId: smartTokenAddress
    });

    const reserveBalancesAboveZero = reserves.every(reserve =>
      new BigNumber(reserve.weiAmount).gt(0)
    );

    const [sameReserve, opposingReserve] = sortByNetworkTokens(
      reserves,
      reserve => reserve.symbol,
      [sameReserveToken.symbol]
    );

    const sameReserveWei = expandToken(tokenAmount, sameReserve.decimals);
    const shareOfPool = new BigNumber(sameReserveWei)
      .div(sameReserve.weiAmount)
      .toNumber();

    const opposingValue = calculateOppositeLiquidateRequirement(
      sameReserveWei,
      sameReserve.weiAmount,
      opposingReserve.weiAmount
    );
    const liquidateCostWei = calculateLiquidateCost(
      sameReserveWei,
      sameReserve.weiAmount,
      smartTokenSupplyWei
    );

    const smartUserBalanceWei = await vxm.ethWallet.getBalance({
      accountHolder: vxm.wallet.currentUser,
      tokenContractAddress: smartTokenAddress,
      keepWei: true
    });

    const percentDifferenceBetweenSmartBalance = percentDifference(
      liquidateCostWei,
      String(smartUserBalanceWei)
    );
    let smartTokenAmount: string;
    if (percentDifferenceBetweenSmartBalance > 0.99) {
      smartTokenAmount = String(smartUserBalanceWei);
    } else {
      smartTokenAmount = liquidateCostWei;
    }

    const sameReserveCost = shrinkToken(
      new BigNumber(opposingReserve.weiAmount)
        .div(sameReserve.weiAmount)
        .toString(),
      sameReserve.decimals
    );
    const opposingReserveCost = shrinkToken(
      new BigNumber(sameReserve.weiAmount)
        .div(opposingReserve.weiAmount)
        .toString(),
      opposingReserve.decimals
    );

    return {
      opposingAmount: shrinkToken(
        opposingValue,
        opposingReserve.decimals,
        true
      ),
      shareOfPool,
      smartTokenAmountWei: {
        id: smartTokenAddress,
        amount: smartTokenAmount
      },
      singleUnitCosts: [
        { id: sameReserve.contract, amount: sameReserveCost },
        { id: opposingReserve.contract, amount: opposingReserveCost }
      ],
      reserveBalancesAboveZero
    };
  }

  @action async removeLiquidityV2({
    converterAddress,
    poolToken,
    miniumReserveReturnWei = "1",
    onHash
  }: {
    converterAddress: string;
    poolToken: TokenWei;
    miniumReserveReturnWei: string;
    onHash?: (hash: string) => void;
  }) {
    const contract = buildV2Converter(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: contract.methods.removeLiquidity(
        poolToken.tokenContract,
        poolToken.weiAmount,
        miniumReserveReturnWei
      ),
      onHash
    });
  }

  @action async liquidate({
    converterAddress,
    smartTokenAmount
  }: {
    converterAddress: string;
    smartTokenAmount: string;
  }) {
    const converterContract = buildConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: converterContract.methods.liquidate(smartTokenAmount)
    });
  }

  @action async removeLiquidity({ reserves, id: relayId }: LiquidityParams) {
    const relay = await this.relayById(relayId);

    const preV11 = Number(relay.version) < 11;
    if (preV11)
      throw new Error("This Pool is not supported for adding liquidity");

    const postV28 = Number(relay.version) >= 28;

    const withdraw = reserves.find(reserve => reserve.amount)!;
    const converterAddress = relay.contract;

    let hash: string;
    if (postV28 && relay.converterType == PoolType.ChainLink) {
      const v2Relay = await this.chainLinkRelayById(relayId);
      const poolToken = findOrThrow(
        v2Relay.anchor.poolTokens,
        poolToken => compareString(poolToken.reserveId, withdraw.id),
        "failed to find pool token"
      );

      const poolTokenWeiAmount = expandToken(
        withdraw.amount,
        poolToken.poolToken.decimals
      );
      const weiPoolTokenBalance = (await this.getUserBalance({
        tokenContractAddress: poolToken.poolToken.contract,
        keepWei: true
      })) as string;

      const roundedWeiAmount = new BigNumber(poolTokenWeiAmount).gt(
        new BigNumber(weiPoolTokenBalance).times(0.995)
      )
        ? weiPoolTokenBalance
        : poolTokenWeiAmount;

      const expectedReserveReturn = await this.removeLiquidityReturn({
        converterAddress: relay.contract,
        poolTokenWei: roundedWeiAmount,
        poolTokenContract: poolToken.poolToken.contract
      });

      hash = await this.removeLiquidityV2({
        converterAddress,
        poolToken: {
          tokenContract: poolToken.poolToken.contract,
          weiAmount: roundedWeiAmount
        },
        miniumReserveReturnWei: await this.weiMinusSlippageTolerance(
          expectedReserveReturn.returnAmountWei
        )
      });
    } else if (postV28 && relay.converterType == PoolType.Traditional) {
      const traditionalRelay = await this.traditionalRelayById(relay.id);
      const { smartTokenAmountWei } = await this.calculateOpposingWithdrawInfo({
        id: relayId,
        reserves,
        changedReserveId: reserves[0].id
      });
      const userPoolBalance = await this.getUserBalancesTraditional({
        relayId,
        smartTokenDec: shrinkToken(
          smartTokenAmountWei.amount,
          traditionalRelay.anchor.decimals
        )
      });
      hash = await this.removeLiquidityV28({
        converterAddress,
        smartTokensWei: smartTokenAmountWei.amount,
        reserveTokens: relay.reserves.map(reserve => {
          const reserveBalances = userPoolBalance.maxWithdrawals;
          return {
            tokenAddress: reserve.contract,
            minimumReturnWei: expandToken(
              new BigNumber(
                reserveBalances.find(balance =>
                  compareString(balance.id, reserve.contract)
                )!.amount
              )
                .times(0.98)
                .toNumber(),
              reserve.decimals
            )
          };
        })
      });
    } else {
      const { smartTokenAmountWei } = await this.calculateOpposingWithdrawInfo({
        id: relayId,
        reserves,
        changedReserveId: reserves[0].id
      });
      hash = await this.liquidate({
        converterAddress,
        smartTokenAmount: smartTokenAmountWei.amount
      });
    }

    const anchorTokens = getAnchorTokenAddresses(relay);

    const tokenAddressesChanged = [
      ...relay.reserves.map(reserve => reserve.contract),
      ...anchorTokens
    ];
    this.spamBalances(tokenAddressesChanged);

    return {
      txId: hash,
      blockExplorerLink: await this.createExplorerLink(hash)
    };
  }

  @action async mintEthErc(ethDec: string) {
    return new Promise((resolve, reject) => {
      let txHash: string;
      web3.eth
        .sendTransaction({
          from: this.currentUser,
          to: ethErc20WrapperContract,
          value: toHex(toWei(ethDec))
        })
        .on("transactionHash", (hash: string) => {
          txHash = hash;
        })
        .on("confirmation", () => {
          resolve(txHash);
        })
        .on("error", (error: any) => reject(error));
    });
  }

  @action async fundRelay({
    converterAddress,
    fundAmount,
    onHash
  }: {
    converterAddress: string;
    fundAmount: string;
    onHash?: (hash: string) => void;
  }) {
    const converterContract = buildConverterContract(converterAddress);
    return this.resolveTxOnConfirmation({
      tx: converterContract.methods.fund(fundAmount),
      gas: 950000,
      ...(onHash && { onHash })
    });
  }

  @action async addLiquidityV28({
    converterAddress,
    reserves,
    minimumReturnWei,
    onHash
  }: {
    converterAddress: string;
    reserves: TokenWei[];
    minimumReturnWei: string;
    onHash?: (hash: string) => void;
  }) {
    const contract = buildV28ConverterContract(converterAddress);

    const newEthReserve = reserves.find(reserve =>
      compareString(reserve.tokenContract, ethReserveAddress)
    );

    return this.resolveTxOnConfirmation({
      tx: contract.methods.addLiquidity(
        reserves.map(reserve => reserve.tokenContract),
        reserves.map(reserve => reserve.weiAmount),
        minimumReturnWei
      ),
      onHash,
      ...(newEthReserve && { value: newEthReserve.weiAmount })
    });
  }

  @action async addLiquidityV2({
    converterAddress,
    reserve,
    poolTokenMinReturnWei = "1",
    onHash
  }: {
    converterAddress: string;
    reserve: TokenWei;
    poolTokenMinReturnWei?: string;
    onHash?: (hash: string) => void;
  }) {
    const contract = buildV2Converter(converterAddress);

    const newEthReserve = compareString(
      reserve.tokenContract,
      ethReserveAddress
    );

    return this.resolveTxOnConfirmation({
      tx: contract.methods.addLiquidity(
        reserve.tokenContract,
        reserve.weiAmount,
        poolTokenMinReturnWei
      ),
      onHash: onHash,
      ...(newEthReserve && { value: reserve.weiAmount })
    });
  }

  @action async removeLiquidityV28({
    converterAddress,
    smartTokensWei,
    reserveTokens
  }: {
    converterAddress: string;
    smartTokensWei: string;
    reserveTokens: { tokenAddress: string; minimumReturnWei: string }[];
  }) {
    const contract = buildV28ConverterContract(converterAddress);

    return this.resolveTxOnConfirmation({
      tx: contract.methods.removeLiquidity(
        smartTokensWei,
        reserveTokens.map(token => token.tokenAddress),
        reserveTokens.map(token => token.minimumReturnWei)
      )
    });
  }

  @action async weiMinusSlippageTolerance(wei: string): Promise<string> {
    const slippageTolerance = vxm.bancor.slippageTolerance;
    if (typeof slippageTolerance !== "number")
      throw new Error("Error finding slippage tolerance");
    const percent = new BigNumber(1).minus(slippageTolerance);
    const newWei = new BigNumber(wei).times(percent).toFixed(0);
    console.log(newWei, "is new wei");
    return newWei;
  }

  @action async addToken(
    tokenAddress: string
  ): Promise<{
    decimals: number;
    symbol: string;
    tokenAddress: string;
  }> {
    const isAddress = web3.utils.isAddress(tokenAddress);
    if (!isAddress) throw new Error(`${tokenAddress} is not a valid address`);

    const shape = tokenShape(tokenAddress);
    const [[token]] = (await this.multi({ groupsOfShapes: [[shape]] })) as [
      [{ symbol: string; decimals: string; contract: string }]
    ];

    const tokenAddressesMatch = compareString(token.contract, tokenAddress);
    if (!tokenAddressesMatch) throw new Error("RPC return was not expected");

    console.log(token, "was was return");
    if (!(token.symbol && token.decimals))
      throw new Error(
        "Failed parsing token information, please ensure this is an ERC-20 token"
      );

    const metadata = {
      decimals: Number(token.decimals),
      symbol: token.symbol,
      tokenAddress: token.contract
    };

    this.addTokenToMeta(metadata);

    return metadata;
  }

  @mutation addTokenToMeta(token: {
    decimals: number;
    symbol: string;
    tokenAddress: string;
  }) {
    const tokenMetaList = this.tokenMeta;

    const tokenAlreadyExists = this.tokenMeta.some(meta =>
      compareString(meta.contract, token.tokenAddress)
    );
    if (tokenAlreadyExists) return;

    const tokenMeta: TokenMeta = {
      contract: token.tokenAddress,
      id: token.tokenAddress,
      image: defaultImage,
      name: token.symbol,
      symbol: token.symbol,
      precision: token.decimals
    };

    this.tokenMeta = [...tokenMetaList, tokenMeta];
  }

  @action async addLiquidity({
    id: relayId,
    reserves,
    onUpdate
  }: LiquidityParams) {
    const relay = await this.relayById(relayId);

    const preV11 = Number(relay.version) < 11;
    if (preV11)
      throw new Error("This Pool is not supported for adding liquidity");

    const postV28 = Number(relay.version) >= 28;

    const matchedBalances = reserves
      .filter(reserve => reserve.amount)
      .map(reserve => {
        const relayReserve = findOrThrow(
          relay.reserves,
          relayReserve => compareString(relayReserve.contract, reserve.id),
          "failed to match passed reserves"
        );
        return {
          ...relayReserve,
          amount: reserve.amount
        };
      });

    const steps: Step[] = [
      {
        name: "CheckBalance",
        description: "Updating balance approvals..."
      },
      {
        name: "Funding",
        description: "Now funding..."
      },
      {
        name: "BlockConfirmation",
        description: "Awaiting block confirmation..."
      },
      {
        name: "Done",
        description: "Done!"
      }
    ];

    onUpdate!(0, steps);

    const converterAddress = relay.contract;

    await Promise.all(
      matchedBalances.map(async balance => {
        if (
          compareString(balance.contract, ethErc20WrapperContract) &&
          !postV28
        ) {
          await this.mintEthErc(balance.amount!);
        }
        if (compareString(balance.contract, ethReserveAddress)) return;
        return this.triggerApprovalIfRequired({
          owner: this.currentUser,
          amount: expandToken(balance.amount!, balance.decimals),
          spender: converterAddress,
          tokenAddress: balance.contract
        });
      })
    );

    onUpdate!(1, steps);

    let txHash: string;

    if (postV28 && relay.converterType == PoolType.Traditional) {
      console.log("treating as a traditional relay");
      const {
        smartTokenAmountWei,
        reserveBalancesAboveZero
      } = await this.calculateOpposingDepositInfo({
        id: relay.id,
        reserves,
        changedReserveId: reserves[0].id
      });

      const minimumReturnWei = reserveBalancesAboveZero
        ? await this.weiMinusSlippageTolerance(smartTokenAmountWei.amount)
        : "1";

      txHash = await this.addLiquidityV28({
        converterAddress,
        reserves: matchedBalances
          .filter(balance => new BigNumber(balance.amount).gt(0))
          .map(balance => ({
            tokenContract: balance.contract,
            weiAmount: expandToken(balance.amount, balance.decimals)
          })),
        minimumReturnWei,
        onHash: () => onUpdate!(2, steps)
      });
    } else if (postV28 && relay.converterType == PoolType.ChainLink) {
      console.log("treating as a chainlink v2 relay");
      const chainLinkRelay = await this.chainLinkRelayById(relay.id);
      const reserveToken = matchedBalances.map(balance => ({
        tokenContract: balance.contract,
        weiAmount: expandToken(balance.amount, balance.decimals)
      }))[0];
      const poolToken = chainLinkRelay.anchor.poolTokens.find(poolToken =>
        compareString(poolToken.reserveId, reserveToken.tokenContract)
      );
      if (!poolToken)
        throw new Error("Client side error - failed finding pool token");

      const [stakedReserveBalance, poolTokenSupply] = await Promise.all([
        this.fetchStakedReserveBalance({
          converterAddress: chainLinkRelay.contract,
          reserveTokenAddress: reserveToken.tokenContract
        }),
        getTokenSupplyWei(poolToken.poolToken.contract)
      ]);

      const expectedPoolTokenReturnWei = calculateExpectedPoolTokenReturnV2(
        poolTokenSupply,
        stakedReserveBalance,
        reserveToken.weiAmount
      );

      const poolTokenMinReturnWei = await this.weiMinusSlippageTolerance(
        expectedPoolTokenReturnWei
      );

      txHash = await this.addLiquidityV2({
        converterAddress,
        reserve: reserveToken,
        poolTokenMinReturnWei,
        onHash: () => onUpdate!(2, steps)
      });
    } else {
      console.log("treating as an old tradtional relay");
      const { smartTokenAmountWei } = await this.calculateOpposingDepositInfo({
        reserves,
        changedReserveId: reserves[0].id,
        id: relayId
      });

      const fundAmount = smartTokenAmountWei;

      txHash = await this.fundRelay({
        converterAddress,
        fundAmount: fundAmount.amount,
        onHash: () => onUpdate!(2, steps)
      });
    }

    onUpdate!(3, steps);

    const anchorTokens = getAnchorTokenAddresses(relay);

    const tokenAddressesChanged = [
      ...matchedBalances.map(x => x.contract),
      ...anchorTokens
    ];
    this.spamBalances(tokenAddressesChanged);
    return {
      txId: txHash,
      blockExplorerLink: await this.createExplorerLink(txHash)
    };
  }

  @action async spamBalances(tokenAddresses: string[]) {
    for (let i = 0; i < 5; i++) {
      await this.fetchAndSetTokenBalances(tokenAddresses);
      await wait(1500);
    }
  }

  @action async fetchContractAddresses(contractRegistry: string) {
    console.log("fetchWasCalled");
    if (!contractRegistry || !web3.utils.isAddress(contractRegistry))
      throw new Error("Must pass valid address");

    const hardCodedBytes: RegisteredContracts = {
      BancorNetwork: asciiToHex("BancorNetwork"),
      BancorConverterRegistry: asciiToHex("BancorConverterRegistry"),
      LiquidityProtectionStore: asciiToHex("LiquidityProtectionStore"),
      LiquidityProtection: asciiToHex("LiquidityProtection")
    };

    const registryContract = new w3.eth.Contract(
      ABIContractRegistry,
      contractRegistry
    );

    const arr = toPairs(hardCodedBytes) as [string, string][];

    try {
      const contractAddresses = await Promise.all(
        arr.map(
          async ([label, ascii]) =>
            [label, await registryContract.methods.addressOf(ascii).call()] as [
              string,
              string
            ]
        )
      );

      const object = (fromPairs(
        contractAddresses
      ) as unknown) as RegisteredContracts;
      this.setContractAddresses(object);
      return object;
    } catch (e) {
      console.error(
        `Failed fetching ETH contract addresses ${e.message} Contract Registry: ${contractRegistry}`
      );
      throw new Error(e.message);
    }
  }

  @mutation setContractAddresses(contracts: RegisteredContracts) {
    this.contracts = {
      ...this.contracts,
      ...contracts
    };
  }

  @action async warmEthApi() {
    const tokens = await ethBancorApi.getTokens();
    console.log(tokens, "are the tokens");
    this.setBancorApiTokens(tokens);
    return tokens;
  }

  @action async addPossiblePropsFromBancorApi(
    reserveFeeds: ReserveFeed[]
  ): Promise<ReserveFeed[]> {
    try {
      const tokens = this.bancorApiTokens;
      if (!tokens || tokens.length == 0) {
        return reserveFeeds;
        // throw new Error("There are no cached Bancor API tokens.");
      }
      const ethUsdPrice = findOrThrow(
        tokens,
        token => token.code == "ETH",
        "failed finding price of ETH from tokens request"
      ).price;
      console.log(ethUsdPrice, "is the eth USD price");

      const [bancorCovered, notCovered] = partition(reserveFeeds, feed => {
        const inDictionary = ethBancorApiDictionary.find(
          matchReserveFeed(feed)
        );
        if (!inDictionary) return false;
        return tokens.some(token => token.id == inDictionary.tokenId);
      });

      const newBancorCovered = bancorCovered.map(reserveFeed => {
        const dictionary = findOrThrow(
          ethBancorApiDictionary,
          matchReserveFeed(reserveFeed)
        );
        const tokenPrice = findOrThrow(
          tokens,
          token => token.id == dictionary.tokenId
        );

        return {
          ...reserveFeed,
          change24H: tokenPrice.change24h,
          volume24H: tokenPrice.volume24h.USD,
          costByNetworkUsd: reserveFeed.costByNetworkUsd || tokenPrice.price
        };
      });

      return [...newBancorCovered, ...notCovered];
    } catch (e) {
      console.warn(`Failed utilising Bancor API: ${e.message}`);
      return reserveFeeds;
    }
  }

  @action async updateRelayFeeds(suggestedFeeds: ReserveFeed[]) {
    const feeds = suggestedFeeds;

    const potentialRelaysToMutate = this.relaysList.filter(relay =>
      feeds.some(feed => compareString(feed.poolId, relay.id))
    );
    const relaysToMutate = potentialRelaysToMutate.filter(relay =>
      relay.reserves.some(reserve => {
        const feed = feeds.find(feed =>
          compareString(reserve.contract, feed.reserveAddress)
        );
        if (feed && !reserve.reserveFeed) return true;
        if (!feed) return false;
        const existingFeed = reserve.reserveFeed!;
        if (existingFeed) return feed.priority < existingFeed.priority;
      })
    );

    if (relaysToMutate.length > 0) {
      const updatedRelays = relaysToMutate.map(relay => ({
        ...relay,
        reserves: relay.reserves.map(reserve => {
          const feed = feeds.find(
            feed =>
              compareString(feed.reserveAddress, reserve.contract) &&
              compareString(feed.poolId, relay.id)
          );
          return {
            ...reserve,
            reserveFeed: feed
          };
        })
      }));

      this.updateRelays(updatedRelays);
    }
  }

  @action async fetchUsdPriceOfBnt() {
    const price = await vxm.bancor.fetchUsdPriceOfBnt();
    this.setBntUsdPrice(price);
    return price;
  }

  @mutation setBntUsdPrice(usdPrice: number) {
    this.bntUsdPrice = usdPrice;
  }

  @action async fetchStakedReserveBalance({
    converterAddress,
    reserveTokenAddress
  }: {
    converterAddress: string;
    reserveTokenAddress: string;
  }): Promise<string> {
    const contract = buildV2Converter(converterAddress, w3);
    return contract.methods.reserveStakedBalance(reserveTokenAddress).call();
  }

  @action async fetchV2ConverterReserveWeights(converterAddress: string) {
    const contract = buildV2Converter(converterAddress, w3);
    const weights = await contract.methods.effectiveReserveWeights().call();
    return [weights["0"], weights["1"]];
  }

  get loadingTokens() {
    return this.loadingPools;
  }

  get moreTokensAvailable() {
    return this.morePoolsAvailable;
  }

  @action async relaysContainingToken(tokenId: string): Promise<string[]> {
    return getConvertibleTokenAnchors({
      converterRegistryAddress: this.contracts.BancorConverterRegistry,
      tokenAddress: tokenId,
      web3: w3
    });
  }

  @action async loadMoreTokens(tokenIds?: string[]) {
    if (tokenIds && tokenIds.length > 0) {
      const anchorAddresses = await Promise.all(
        tokenIds.map(id => this.relaysContainingToken(id))
      );
      const anchorAddressesNotLoaded = anchorAddresses
        .flat(1)
        .filter(
          anchorAddress =>
            !this.relaysList.some(relay =>
              compareString(relay.id, anchorAddress)
            )
        );
      const convertersAndAnchors = await this.add(anchorAddressesNotLoaded);
      await this.addPoolsV2(convertersAndAnchors);
    } else {
      await this.loadMorePools();
    }
  }

  @mutation setAvailableHistories(smartTokenNames: string[]) {
    this.availableHistories = smartTokenNames;
  }

  @action async refresh() {
    console.log("refresh called on eth bancor, doing nothing");
  }

  @mutation setRegisteredAnchorAddresses(addresses: string[]) {
    this.registeredAnchorAddresses = addresses;
  }

  @mutation setConvertibleTokenAddresses(addresses: string[]) {
    this.convertibleTokenAddresses = addresses;
  }

  @action async conversionPathFromNetworkContract({
    from,
    to,
    networkContractAddress
  }: {
    from: string;
    to: string;
    networkContractAddress: string;
  }) {
    return conversionPath({
      networkContractAddress,
      from,
      to,
      web3: w3
    });
  }

  @action async relaysRequiredForTrade({
    from,
    to,
    networkContractAddress
  }: {
    from: string;
    to: string;
    networkContractAddress: string;
  }) {
    try {
      const path = await this.conversionPathFromNetworkContract({
        from,
        to,
        networkContractAddress
      });
      const smartTokenAddresses = path.filter((_, index) => isOdd(index));
      if (smartTokenAddresses.length == 0)
        throw new Error("Failed to find any smart token addresses for path.");
      return smartTokenAddresses;
    } catch (e) {
      console.error(`relays required for trade failed ${e.message}`);
      throw new Error(`relays required for trade failed ${e.message}`);
    }
  }

  @action async poolsByPriority({
    anchorAddressess,
    tokenPrices
  }: {
    anchorAddressess: string[];
    tokenPrices?: TokenPrice[];
  }) {
    if (tokenPrices && tokenPrices.length > 0) {
      return sortSmartTokenAddressesByHighestLiquidity(
        tokenPrices,
        anchorAddressess
      );
    } else {
      return sortAlongSide(anchorAddressess, x => x, priorityEthPools);
    }
  }

  @action async bareMinimumPools({
    params,
    networkContractAddress,
    anchorAddressess,
    tokenPrices
  }: {
    params?: ModuleParam;
    networkContractAddress: string;
    anchorAddressess: string[];
    tokenPrices?: TokenPrice[];
  }): Promise<string[]> {
    const fromToken =
      params! && params!.tradeQuery! && params!.tradeQuery!.base!;
    const toToken =
      params! && params!.tradeQuery! && params!.tradeQuery!.quote!;

    const tradeIncluded = fromToken && toToken;
    const poolIncluded = params && params.poolQuery;

    if (tradeIncluded) {
      const res = await this.relaysRequiredForTrade({
        from: fromToken,
        to: toToken,
        networkContractAddress
      });
      return res;
    } else if (poolIncluded) {
      return [poolIncluded];
    } else {
      const allPools = await this.poolsByPriority({
        anchorAddressess,
        tokenPrices
      });
      return allPools.slice(0, 3);
    }
  }

  @action async multi({
    groupsOfShapes,
    blockHeight,
    traditional = false
  }: {
    groupsOfShapes: ShapeWithLabel[][];
    blockHeight?: number;
    traditional?: boolean;
  }) {
    const networkVars = getNetworkVariables(this.currentNetwork);
    const multi = new MultiCall(w3, networkVars.multiCall, [
      500,
      100,
      50,
      10,
      1
    ]);

    console.log(groupsOfShapes, "shapes asked for");
    const res = await multi.all(groupsOfShapes, {
      traditional,
      blockHeight
    });
    return res;
  }

  @action async refreshReserveBalances() {
    const v1Relays = this.relaysList.filter(
      relay => relay.converterType == PoolType.Traditional
    ) as TraditionalRelay[];
    const v2Relays = this.relaysList.filter(
      relay => relay.converterType == PoolType.ChainLink
    ) as ChainLinkRelay[];

    const v1RelayShapes = v1Relays.map(relay =>
      reserveBalanceShape(
        relay.contract,
        relay.reserves.map(r => r.contract)
      )
    );
    const v2RelayPoolBalanceShapes = v2Relays.map(relay =>
      v2PoolBalanceShape(
        relay.contract,
        relay.reserves[0].contract,
        relay.reserves[1].contract,
        this.currentNetwork
      )
    );

    await this.multi({
      groupsOfShapes: [v1RelayShapes, v2RelayPoolBalanceShapes]
    });
  }

  @action async addPoolsV2(
    convertersAndAnchors: ConverterAndAnchor[]
  ): Promise<V2Response> {
    const smallLoad = convertersAndAnchors.length < 5;

    const timeStart = Date.now();
    console.log(
      "started at",
      parseInt(String(timeStart / 1000)),
      "for",
      convertersAndAnchors.length,
      timeStart
    );

    const allAnchors = convertersAndAnchors.map(item => item.anchorAddress);
    const allConverters = convertersAndAnchors.map(
      item => item.converterAddress
    );

    const groupsOfShapes = [
      allConverters.map(relayShape),
      allAnchors.map(poolTokenShape)
    ];

    const [rawRelays, poolAndSmartTokens] = ((await this.multi({
      groupsOfShapes,
      traditional: smallLoad
    })) as [unknown, unknown]) as [AbiRelay[], AbiCentralPoolToken[]];

    const { poolTokenAddresses, smartTokens } = seperateMiniTokens(
      poolAndSmartTokens
    );

    const polished: RefinedAbiRelay[] = await Promise.all(
      rawRelays
        .filter(x => Number(x.connectorTokenCount) == 2)
        .map(
          async half =>
            <RefinedAbiRelay>{
              ...half,
              anchorAddress: findOrThrow(
                convertersAndAnchors,
                item =>
                  compareString(item.converterAddress, half.converterAddress),
                "failed to find anchor address"
              ).anchorAddress,
              reserves: [half.connectorToken1, half.connectorToken2] as [
                string,
                string
              ],
              version: Number(half.version),
              converterType: determineConverterType(half.converterType)
            }
        )
    );

    const overWroteVersions = updateArray(
      polished,
      relay =>
        knownVersions.some(r =>
          compareString(r.converterAddress, relay.converterAddress)
        ),
      relay => ({
        ...relay,
        version: knownVersions.find(r =>
          compareString(r.converterAddress, relay.converterAddress)
        )!.version
      })
    );

    const passedFirstHalfs = overWroteVersions
      .filter(hasTwoConnectors)
      .filter(half =>
        poolTokenAddresses.some(poolTokenAddress =>
          compareString(poolTokenAddress.anchorAddress, half.anchorAddress)
        )
          ? poolTokenAddresses.find(poolTokenAddress =>
              compareString(poolTokenAddress.anchorAddress, half.anchorAddress)
            )!.poolTokenAddresses.length == 2
          : true
      );

    const verifiedV1Pools = passedFirstHalfs.filter(
      half => half.converterType == PoolType.Traditional
    );

    const verifiedV2Pools = passedFirstHalfs.filter(
      half => half.converterType == PoolType.ChainLink
    );

    console.log({ verifiedV1Pools, verifiedV2Pools });

    const reserveTokens = uniqWith(
      passedFirstHalfs.flatMap(half => half.reserves),
      compareString
    );

    console.time("secondWaterfall");

    const tokenInMeta = (tokenMeta: TokenMeta[]) => (address: string) =>
      tokenMeta.find(
        meta => compareString(address, meta.contract) && meta.precision
      );

    const allTokensRequired = [
      ...reserveTokens,
      ...poolTokenAddresses.flatMap(pool => pool.poolTokenAddresses)
    ].filter(tokenAddress => !compareString(tokenAddress, ethReserveAddress));

    const tokenAddressesKnown = allTokensRequired.filter(
      tokenInMeta(this.tokenMeta)
    );
    const tokensKnown = tokenAddressesKnown.map(address => {
      const meta = tokenInMeta(this.tokenMeta)(address)!;
      return metaToTokenAssumedPrecision(meta);
    });
    const tokenAddressesMissing = differenceWith(
      allTokensRequired,
      tokenAddressesKnown,
      compareString
    );

    const [
      reserveAndPoolTokensAbi,
      v1ReserveBalances,
      v2PoolReserveBalances
    ] = ((await this.multi({
      groupsOfShapes: [
        tokenAddressesMissing.map(tokenShape),
        verifiedV1Pools.map(v1Pool =>
          reserveBalanceShape(v1Pool.converterAddress, v1Pool.reserves)
        ),
        verifiedV2Pools.map(pool =>
          v2PoolBalanceShape(
            pool.converterAddress,
            pool.reserves[0],
            pool.reserves[1],
            this.currentNetwork
          )
        )
      ],
      traditional: smallLoad
    })) as [unknown, unknown, unknown]) as [
      RawAbiToken[],
      RawAbiReserveBalance[],
      RawAbiV2PoolBalances[]
    ];

    const stakedAndReserveWeights = v2PoolReserveBalances.map(
      rawAbiV2ToStacked
    );

    const reserveAndPoolTokens = reserveAndPoolTokensAbi.map(
      (token): Token => ({
        contract: token.contract,
        decimals: Number(token.decimals),
        network: "ETH",
        symbol: token.symbol
      })
    );

    const allTokens = [...reserveAndPoolTokens, ...tokensKnown];

    const polishedReserveAndPoolTokens = polishTokens(
      this.tokenMeta,
      allTokens
    );

    const matched = stakedAndReserveWeights.map(relay => ({
      ...relay,
      anchorAddress: findOrThrow(
        convertersAndAnchors,
        item => compareString(item.converterAddress, relay.converterAddress),
        "failed to match anchor address"
      ).anchorAddress,
      reserves: relay.reserves.map(reserve => ({
        ...reserve,
        token: polishedReserveAndPoolTokens.find(token =>
          compareString(token.contract, reserve.reserveAddress)
        )
      }))
    }));

    const confirmedTokenMatch = matched.filter(match =>
      match.reserves.every(reserve => reserve.token)
    ) as RawV2Pool[];

    const v2RelayFeeds = buildRelayFeedChainkLink({
      relays: confirmedTokenMatch,
      usdPriceOfBnt: this.bntUsdPrice
    });

    console.timeEnd("secondWaterfall");

    const v2Pools = verifiedV2Pools.map(
      (pool): ChainLinkRelay => {
        const rawPool = findOrThrow(
          confirmedTokenMatch,
          match => compareString(match.converterAddress, pool.converterAddress),
          `failed to find raw pool ${pool.converterAddress}`
        );

        return {
          anchor: {
            poolContainerAddress: rawPool.anchorAddress,
            poolTokens: rawPool.reserves.map(reserve => ({
              reserveId: reserve.reserveAddress,
              poolToken: findOrThrow(
                polishedReserveAndPoolTokens,
                token =>
                  compareString(token.contract, reserve.poolTokenAddress),
                `failed to find the pool token for ${reserve.poolTokenAddress}`
              )
            }))
          },
          contract: pool.converterAddress,
          id: rawPool.anchorAddress,
          converterType: PoolType.ChainLink,
          isMultiContract: false,
          network: "ETH",
          reserves: rawPool.reserves.map(reserve => ({
            ...reserve.token,
            reserveWeight:
              typeof reserve.reserveWeight !== "undefined"
                ? Number(reserve.reserveWeight) / oneMillion.toNumber()
                : undefined
          })),
          version: String(pool.version),
          fee: ppmToDec(pool.conversionFee)
        };
      }
    );

    const v1Pools = verifiedV1Pools.map(pool => {
      const smartTokenAddress = pool.anchorAddress;
      const converterAddress = convertersAndAnchors.find(item =>
        compareString(item.anchorAddress, smartTokenAddress)
      )!.converterAddress;
      const polishedHalf = overWroteVersions.find(pol =>
        compareString(pol.converterAddress, converterAddress)
      )!;
      const smartToken = smartTokens.find(token =>
        compareString(token.contract, smartTokenAddress)
      )!;
      const anchorProps = smartTokenAnchor({
        ...smartToken,
        network: "ETH",
        decimals: Number(smartToken.decimals)
      });
      const reserveBalances = v1ReserveBalances.find(reserve =>
        compareString(reserve.converterAddress, converterAddress)
      )!;
      if (!reserveBalances) {
        console.log(
          pool.anchorAddress,
          "was dropped because it has no reserve balances"
        );
        return;
      }
      const zippedReserveBalances = [
        {
          contract: polishedHalf.connectorToken1,
          amount: reserveBalances.reserveOne
        },
        {
          contract: polishedHalf.connectorToken2,
          amount: reserveBalances.reserveTwo
        }
      ];
      const reserveTokens = zippedReserveBalances.map(
        reserve =>
          polishedReserveAndPoolTokens.find(token =>
            compareString(token.contract, reserve.contract)
          )!
      );

      const relay: RelayWithReserveBalances = {
        id: smartTokenAddress,
        reserves: reserveTokens.map(x => ({
          ...x,
          reserveWeight: 0.5,
          decimals: Number(x.decimals)
        })),
        reserveBalances: zippedReserveBalances.map(zip => ({
          amount: zip.amount,
          id: zip.contract
        })),
        contract: converterAddress,
        fee: ppmToDec(polishedHalf.conversionFee),
        isMultiContract: false,
        network: "ETH",
        version: String(polishedHalf.version),
        anchor: anchorProps.anchor,
        converterType: anchorProps.converterType
      };

      return relay;
    });

    const completeV1Pools = (v1Pools.filter(
      Boolean
    ) as RelayWithReserveBalances[]).filter(x => x.reserves.every(Boolean));

    const bntTokenAddress = getNetworkVariables(this.currentNetwork).bntToken;

    const knownPrices = [
      { id: bntTokenAddress, usdPrice: String(this.bntUsdPrice) },
      ...trustedStables(this.currentNetwork)
    ];

    const traditionalRelayFeeds = buildPossibleReserveFeedsTraditional(
      completeV1Pools,
      knownPrices
    );

    const reserveFeeds = [...traditionalRelayFeeds, ...v2RelayFeeds];
    const pools = [...v2Pools, ...completeV1Pools];

    // debug
    const failed = differenceWith(convertersAndAnchors, pools, (a, b) =>
      compareString(a.converterAddress, b.contract)
    );
    if (failed.length > 0) {
      console.warn(failed, "FAILS");
    }

    // end debug

    const timeEnd = Date.now();
    const timeTaken = timeEnd - timeStart;
    console.log(
      timeTaken,
      `was time to load ${convertersAndAnchors.length} finishing with ${
        pools.length
      } in mode ${smallLoad ? "small" : "normal"}`
    );

    return {
      reserveFeeds,
      pools
    };
  }

  @mutation deletePools(ids: string[]) {
    this.relaysList = this.relaysList.filter(
      relay => !ids.some(id => compareString(relay.id, id))
    );
  }

  @action async reloadPools(anchorAndConverters: ConverterAndAnchor[]) {
    this.deletePools(anchorAndConverters.map(x => x.anchorAddress));
    this.addPoolsBulk(anchorAndConverters);
  }

  @action async add(anchorAddresses: string[]) {
    const converters = await this.fetchConverterAddressesByAnchorAddresses(
      anchorAddresses
    );
    return zipAnchorAndConverters(anchorAddresses, converters);
  }

  @action async pullConverterEvents({
    converterAddress,
    network,
    fromBlock
  }: {
    converterAddress: string;
    network: EthNetworks;
    fromBlock: number;
  }) {
    const res = await getConverterLogs(network, converterAddress, fromBlock);
    console.log(res, "was res");

    const uniqueAddHashes = uniqWith(
      res.addLiquidity.map(event => event.txHash),
      compareString
    );
    const uniqueRemoveHashes = uniqWith(
      res.removeLiquidity.map(event => event.txHash),
      compareString
    );

    const groupedAddLiquidityEvents = uniqueAddHashes.map(hash =>
      res.addLiquidity.filter(event => compareString(event.txHash, hash))
    );

    const groupedRemoveLiquidityEvents = uniqueRemoveHashes.map(hash =>
      res.removeLiquidity.filter(event => compareString(event.txHash, hash))
    );

    const tokens = this.tokens;

    const blockNow = await blockNumberHoursAgo(0, w3);
    const timeNow = moment().unix();

    const removeEvents = groupedRemoveLiquidityEvents
      .filter(events => {
        const res = events.every(event =>
          tokenAddressesInEvent(event).every(address =>
            tokens.some(token => compareString(token.id, address))
          )
        );
        return res;
      })
      .map(events =>
        events.map(event =>
          decodedToTimedDecoded(event, blockNow.currentBlock, timeNow)
        )
      )
      .map(events =>
        removeLiquidityEventToView(
          events,
          tokens,
          hash =>
            generateEtherscanTxLink(
              hash,
              this.currentNetwork == EthNetworks.Ropsten
            ),
          account => generateEtherscanAccountLink(account)
        )
      );

    const addEvents = groupedAddLiquidityEvents
      .filter(events =>
        events.every(event =>
          tokenAddressesInEvent(event).every(address =>
            tokens.some(token => compareString(token.id, address))
          )
        )
      )
      .map(events =>
        events.map(event =>
          decodedToTimedDecoded(event, blockNow.currentBlock, timeNow)
        )
      )
      .map(events =>
        addLiquidityEventToView(
          events,
          tokens,
          hash =>
            generateEtherscanTxLink(
              hash,
              this.currentNetwork == EthNetworks.Ropsten
            ),
          account => generateEtherscanAccountLink(account)
        )
      );

    const conversionEvents = res.conversions
      .filter(event => {
        const res = tokenAddressesInEvent(event).every(address =>
          tokens.some(token => compareString(token.id, address))
        );
        return res;
      })
      .map(event =>
        decodedToTimedDecoded(event, blockNow.currentBlock, timeNow)
      )
      .map(conversion =>
        conversionEventToViewTradeEvent(
          conversion,
          tokens,
          hash =>
            generateEtherscanTxLink(
              hash,
              this.currentNetwork == EthNetworks.Ropsten
            ),
          account => generateEtherscanAccountLink(account)
        )
      );

    return {
      addEvents,
      removeEvents,
      conversionEvents
    };
  }

  @action async pullEvents({
    networkContract,
    network,
    fromBlock
  }: {
    networkContract: string;
    network: EthNetworks;
    fromBlock: number;
  }) {
    const res = await getLogs(network, networkContract, fromBlock);

    const uniqTxHashes = uniqWith(
      res.map(x => x.txHash),
      compareString
    );

    const groups = uniqTxHashes.map(hash =>
      res.filter(x => compareString(x.txHash, hash))
    );

    const joinStartingAndTerminating = groups.map(
      (trades): DecodedEvent<ConversionEventDecoded> => {
        const firstTrade = trades[0];
        const lastTrade = trades[trades.length - 1];
        const { txHash: firstHash, blockNumber: firstBlockNumber } = firstTrade;
        const haveSameBlockNumber = trades.every(
          trade => trade.blockNumber == firstBlockNumber
        );
        const haveSameTxHash = trades.every(trade => trade.txHash == firstHash);
        if (!(haveSameBlockNumber && haveSameTxHash))
          throw new Error("Trades do not share the same block number and hash");

        return {
          ...firstTrade,
          data: {
            ...firstTrade.data,
            to: lastTrade.data.to
          }
        };
      }
    );
    return {
      joinedTradeEvents: joinStartingAndTerminating,
      singleTraades: res
    };
  }

  liquidityHistoryArr: DecodedTimedEvent<ConversionEventDecoded>[] = [];
  singleTradeHistoryArr: DecodedEvent<ConversionEventDecoded>[] = [];
  previousPoolFeesArr: PreviousPoolFee[] = [];

  @mutation setLiquidityHistory({
    joinedTradeEvents,
    singleTrades
  }: {
    joinedTradeEvents: DecodedTimedEvent<ConversionEventDecoded>[];
    singleTrades: DecodedEvent<ConversionEventDecoded>[];
  }) {
    console.log(singleTrades, "are single trades");
    this.singleTradeHistoryArr = singleTrades;
    this.liquidityHistoryArr = joinedTradeEvents
      .slice()
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
  }

  get previousPoolFees() {
    return [...this.previousPoolFeesArr, ...previousPoolFees];
  }

  get previousRelayBalances() {
    const { singleTradeHistoryArr, previousPoolFees } = this;

    const anchorsRecentlyTradedAgainst = uniqWith(
      this.singleTradeHistoryArr
        .map(trade => trade.data.poolToken)
        .filter(Boolean) as string[],
      compareString
    );

    const relays = this.relaysList.filter(relay =>
      anchorsRecentlyTradedAgainst.some(anchor =>
        compareString(anchor, relay.id)
      )
    );

    const tradesCollected = relays.map(relay => {
      const trades = singleTradeHistoryArr.filter(trade =>
        compareString(trade.data.poolToken!, relay.id)
      );
      const currentFee = relay.fee;
      const accumulatedFees = trades.reduce(
        (acc, item) => {
          const currentTally = acc.find(balance =>
            compareString(balance.id, item.data.to.address)
          );
          if (!currentTally) {
            console.error("Failing to find to address between trade pairs");
            return acc;
          }
          const exitingAmount = new BigNumber(item.data.to.weiAmount);

          const decFee =
            findPreviousPoolFee(
              previousPoolFees,
              Number(item.blockNumber),
              relay.id
            ) || currentFee;

          const feeLessMag = 1 - decFee;
          const feeLessAmount = exitingAmount.times(feeLessMag);
          const feePaid = exitingAmount.minus(feeLessAmount);

          const newTotalAmount = new BigNumber(
            currentTally.collectedFees.plus(feePaid).toFixed(0)
          );
          const newTotalVolume = new BigNumber(exitingAmount).plus(
            currentTally.totalVolume
          );
          return updateArray(
            acc,
            reserve => compareString(reserve.id, currentTally.id),
            reserve => ({
              ...reserve,
              collectedFees: newTotalAmount,
              totalVolume: newTotalVolume
            })
          );
        },
        relay.reserves.map(reserve => ({
          id: reserve.contract,
          collectedFees: new BigNumber(0),
          totalVolume: new BigNumber(0)
        }))
      );

      return {
        relay,
        accumulatedFees: accumulatedFees.map(fee => ({
          ...fee,
          collectedFees: fee.collectedFees.toString(),
          totalVolume: fee.totalVolume.toString()
        }))
      };
    });

    const uniqueTokens = tradesCollected.flatMap(trade =>
      trade.accumulatedFees.map(x => x.id)
    );
    const allTokens = this.tokens;
    const tokens = uniqueTokens.map(
      id => allTokens.find(t => compareString(t.id, id))!
    );

    const withUsdValues = tradesCollected.map(trade => ({
      ...trade,
      accumulatedFees: trade.accumulatedFees.map(fee => {
        const viewToken = tokens.find(x => compareString(x.id, fee.id))!;
        const decAmountFees = shrinkToken(
          fee.collectedFees,
          viewToken.precision
        );
        const decAmountVolume = shrinkToken(
          fee.totalVolume,
          viewToken.precision
        );
        const usdFees = new BigNumber(decAmountFees)
          .times(viewToken.price!)
          .toString();

        const usdVolume = new BigNumber(decAmountVolume)
          .times(viewToken.price!)
          .toString();

        return {
          ...fee,
          usdFees,
          usdVolume
        };
      })
    }));

    const accumulatedFee = withUsdValues.map(trade => {
      const totalFees = trade.accumulatedFees.reduce(
        (acc, item) => new BigNumber(acc).plus(item.usdFees).toString(),
        "0"
      );

      const totalVolume = trade.accumulatedFees.reduce(
        (acc, item) => new BigNumber(acc).plus(item.usdVolume).toString(),
        "0"
      );

      return {
        ...trade,
        totalFees,
        totalVolume
      };
    });
    return accumulatedFee;
  }

  get liquidityHistory() {
    const liquidityEvents = this.liquidityHistoryArr;
    const knownTokens = this.tokens;
    if (liquidityEvents.length == 0 || knownTokens.length == 0) {
      return {
        loading: true,
        data: []
      };
    }

    const conversionsSupported = liquidityEvents.filter(event =>
      tokenAddressesInEvent(event).every(tokenAddress =>
        knownTokens.some(t => compareString(tokenAddress, t.id))
      )
    );

    return {
      loading: false,
      data: conversionsSupported.map(conversion =>
        conversionEventToViewTradeEvent(
          conversion,
          knownTokens,
          hash =>
            generateEtherscanTxLink(
              hash,
              this.currentNetwork == EthNetworks.Ropsten
            ),
          account => generateEtherscanAccountLink(account)
        )
      )
    };
  }

  get availableBalances(): ViewLockedBalance[] {
    const now = moment();
    const bntPrice = this.bntUsdPrice;
    const balances = this.lockedBalancesArr.filter(lockedBalance =>
      moment.unix(lockedBalance.expirationTime).isSameOrBefore(now)
    );
    if (balances.length == 0) return [];

    if (balances.length == 1) {
      const balance = balances[0];
      const decBnt = shrinkToken(balance.amountWei, 18);
      const usdValue = new BigNumber(decBnt).times(bntPrice).toNumber();
      return [
        {
          id: String(balance.expirationTime),
          amount: decBnt,
          lockedUntil: balance.expirationTime,
          usdValue
        }
      ];
    }
    return [
      balances
        .map(
          (balance): ViewLockedBalance => {
            const decBnt = shrinkToken(balance.amountWei, 18);
            const usdValue = new BigNumber(decBnt).times(bntPrice).toNumber();
            return {
              id: String(balance.expirationTime),
              amount: decBnt,
              lockedUntil: balance.expirationTime,
              usdValue
            };
          }
        )
        .reduce((acc, item) => ({
          ...item,
          amount: new BigNumber(acc.amount).plus(item.amount).toString()
        }))
    ];
  }

  get lockedBalances(): ViewLockedBalance[] {
    const now = moment();
    const bntPrice = this.bntUsdPrice;
    const balances = this.lockedBalancesArr.filter(lockedBalance =>
      moment.unix(lockedBalance.expirationTime).isAfter(now)
    );
    return balances.map(
      (balance): ViewLockedBalance => {
        const decBnt = shrinkToken(balance.amountWei, 18);
        const usdValue = new BigNumber(decBnt).times(bntPrice).toNumber();
        return {
          id: String(balance.expirationTime),
          amount: decBnt,
          lockedUntil: balance.expirationTime,
          usdValue: usdValue
        };
      }
    );
  }

  @action async fetchDynamicRelays(
    staticRelays: StaticRelay[]
  ): Promise<NewRelay[]> {
    const tokenMeta: TokenMeta[] = [
      ...this.tokenMeta,
      {
        contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        id: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        precision: 18,
        name: "Ether",
        symbol: "ETH",
        image:
          "https://storage.googleapis.com/bancor-prod-file-store/images/communities/aea83e97-13a3-4fe7-b682-b2a82299cdf2.png"
      }
    ];
    const reserveTokens = uniqWith(
      staticRelays.flatMap(relay => relay.reserves),
      compareString
    );
    console.log(reserveTokens, "are reserve tokens");
    const tokensMissing = reserveTokens.filter(
      token =>
        !tokenMeta.some(
          meta =>
            compareString(meta.contract, token) &&
            typeof meta.precision !== "undefined"
        ) || q.some(x => compareString(x.contract, token))
    );

    const cached = differenceWith(reserveTokens, tokensMissing, compareString);

    console.warn(tokensMissing, "was the missing tokens...", tokenMeta.length);

    const tokensShape = tokensMissing.map(tokenShape);
    const relaysShape = staticRelays.map(relay =>
      dynamicRelayShape(relay.converterAddress, relay.reserves)
    );

    const [rawTokens, rawRelays] = ((await this.multi({
      groupsOfShapes: [tokensShape, relaysShape]
    })) as unknown) as [RawAbiToken[], RawABIDynamicRelay[]];

    const dynamicRelays = staticRelays.map(relay => {
      try {
        const hydrated = rawRelays.find(r =>
          compareString(relay.converterAddress, r.converterAddress)
        )!;

        const reserveContracts = [
          [hydrated.reserveOneAddress, hydrated.reserveOne],
          [hydrated.reserveTwoAddress, hydrated.reserveTwo]
        ];
        const reserves = reserveContracts.map(
          ([reserveContract, reserveBalance]) => {
            const rawToken = rawTokens.find(t =>
              compareString(reserveContract, t.contract)
            );
            const qToken = q.find(x =>
              compareString(x.contract, reserveContract)
            );
            if (rawToken) {
              return {
                ...rawToken,
                reserveBalance
              } as NewReserve;
            } else if (qToken) {
              return {
                ...qToken,
                reserveBalance
              };
            } else {
              const meta = findOrThrow(
                tokenMeta,
                meta => compareString(reserveContract, meta.contract),
                "failed to find token in meta or raw token"
              );

              return {
                reserveBalance,
                contract: meta.contract,
                decimals: String(meta.precision),
                symbol: meta.symbol
              } as NewReserve;
            }
          }
        );
        const fee = ppmToDec(hydrated.conversionFee);
        return {
          ...relay,
          reserves,
          fee
        };
      } catch (e) {
        console.log("something went wrong here", e);
        throw new Error();
      }
    });
    return dynamicRelays;
  }

  bntSupply: string = "";

  @mutation setBntSupply(weiAmount: string) {
    this.bntSupply = weiAmount;
  }

  @action async fetchAndSetBntSupply(bntTokenAddress: string) {
    const contract = buildTokenContract(bntTokenAddress);
    const weiSupply = await contract.methods.totalSupply().call();
    this.setBntSupply(weiSupply);
  }

  @action async init(params?: ModuleParam) {
    if (this.initiated) {
      return this.refresh();
    }

    BigNumber.config({ EXPONENTIAL_AT: 256 });

    const networkVersion$ = from(web3.eth.getChainId()).pipe(
      startWith(EthNetworks.Mainnet),
      distinctUntilChanged(),
      tap(this.setNetwork),
      shareReplay(1)
    );

    const tokenMeta$ = networkVersion$.pipe(switchMap(getTokenMeta), share());

    tokenMeta$.subscribe(this.setTokenMeta);

    this.warmEthApi()
      .then(tokens => {
        bancorApiTokens = tokens;
      })
      .catch(() => {});

    networkVersion$
      .pipe(
        filter(version => version == EthNetworks.Mainnet),
        firstItem(),
        switchMap(fetchSmartTokens)
      )
      .subscribe(availableSmartTokenHistories =>
        this.setAvailableHistories(
          availableSmartTokenHistories.map(history => history.id)
        )
      );

    const usdPriceOfBnt$ = from(this.fetchUsdPriceOfBnt()).pipe(shareReplay(1));

    console.time("FirstPromise");

    const currentBlock$ = from(web3.eth.getBlockNumber()).pipe(
      map(block => [moment().unix(), block]),
      shareReplay(1)
    );

    const networkVars$ = networkVersion$.pipe(
      map(getNetworkVariables),
      shareReplay(1)
    );

    currentBlock$
      .pipe(firstItem())
      .subscribe(([unixTime, block]) => currentBlockTwo$.next(block));

    networkVars$.subscribe(networkVariables =>
      this.fetchAndSetBntSupply(networkVariables.bntToken)
    );

    interface DataCache<T> {
      allEmissions: T[];
      newData: T[];
    }

    const distinctArrayItem = <T>(
      initialValue: T[],
      comparator?: (a: T, b: T) => boolean
    ) => (source: Observable<T[]>) =>
      source.pipe(
        scan(
          (acc, item) => {
            const difference = differenceWith(
              item,
              acc.allEmissions,
              comparator || isEqual
            );
            console.log(acc, "acc process", item, "going out is..", difference);
            return {
              allEmissions: [...acc.allEmissions, ...difference],
              newData: difference
            };
          },
          { allEmissions: initialValue, newData: [] } as DataCache<T>
        ),
        filter(dataCache => dataCache.newData.length > 0),
        pluck("newData"),
        startWith(initialValue)
      );

    const contractAddresses$ = networkVars$.pipe(
      switchMap(networkVariables =>
        this.fetchContractAddresses(networkVariables.contractRegistry)
      ),
      startWith({
        BancorNetwork: "0x2F9EC37d6CcFFf1caB21733BdaDEdE11c823cCB0",
        BancorConverterRegistry: "0xeB53781A5a0819375d04251A615e3a039f296Ca9",
        LiquidityProtectionStore: "0xf5FAB5DBD2f3bf675dE4cB76517d4767013cfB55",
        LiquidityProtection: "0x53F36c56eCD4FB145989710Fa3E3Cc28AE4aCE88"
      } as RegisteredContracts),
      distinctUntilChanged<RegisteredContracts>(isEqual),
      shareReplay(1)
    );

    const liquidityProtection$ = contractAddresses$.pipe(
      pluck("LiquidityProtection"),
      distinctUntilChanged(compareString),
      shareReplay(1)
    );

    const liquidityProtectionStore$ = contractAddresses$.pipe(
      pluck("LiquidityProtectionStore"),
      distinctUntilChanged(compareString),
      shareReplay(1)
    );

    const bancorConverterRegistry$ = contractAddresses$.pipe(
      pluck("BancorConverterRegistry"),
      distinctUntilChanged(compareString),
      shareReplay(1)
    );

    const bancorNetwork$ = contractAddresses$.pipe(
      pluck("BancorNetwork"),
      distinctUntilChanged(compareString),
      shareReplay(1)
    );

    combineLatest([
      bancorNetwork$,
      currentBlock$.pipe(
        map(([unixTime, currentBlock]) => [
          unixTime,
          currentBlock,
          rewindBlocksByDays(currentBlock, 1)
        ])
      ),
      networkVersion$
    ])
      .pipe(
        switchMap(
          ([
            networkContract,
            [unixTime, currentBlock, blockYesterday],
            network
          ]) =>
            (async () => {
              const events = await this.pullEvents({
                network,
                networkContract,
                fromBlock: blockYesterday
              });

              const withDates = events.joinedTradeEvents.map(event =>
                decodedToTimedDecoded(event, currentBlock, Number(unixTime))
              );

              return {
                joinedTradeEvents: withDates,
                singleTrades: events.singleTraades
              };
            })()
        )
      )
      .subscribe(this.setLiquidityHistory);

    liquidityProtection$
      .pipe(switchMap(this.fetchLiquidityProtectionSettings))
      .subscribe(this.setLiquidityProtectionSettings);

    liquidityProtectionStore$
      .pipe(switchMap(this.fetchWhiteListedV1Pools))
      .subscribe(this.setWhiteListedPools);

    const anchors$ = bancorConverterRegistry$.pipe(
      switchMap(converterRegistryAddress =>
        this.fetchAnchorAddresses({
          converterRegistryAddress
        })
      ),
      shareReplay(1)
    );

    let bancorApiTokens: TokenPrice[] = [];

    // const bareMinimumAnchors$ = combineLatest([anchors$, bancorNetwork$]).pipe(
    //   mergeMap(([anchorAddressess, networkContractAddress]) =>
    //     this.bareMinimumPools({
    //       params,
    //       networkContractAddress,
    //       anchorAddressess,
    //       ...(bancorApiTokens &&
    //         bancorApiTokens.length > 0 && { tokenPrices: bancorApiTokens })
    //     })
    //   )
    // );

    const ethAnchor = "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533";

    const anchorAndConverters$ = combineLatest([
      anchors$,
      bancorConverterRegistry$
    ]).pipe(
      mergeMap(([anchorAddresses, converterRegistryAddress]) =>
        (async () => {
          const converters = await getConvertersByAnchors({
            anchorAddresses,
            converterRegistryAddress,
            web3
          });
          const anchorsAndConverters = zipAnchorAndConverters(
            anchorAddresses,
            converters
          );
          const includesEth = anchorsAndConverters.some(anchor =>
            compareString(anchor.anchorAddress, ethAnchor)
          );
          console.log("web request", anchorAddresses, { includesEth });
          return anchorsAndConverters;
        })()
      ),
      distinctArrayItem(knownPools, compareAnchorAndConverter),
      tap(x =>
        console.log(
          x,
          "was all emission from anchorAndConverters",
          parseInt(String(Date.now() / 1000))
        )
      ),
      shareReplay<ConverterAndAnchor[]>(3000)
    );

    const authenticated$ = of(this.currentUser).pipe(
      filter(Boolean),
      shareReplay(1)
    );

    combineLatest([
      authenticated$,
      liquidityProtectionStore$
    ]).subscribe(([_, storeAddress]) =>
      this.fetchProtectionPositions({ storeAddress })
    );

    const individualAnchorsAndConverters$ = anchorAndConverters$.pipe(
      tap(x => console.log("coming in.......", x)),
      mergeMap(x => {
        console.log("coming in...2", x);
        return from(x);
      }),
      tap(x => {
        const includesEth = compareString(x.anchorAddress, ethAnchor);
        if (includesEth) {
          console.log(x, "going out indiv", includesEth);
        }
      })
    ) as Observable<ConverterAndAnchor>;

    const [v2Pools$, v1Pools$] = partitionOb(
      individualAnchorsAndConverters$,
      anchorSet =>
        v2Pools.some(anchor => compareString(anchor, anchorSet.anchorAddress))
    );

    v2Pools$
      .pipe(bufferTime(100), delay(2500))
      .subscribe(pools => this.addPoolsBulk(pools));

    const [toLocalLoad$, toRemoteLoad$] = partitionOb(
      v1Pools$.pipe(tap(x => console.count("goinginindiv"))),
      anchorAndConverter =>
        moreStaticRelays.some(staticRelay =>
          compareStaticRelayAndSet(staticRelay, anchorAndConverter)
        )
    );

    const staticRelayLocal$ = toLocalLoad$.pipe(
      tap(x => {
        const hasEth = compareString(x.anchorAddress, ethAnchor);
        console.log("static relay in...", x);
        if (hasEth) {
          console.log("pushing in eth", x);
        }
      }),
      map(anchorAndConverter =>
        findOrThrow(
          moreStaticRelays,
          staticRelay =>
            compareStaticRelayAndSet(staticRelay, anchorAndConverter),
          "failed to find static relay"
        )
      ),
      tap(x => {
        if (compareString(x.poolToken.contract, ethAnchor)) {
          console.log("pushing out eth", x);
        }
        console.log("static relay local out", x);
      })
    );

    const staticRelaysRemote$ = toRemoteLoad$.pipe(
      bufferTime(100),
      map(pairs => [
        pairs.map(pair => pair.converterAddress).map(staticRelayShape),
        pairs.map(pair => pair.anchorAddress).map(poolTokenShape)
      ]),
      concatMap(groupsOfShapes => this.multi({ groupsOfShapes })),
      map(
        ([staticRelays, poolTokens]) =>
          zip(staticRelays, poolTokens) as [
            AbiStaticRelay,
            AbiCentralPoolToken
          ][]
      ),
      mergeMap(zipped => from(zipped)),
      map(([relay, poolToken]) => ({ relay, poolToken })),
      map(set => ({
        ...set,
        relay: {
          ...set.relay,
          version:
            knownVersions.find(version =>
              compareString(
                version.converterAddress,
                set.relay.converterAddress
              )
            )?.version || Number(set.relay.version)
        }
      })),
      tap(x => {
        const hasEth = compareString(x.poolToken.contract, ethAnchor);
        console.log(hasEth, "hasEth", x);
      }),
      filter(({ relay }) => !!relay.connectorToken2),
      map(
        ({ relay, poolToken }) =>
          ({
            ...relay,
            poolToken,
            reserves: [relay.connectorToken1, relay.connectorToken2] as [
              string,
              string
            ],
            version: Number(relay.version),
            converterType: determineConverterType(relay.converterType)
          } as StaticRelay)
      )
    ) as Observable<StaticRelay>;

    try {
      console.log("once a month energy drink");
      const staticRelays$ = merge(staticRelayLocal$, staticRelaysRemote$).pipe(
        tap(x => {
          console.log(x, "out out out");
          const hasEth = compareString(x.poolToken.contract, ethAnchor);
          if (hasEth) {
            console.log("derp", x);
          }
        }),
        filter(
          relay =>
            true ||
            !v2Pools.some(r => compareString(relay.poolToken.contract, r))
        )
      );

      const dynamicRelayRemote$ = staticRelays$.pipe(
        tap(x => {
          const hasEth = compareString(x.poolToken.contract, ethAnchor);
          if (hasEth) {
            console.log("and again!...");
          }
        }),
        bufferTime(100),
        filter(staticRelays => staticRelays && staticRelays.length > 0),
        tap(x => {
          console.log("going out for remote loading", x);
          const hasEth = x.some(q =>
            compareString(q.poolToken.contract, ethAnchor)
          );
          if (hasEth) {
            console.log("eth is in the house");
          }
        }),
        mergeMap(x => this.fetchDynamicRelays(x)),
        share()
      );

      const filterAndWarn = <T>(
        arr: T[],
        conditioner: (item: T) => boolean,
        reason?: string
      ): T[] => {
        const [passed, dropped] = partition(arr, conditioner);
        if (dropped.length > 0) {
          console.warn(
            "Dropped",
            dropped,
            "items from array",
            reason ? `because ${reason}` : ""
          );
        }
        return passed;
      };

      const fullRelays$ = dynamicRelayRemote$.pipe(
        tap(relays => {
          const hasEth = relays.some(relay =>
            compareString(relay.poolToken.contract, ethAnchor)
          );
          console.log("full Relays have eth", hasEth);
        }),
        map(relays =>
          filterAndWarn(relays, x =>
            x.reserves.every(reserve => reserve.symbol)
          )
        ),
        tap(relays => {
          const hasEth = relays.some(relay =>
            compareString(relay.poolToken.contract, ethAnchor)
          );
          console.log("full Relays have eth past the filter!", hasEth);
        }),
        map(relays => relays.map(newRelayToRelayWithBalances)),
        tap(relays => {
          const hasEth = relays.some(relay =>
            compareString(relay.id, ethAnchor)
          );
          console.log("full Relays have eth past the map!", hasEth);
        })
      );

      const emittedRelays$ = combineLatest([
        fullRelays$,
        usdPriceOfBnt$,
        networkVersion$
      ]).pipe(
        map(([relay, usdPriceOfBnt, currentNetwork]) => {
          const bntTokenAddress = getNetworkVariables(currentNetwork).bntToken;

          const knownPrices = [
            ...trustedStables(this.currentNetwork),
            { id: bntTokenAddress, usdPrice: String(usdPriceOfBnt) }
          ];
          const reserveFeeds = buildPossibleReserveFeedsTraditional(
            relay,
            knownPrices
          );
          return {
            relay,
            reserveFeeds
          };
        }),
        tap(x => console.log("more..", x))
      );

      const finalRelays$ = emittedRelays$.pipe(
        bufferTime(50),
        filter(x => x && x.length > 0),
        map(x => {
          const allReserveFeeds = x.flatMap(x => x.reserveFeeds);
          const relays = x.flatMap(x => x.relay);
          return { allReserveFeeds, relays };
        }),
        tap(x => {
          console.log(x, "actually getting set");
          this.addThePools({
            pools: x.relays,
            reserveFeeds: x.allReserveFeeds
          });
        }),
        share()
      );

      const x = await finalRelays$
        .pipe(
          mergeMap(x => from(x.relays)),
          filter(x =>
            compareString(x.id, "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533")
          ),
          firstItem()
        )
        .toPromise();

      console.log(x, "had resolved with...");
    } catch (e) {
      console.error("thrown in x", e);
    }
  }

  @action async addPools({
    sync,
    async
  }: {
    sync: ConverterAndAnchor[];
    async: ConverterAndAnchor[];
  }) {
    const passedAsyncPools = async.filter(notBadRelay);
    const passedSyncPools = sync.filter(notBadRelay);

    const longToLoadConverters = [
      "0xfb64059D18BbfDc5EEdCc6e65C9F09de8ccAf5b6",
      "0xB485A5F793B1DEadA32783F99Fdccce9f28aB9a2",
      "0x444Bd9a308Bd2137208ABBcc3efF679A90d7A553",
      "0x5C8c7Ef16DaC7596C280E70C6905432F7470965E",
      "0x40c7998B5d94e00Cd675eDB3eFf4888404f6385F",
      "0x0429e43f488D2D24BB608EFbb0Ee3e646D61dE71",
      "0x7FF01DB7ae23b97B15Bc06f49C45d6e3d84df46f",
      "0x16ff969cC3A4AE925D9C0A2851e2386d61E75954",
      "0x72eC2FF62Eda1D5E9AcD6c4f6a016F0998ba1cB0",
      "0xcAf6Eb14c3A20B157439904a88F00a8bE929c887"
    ];

    const [slowLoadAnchorSets, quickLoadAnchorSet] = partition(
      passedAsyncPools,
      anchorSet =>
        longToLoadConverters.some(converter =>
          compareString(converter, anchorSet.converterAddress)
        )
    );

    const quickChunks = chunk(quickLoadAnchorSet, 100);

    const allASyncChunks = [...quickChunks, slowLoadAnchorSets];

    return new Promise(resolve => {
      this.doThing([passedSyncPools]).then(resolve);
      this.doThing(allASyncChunks);
    });
  }

  @action async doThing(allASyncChunks: ConverterAndAnchor[][]) {
    const tokenAddresses = await Promise.all(
      allASyncChunks.map(this.addPoolsBulk)
    );
    const uniqueTokenAddreses = uniqWith(
      tokenAddresses
        .filter(Boolean)
        .filter(x => Array.isArray(x) && x.length > 0)
        .flat(1) as string[],
      compareString
    );
    if (this.currentUser) {
      this.fetchAndSetTokenBalances(uniqueTokenAddreses);
    }
    this.addAprsToPools();
    this.addLiqMiningAprsToPools();
  }

  @action async addLiqMiningAprsToPools() {
    const existing = this.relaysList;
    const highTierPools = existing.filter(relay =>
      this.highTierPoolsArr.some(htp => compareString(relay.id, htp))
    ) as RelayWithReserveBalances[];

    const storeAddress = this.contracts.LiquidityProtectionStore;

    const protectedShapes = highTierPools.map(pool => {
      const [reserveOne, reserveTwo] = pool.reserves;
      return protectedReservesShape(
        storeAddress,
        pool.id,
        reserveOne.contract,
        reserveTwo.contract
      );
    });

    const [protectedReserves] = ((await this.multi({
      groupsOfShapes: [protectedShapes]
    })) as unknown[]) as {
      anchorAddress: string;
      reserveOneAddress: string;
      reserveTwoAddress: string;
      reserveOneProtected: string;
      reserveTwoProtected: string;
    }[][];

    const zippedProtectedReserves = protectedReserves.map(protectedReserve => ({
      anchorAddress: protectedReserve.anchorAddress,
      reserves: [
        {
          contract: protectedReserve.reserveOneAddress,
          amount: protectedReserve.reserveOneProtected
        },
        {
          contract: protectedReserve.reserveTwoAddress,
          amount: protectedReserve.reserveTwoProtected
        }
      ]
    }));

    console.log(
      protectedReserves,
      "are the protected reserves",
      zippedProtectedReserves
    );

    const res = zippedProtectedReserves.map(pool => {
      const isHighCap = highCapPools.some(anchor =>
        compareString(anchor, pool.anchorAddress)
      );
      const poolBalances = findOrThrow(highTierPools, p =>
        compareString(pool.anchorAddress, p.id)
      );
      const [
        bntProtectedReserve,
        tknProtectedReserve
      ] = sortAlongSide(pool.reserves, reserve => reserve.contract, [
        this.liquidityProtectionSettings.networkToken
      ]);
      const [
        bntReserve,
        tknReserve
      ] = sortAlongSide(poolBalances.reserveBalances, reserve => reserve.id, [
        this.liquidityProtectionSettings.networkToken
      ]);

      return {
        ...pool,
        bntReward: miningBntReward(bntProtectedReserve.amount, isHighCap),
        tknReward: miningTknReward(
          tknReserve.amount,
          bntReserve.amount,
          tknProtectedReserve.amount,
          isHighCap
        )
      };
    });

    const secondRoundPools = [
      "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8",
      "0x6b181c478b315be3f9e99c57ce926436c32e17a7"
    ];

    const liqMiningApr: PoolLiqMiningApr[] = res.map(calculated => {
      const [bntReserve, tknReserve] = sortAlongSide(
        calculated.reserves,
        reserve => reserve.contract,
        [this.liquidityProtectionSettings.networkToken]
      );
      const fullTknReserve = findOrThrow(
        highTierPools.flatMap(pool => pool.reserves),
        reserve => compareString(reserve.contract, tknReserve.contract),
        "failed to find reserve"
      );

      const isSecondRound = secondRoundPools.some(anchor =>
        compareString(anchor, calculated.anchorAddress)
      );
      const endTime = isSecondRound
        ? secondRoundLiquidityMiningEndTime
        : liquidityMiningEndTime;

      return {
        poolId: calculated.anchorAddress,
        endTime,
        rewards: [
          {
            address: bntReserve.contract,
            amount: bntReserve.amount,
            symbol: "BNT",
            reward: calculated.bntReward
          },
          {
            address: tknReserve.contract,
            amount: tknReserve.amount,
            symbol: fullTknReserve.symbol,
            reward: calculated.tknReward
          }
        ]
      };
    });

    this.updateLiqMiningApr(liqMiningApr);
  }

  poolLiqMiningAprs: PoolLiqMiningApr[] = [];

  @mutation updateLiqMiningApr(liqMiningApr: PoolLiqMiningApr[]) {
    const existing = this.poolLiqMiningAprs;
    const withoutOld = existing.filter(
      apr => !liqMiningApr.some(a => compareString(a.poolId, apr.poolId))
    );
    this.poolLiqMiningAprs = [...withoutOld, ...liqMiningApr];
  }

  poolAprs: PoolApr[] = [];

  @mutation updatePoolAprs(newPoolAprs: PoolApr[]) {
    const existing = this.poolAprs;
    const withoutOld = existing.filter(
      apr => !newPoolAprs.some(a => compareString(apr.poolId, a.poolId))
    );
    this.poolAprs = [...withoutOld, ...newPoolAprs];
  }

  @action async addAprsToPools() {
    const whitelistedPools = this.whiteListedPools
      .map(anchor =>
        this.relaysList.find(relay => compareString(relay.id, anchor))
      )
      .filter(Boolean) as Relay[];

    const poolsToCalculate = whitelistedPools.filter(
      pool => !this.poolAprs.some(apr => compareString(pool.id, apr.poolId))
    );

    const currentBlock = await w3.eth.getBlockNumber();
    const weekAgo = rewindBlocksByDays(currentBlock, 7);

    const reservesShapes = poolsToCalculate.map(pool =>
      reserveBalanceShape(
        pool.contract,
        pool.reserves.map(reserve => reserve.contract)
      )
    );

    const [tokenSupplys, reserveBalances] = ((await this.multi({
      groupsOfShapes: [
        poolsToCalculate.map(pool =>
          tokenSupplyShape(pool.id, this.currentNetwork)
        ),
        reservesShapes
      ],
      blockHeight: weekAgo
    })) as [unknown, unknown]) as [
      {
        tokenContract: string;
        supply: string;
      }[],
      RawAbiReserveBalance[]
    ];

    console.log(poolsToCalculate, "are pools to calculate");
    const [passedReserveBalances, failedReserveBalances] = partition(
      reserveBalances,
      balance => balance.reserveOne && balance.reserveTwo
    );

    console.log({ failedReserveBalances });

    const poolRoiShapes = tokenSupplys
      .filter(supply => {
        const pool = findOrThrow(poolsToCalculate, pool =>
          compareString(pool.id, supply.tokenContract)
        );
        const found = passedReserveBalances.some(reserve =>
          compareString(pool.contract, reserve.converterAddress)
        );
        return found;
      })
      .map(supply => {
        const anchor = supply.tokenContract;

        const pool = findOrThrow(
          poolsToCalculate as RelayWithReserveBalances[],
          pool => compareString(pool.id, anchor),
          "failed finding pool for pool shape"
        );

        const converterAddress = pool.contract;
        const poolTokenSupply = supply.supply;
        const reserves = findOrThrow(reserveBalances, balance =>
          compareString(balance.converterAddress, converterAddress)
        );

        return dualPoolRoiShape(
          this.contracts.LiquidityProtection,
          supply.tokenContract,
          [
            {
              tokenContract: reserves.reserveOneAddress,
              weiAmount: reserves.reserveOne
            },
            {
              tokenContract: reserves.reserveTwoAddress,
              weiAmount: reserves.reserveTwo
            }
          ],
          poolTokenSupply
        );
      });

    try {
      const [poolRois] = ((await this.multi({
        groupsOfShapes: [poolRoiShapes]
      })) as [unknown]) as [
        {
          anchor: string;
          onePrimary: string;
          oneRoi: string;
          twoPrimary: string;
          twoRoi: string;
        }[]
      ];
      console.log("PoolROI Success:", poolRois);

      const successfulPoolRois = poolRois
        .filter(roi => roi.oneRoi && roi.twoRoi)
        .map(roi => ({
          ...roi,
          oneRoiCalculated: new BigNumber(roi.oneRoi)
            .div(1000000)
            .minus(1)
            .times(52)
            .toString(),
          twoRoiCalculated: new BigNumber(roi.twoRoi)
            .div(1000000)
            .minus(1)
            .times(52)
            .toString()
        }))
        .map(roi => ({
          ...roi,
          mean: calculateMean(roi.oneRoiCalculated, roi.twoRoiCalculated)
        }));

      console.log(
        successfulPoolRois,
        "allROIS",
        successfulPoolRois.map(x => x.anchor),
        "anchors"
      );
      this.updatePoolAprs(
        successfulPoolRois.map(
          (x): PoolApr => ({ poolId: x.anchor, oneWeekApr: x.mean })
        )
      );
    } catch (e) {
      console.error("PoolROI Failure:", e.message, poolRoiShapes);
    }
  }

  @action async checkFees(pools: Relay[]) {
    const convertersAndAnchors: ConverterAndAnchor[] = pools.map(relay => ({
      anchorAddress: relay.id,
      converterAddress: relay.contract
    }));
    convertersAndAnchors.forEach(converterAndAnchor =>
      convertersAndAnchors$.next(converterAndAnchor)
    );
  }

  @action async addThePools({
    pools,
    reserveFeeds
  }: {
    pools: RelayWithReserveBalances[];
    reserveFeeds: ReserveFeed[];
  }) {
    this.updateRelays(pools);
    this.updateRelayFeeds(
      await this.addPossiblePropsFromBancorApi(reserveFeeds)
    );

    const allTokens = pools.flatMap(tokensInRelay);
    console.log({ allTokens, pools }, "are all tokens");
    const contracts = allTokens.map(token => token.contract);

    void this.checkFees(pools);
    return contracts;
  }

  @action async addPoolsBulk(convertersAndAnchors: ConverterAndAnchor[]) {
    console.log(
      "bulkGot",
      convertersAndAnchors.length,
      "at",
      parseInt(String(Date.now() / 1000)),
      Date.now()
    );
    if (!convertersAndAnchors || convertersAndAnchors.length == 0) return;

    this.setLoadingPools(true);

    const { pools, reserveFeeds } = await this.addPoolsV2(convertersAndAnchors);

    const allPools = [...pools];
    const allReserveFeeds = [...reserveFeeds];

    const poolsFailed = differenceWith(convertersAndAnchors, allPools, (a, b) =>
      compareString(a.anchorAddress, b.id)
    );
    this.updateFailedPools(
      poolsFailed.map(failedPool => failedPool.anchorAddress)
    );

    this.updateRelays(allPools);
    this.updateRelayFeeds(
      await this.addPossiblePropsFromBancorApi(allReserveFeeds)
    );

    const tokenAddresses = pools
      .flatMap(tokensInRelay)
      .map(token => token.contract);

    console.log(
      "bulkGotResolved",
      convertersAndAnchors.length,
      "at",
      parseInt(String(Date.now() / 1000)),
      Date.now()
    );
    void this.checkFees(allPools);

    return tokenAddresses;
  }

  @action async fetchAndSetTokenBalances(tokenContractAddresses: string[]) {
    if (!this.currentUser) return;

    const governanceToken =
      web3.utils.isAddress(this.liquidityProtectionSettings.govToken) &&
      this.liquidityProtectionSettings.govToken;

    if (governanceToken) {
      tokenContractAddresses.push(this.liquidityProtectionSettings.govToken);
    }

    const uniqueAddresses = uniqWith(
      tokenContractAddresses.filter(web3.utils.isAddress),
      compareString
    );

    const ethAddresses = [
      ethReserveAddress,
      "0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315"
    ];
    const includesEth = uniqueAddresses.some(address =>
      ethAddresses.some(a => compareString(address, a))
    );
    const withoutEth = uniqueAddresses.filter(
      address => !ethAddresses.some(a => compareString(address, a))
    );

    const [balances, ethBalance] = await Promise.all([
      this.fetchTokenBalances(withoutEth),
      (async () => {
        if (!includesEth) return;
        const weiBalance = await web3.eth.getBalance(this.currentUser);
        return fromWei(weiBalance);
      })()
    ]);

    if (ethBalance) {
      this.updateUserBalances([
        ...balances,
        { id: ethReserveAddress, balance: ethBalance }
      ]);
    } else {
      this.updateUserBalances(balances);
    }
  }

  @action async fetchConverterAddressesByAnchorAddresses(
    anchorAddresses: string[]
  ) {
    return getConvertersByAnchors({
      anchorAddresses,
      converterRegistryAddress: this.contracts.BancorConverterRegistry,
      web3: w3
    });
  }

  @action async fetchAnchorAddresses({
    converterRegistryAddress
  }: {
    converterRegistryAddress: string;
  }) {
    return getAnchors(converterRegistryAddress, w3);
  }

  @mutation updateRelays(relays: Relay[]) {
    const allReserves = this.relaysList
      .concat(relays)
      .flatMap(relay => relay.reserves);
    const uniqueTokens = uniqWith(allReserves, (a, b) =>
      compareString(a.contract, b.contract)
    );

    const decimalUniformityBetweenTokens = uniqueTokens.every(token => {
      const allReservesTokenFoundIn = allReserves.filter(reserve =>
        compareString(token.contract, reserve.contract)
      );
      return allReservesTokenFoundIn.every(
        (reserve, _, arr) => reserve.decimals == arr[0].decimals
      );
    });
    if (!decimalUniformityBetweenTokens) {
      console.error(
        `There is a mismatch of decimals between relays of the same token, will not store ${relays.length} new relays`
      );
      return;
    }

    const meshedRelays = uniqWith(
      [...relays, ...this.relaysList],
      compareRelayById
    ).map(relay => ({
      ...relay,
      reserves: sortByNetworkTokens(
        updateArray(
          relay.reserves,
          reserve => !reserve.meta,
          reserve => {
            const meta = this.tokenMeta.find(meta =>
              compareString(reserve.contract, meta.contract)
            );
            return {
              ...reserve,
              meta: {
                logo: (meta && meta.image) || defaultImage,
                ...(meta && meta!.name && { name: meta.name })
              }
            };
          }
        ),
        reserve => reserve.symbol
      )
    }));

    const bntSupply = this.bntSupply;
    const bntTokenAddress = getNetworkVariables(this.currentNetwork).bntToken;

    const totalBntInRelays = meshedRelays
      .filter(relay =>
        relay.reserves.some(reserve => reserve.contract, bntTokenAddress)
      )
      .reduce((acc, relay) => {
        const relayBalances = relay as RelayWithReserveBalances;
        const bntReserveBalance =
          relayBalances.reserveBalances?.find(reserve =>
            compareString(reserve.id, bntTokenAddress)
          )?.amount || "0";
        return new BigNumber(acc).plus(bntReserveBalance).toString();
      }, "0");

    const percent = new BigNumber(totalBntInRelays).div(bntSupply).toNumber();

    this.stakedBntPercent = percent;
    this.relaysList = Object.freeze(meshedRelays);
  }

  stakedBntPercent: number = 0;

  @mutation wipeTokenBalances() {
    this.tokenBalances = [];
  }

  @action async onAuthChange(userAddress: string) {
    this.wipeTokenBalances();
    if (userAddress) {
      Sentry.setUser({ id: userAddress.toLowerCase() });
      const govAddress = web3.utils.isAddress(
        this.liquidityProtectionSettings.govToken
      );
      if (govAddress) {
        this.fetchAndSetTokenBalances([
          this.liquidityProtectionSettings.govToken
        ]);
      }
      console.log(userAddress, "fetching protected positions for");
      this.fetchProtectionPositions({});
      this.fetchLockedBalances();
      const allTokens = this.relaysList.flatMap(tokensInRelay);
      const uniqueTokenAddresses = uniqWith(
        allTokens.map(token => token.contract),
        compareString
      );
      this.fetchAndSetTokenBalances(uniqueTokenAddresses);
    } else {
      Sentry.configureScope(scope => scope.setUser(null));
    }
  }

  @action async focusPool(id: string): Promise<FocusPoolRes> {
    const pool = await this.relayById(id);
    const converterAddress = pool.contract;
    const yesterday = await blockNumberHoursAgo(24, w3);

    const res = await this.pullConverterEvents({
      converterAddress,
      network: this.currentNetwork,
      fromBlock: yesterday.blockHoursAgo
    });
    console.log(res, "was returned from focus pool");

    return res;
  }

  @action async focusSymbol(id: string) {
    if (!this.currentUser) return;
    this.fetchTokenBalances([id]);

    const tokenTracked = this.tokens.find(token => compareString(token.id, id));
    if (!tokenTracked) {
      this.loadMoreTokens([id]);
    }
  }

  @action async refreshBalances(symbols?: BaseToken[]) {
    if (symbols) {
      symbols.forEach(symbol => this.focusSymbol(symbol.symbol));
    }
  }

  @action async mintEthErcIfRequired(decString: string) {
    const contract = buildTokenContract(ethErc20WrapperContract, w3);
    const currentBalance = await contract.methods
      .balanceOf(this.currentUser)
      .call();

    const currentBalanceDec = shrinkToken(currentBalance, 18);

    const mintingRequired = new BigNumber(decString).gt(currentBalanceDec);
    if (mintingRequired) {
      return this.mintEthErc(decString);
    }
  }

  @action async tokenById(id: string) {
    return findOrThrow(
      this.tokens,
      token => compareString(token.id, id),
      `tokenById failed to find token with ID ${id} `
    );
  }

  @action async tokensById(ids: string[]) {
    return Promise.all(ids.map(id => this.tokenById(id)));
  }

  @action async findPath({
    fromId,
    toId,
    relays
  }: {
    fromId: string;
    toId: string;
    relays: readonly Relay[];
  }) {
    const lowerCased = relays.map(relay => ({
      ...relay,
      reserves: relay.reserves.map(reserve => ({
        ...reserve,
        contract: reserve.contract.toLowerCase()
      }))
    }));
    const path = await findNewPath(
      fromId.toLowerCase(),
      toId.toLowerCase(),
      lowerCased,
      relay => [relay.reserves[0].contract, relay.reserves[1].contract]
    );

    const flattened = path.hops.flatMap(hop => hop[0]);
    return flattened.map(flat =>
      findOrThrow(
        relays,
        relay => compareString(relay.contract, flat.contract),
        "failed to find relays used in pathing"
      )
    );
  }

  @action async convert({
    from,
    to,
    onUpdate
  }: ProposedConvertTransaction): Promise<TxResponse> {
    if (compareString(from.id, to.id))
      throw new Error("Cannot convert a token to itself.");
    const [fromToken, toToken] = await this.tokensById([from.id, to.id]);
    const fromIsEth = compareString(fromToken.symbol, "eth");

    const steps: Section[] = [
      {
        name: "Pathing",
        description: "Finding path..."
      },
      {
        name: "SetApprovalAmount",
        description: "Setting approval amount..."
      },
      {
        name: "ConvertProcessing",
        description: "Processing conversion..."
      },
      {
        name: "WaitingTxConf",
        description: "Awaiting block confirmation..."
      },
      {
        name: "Done",
        description: "Done!"
      }
    ];

    onUpdate!(0, steps);

    const fromTokenDecimals = await this.getDecimalsByTokenAddress(
      fromToken.id
    );
    const toTokenDecimals = await this.getDecimalsByTokenAddress(toToken.id);

    const relaysByLiqDepth = this.relays.sort(sortByLiqDepth);
    const relaysList = sortAlongSide(
      this.relaysList,
      relay => relay.id,
      relaysByLiqDepth.map(relay => relay.id)
    );
    const winningRelays = uniqWith(relaysList, compareRelayByReserves);

    const relays = await this.findPath({
      relays: winningRelays,
      fromId: from.id,
      toId: to.id
    });

    const fromAmount = from.amount;
    const fromSymbol = fromToken.symbol;
    const fromTokenContract = fromToken.id;
    const toTokenContract = toToken.id;

    const ethPath = generateEthPath(fromSymbol, relays.map(relayToMinimal));

    const fromWei = expandToken(fromAmount, fromTokenDecimals);

    if (!fromIsEth) {
      onUpdate!(1, steps);
      await this.triggerApprovalIfRequired({
        owner: this.currentUser,
        amount: fromWei,
        spender: this.contracts.BancorNetwork,
        tokenAddress: fromTokenContract
      });
    }

    onUpdate!(2, steps);

    const networkContract = buildNetworkContract(this.contracts.BancorNetwork);

    const expectedReturn = to.amount;
    const expectedReturnWei = expandToken(expectedReturn, toTokenDecimals);

    const confirmedHash = await this.resolveTxOnConfirmation({
      tx: networkContract.methods.convertByPath(
        ethPath,
        fromWei,
        await this.weiMinusSlippageTolerance(expectedReturnWei),
        zeroAddress,
        zeroAddress,
        0
      ),
      ...(fromIsEth && { value: fromWei }),
      onHash: () => onUpdate!(3, steps)
    });
    onUpdate!(4, steps);

    this.spamBalances([fromTokenContract, toTokenContract]);

    return {
      txId: confirmedHash,
      blockExplorerLink: await this.createExplorerLink(confirmedHash)
    };
  }

  @action async triggerApprovalIfRequired({
    owner,
    spender,
    amount,
    tokenAddress
  }: {
    owner: string;
    spender: string;
    tokenAddress: string;
    amount: string;
  }) {
    const currentApprovedBalance = await getApprovedBalanceWei({
      owner,
      spender,
      tokenAddress
    });

    const noNullingTokenContracts = [this.liquidityProtectionSettings.govToken];

    const sufficientBalanceAlreadyApproved = new BigNumber(
      currentApprovedBalance
    ).isGreaterThanOrEqualTo(amount);

    if (sufficientBalanceAlreadyApproved) return;

    const isNoNullingTokenContract = noNullingTokenContracts.some(contract =>
      compareString(tokenAddress, contract)
    );

    const nullingTxRequired =
      fromWei(currentApprovedBalance) !== "0" && !isNoNullingTokenContract;
    if (nullingTxRequired) {
      await this.approveTokenWithdrawals([
        { approvedAddress: spender, amount: toWei("0"), tokenAddress }
      ]);
    }

    return this.approveTokenWithdrawals([
      { approvedAddress: spender, amount, tokenAddress }
    ]);
  }

  @action async getReturnByPath({
    path,
    amount
  }: {
    path: string[];
    amount: string;
  }): Promise<string> {
    return getReturnByPath({
      networkContract: this.contracts.BancorNetwork,
      path,
      amount,
      web3: w3
    });
  }

  @action async getDecimalsByTokenAddress(tokenAddress: string) {
    if (compareString(tokenAddress, ethReserveAddress)) return 18;
    const reserve = this.relaysList
      .flatMap(relay => relay.reserves)
      .find(reserve => compareString(reserve.contract, tokenAddress));
    if (!reserve) {
      try {
        const contract = buildTokenContract(tokenAddress, w3);
        const decimals = await contract.methods.decimals().call();
        return Number(decimals);
      } catch (e) {
        throw new Error(
          `Failed to find token address ${tokenAddress} in list of reserves. ${e.message}`
        );
      }
    }
    return reserve.decimals;
  }

  @action async calculateSingleWithdraw({
    id,
    decPercent
  }: {
    id: string;
    decPercent: number;
  }): Promise<{
    outputs: ViewAmountDetail[];
    expectedValue: ViewAmountDetail;
  }> {
    const [, posId] = id.split(":");
    const ppm = new BigNumber(decPercent).times(oneMillion).toString();
    const res = await getRemoveLiquidityReturn(
      this.contracts.LiquidityProtection,
      posId,
      ppm,
      moment().unix(),
      w3
    );

    const position = findOrThrow(
      this.protectedPositionsArr,
      pos => compareString(pos.id, posId),
      "failed finding protected position"
    );
    const { reserveToken } = position;

    const reserveTokenObj = findOrThrow(
      this.relaysList.flatMap(r => r.reserves),
      reserve => compareString(reserveToken, reserve.contract)
    );

    return {
      outputs: [
        {
          amount: shrinkToken(res.baseAmount, reserveTokenObj.decimals),
          id: reserveToken,
          symbol: reserveTokenObj.symbol
        },
        {
          amount: shrinkToken(res.networkAmount, 18),
          id: this.liquidityProtectionSettings.networkToken,
          symbol: "BNT"
        }
      ].filter(output => new BigNumber(output.amount).isGreaterThan(0)),
      expectedValue: {
        amount: shrinkToken(res.targetAmount, reserveTokenObj.decimals),
        id: reserveToken,
        symbol: reserveTokenObj.symbol
      }
    };
  }

  @action async getReturn({
    from,
    toId
  }: ProposedFromTransaction): Promise<ConvertReturn> {
    if (compareString(from.id, toId))
      throw new Error("Cannot convert a token to itself.");
    const [fromToken, toToken] = await this.tokensById([from.id, toId]);

    const [fromTokenContract, toTokenContract] = [fromToken.id, toToken.id];
    const amount = from.amount;

    const fromTokenDecimals = await this.getDecimalsByTokenAddress(
      fromTokenContract
    );
    const toTokenDecimals = await this.getDecimalsByTokenAddress(
      toTokenContract
    );

    const relaysByLiqDepth = this.relays.sort(sortByLiqDepth);
    const relaysList = sortAlongSide(
      this.relaysList,
      relay => relay.id,
      relaysByLiqDepth.map(relay => relay.id)
    );
    const winningRelays = uniqWith(relaysList, compareRelayByReserves);

    const relays = await this.findPath({
      fromId: from.id,
      toId,
      relays: winningRelays
    });

    const path = generateEthPath(fromToken.symbol, relays.map(relayToMinimal));

    console.log(path, "is the path");

    const fromWei = expandToken(amount, fromTokenDecimals);
    try {
      const wei = await this.getReturnByPath({
        path,
        amount: fromWei
      });
      const weiNumber = new BigNumber(wei);

      const userReturnRate = buildRate(new BigNumber(fromWei), weiNumber);

      let slippage: number | undefined;
      try {
        const contract = buildConverterContract(relays[0].contract, w3);
        const fromReserveBalanceWei = await contract.methods
          .getConnectorBalance(fromTokenContract)
          .call();

        const smallPortionOfReserveBalance = new BigNumber(
          fromReserveBalanceWei
        ).times(0.00001);

        if (smallPortionOfReserveBalance.isLessThan(fromWei)) {
          const smallPortionOfReserveBalanceWei = smallPortionOfReserveBalance.toFixed(
            0
          );

          const smallPortionReturn = await this.getReturnByPath({
            path,
            amount: smallPortionOfReserveBalanceWei
          });

          const tinyReturnRate = buildRate(
            new BigNumber(smallPortionOfReserveBalanceWei),
            new BigNumber(smallPortionReturn)
          );

          const slippageNumber = calculateSlippage(
            tinyReturnRate,
            userReturnRate
          );
          slippage = slippageNumber.toNumber();
        }
      } catch (e) {
        console.warn("Failed calculating slippage", e.message);
      }

      return {
        amount: shrinkToken(wei, toTokenDecimals),
        slippage
      };
    } catch (e) {
      if (
        e.message.includes(
          `Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from`
        )
      ) {
        const relayBalances = await Promise.all(
          relays.map(async relay => ({
            relay,
            balances: await this.fetchRelayBalances({ poolId: relay.id })
          }))
        );
        const relaysWithNoBalances = relayBalances.filter(
          relay =>
            !relay.balances.reserves.every(reserve => reserve.weiAmount !== "0")
        );
        if (relaysWithNoBalances.length > 0) {
          const moreThanOne = relayBalances.length > 1;
          throw new Error(
            moreThanOne
              ? "Pool does not have sufficient reserve balances"
              : "Pool does not have a sufficient reserve balance"
          );
        } else {
          throw new Error(e);
        }
      } else {
        throw new Error(e);
      }
    }
  }

  @action async getCost({ fromId, to }: ProposedToTransaction) {
    if (compareString(fromId, to.id))
      throw new Error("Cannot convert a token to itself.");
    const fromToken = await this.tokenById(fromId);
    const toToken = await this.tokenById(to.id);

    const amount = to.amount;

    const [fromTokenContract, toTokenContract] = [fromToken.id, toToken.id];

    const fromTokenDecimals = await this.getDecimalsByTokenAddress(
      fromTokenContract
    );
    const toTokenDecimals = await this.getDecimalsByTokenAddress(
      toTokenContract
    );

    const relays = this.relaysList;

    const poolIds = relays.map(relay => relay.id);
    const allCoveredUnderBancorApi = poolIds.every(poolId =>
      ethBancorApiDictionary.some(dic =>
        compareString(poolId, dic.smartTokenAddress)
      )
    );
    if (!allCoveredUnderBancorApi)
      throw new Error("Fetching the cost of this token is not yet supported.");

    const [fromTokenTicker, toTokenTicker] = await Promise.all([
      ethBancorApi.getToken(fromToken.symbol),
      ethBancorApi.getToken(toToken.symbol)
    ]);
    const fromTokenId = fromTokenTicker._id;
    const toTokenId = toTokenTicker._id;

    const result = await ethBancorApi.calculateCost(
      fromTokenId,
      toTokenId,
      expandToken(amount, toTokenDecimals)
    );

    return {
      amount: shrinkToken(result, fromTokenDecimals)
    };
  }
}
