import { fromPairs, toPairs, uniqWith } from "lodash";
import { EthNetworks, getWeb3, web3 } from "@/api/web3";
import Web3 from "web3";
import { MultiCall } from "eth-multicall";
import {
  LiquidityProtectionSettings,
  MinimalPool,
  PoolHistoricBalance,
  PositionReturn,
  ProtectedLiquidity,
  RawLiquidityProtectionSettings,
  RegisteredContracts,
  TimeScale
} from "@/types/bancor";
import { asciiToHex } from "web3-utils";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import {
  buildAddressLookupContract,
  buildConverterContract,
  buildLiquidityProtectionContract,
  buildLiquidityProtectionSettingsContract,
  buildLiquidityProtectionStoreContract,
  buildNetworkContract,
  buildRegistryContract,
  buildStakingRewardsContract,
  buildTokenContract,
  buildV2Converter
} from "./contractTypes";
import {
  compareString,
  findOrThrow,
  LockedBalance,
  rewindBlocksByDays,
  sortAlongSide,
  traverseLockedBalances,
  zeroAddress
} from "../helpers";
import {
  liquidityProtectionSettingsShape,
  liquidityProtectionShape,
  protectedPositionShape,
  protectedReservesShape
} from "./shapes";
import { MinimalPoolWithReserveBalances, shrinkToken } from "./helpers";
import { PoolProgram } from "@/store/modules/rewards";
import { miningBntReward, miningTknReward } from "../pureHelpers";
import { ppmToDec } from "@/store/modules/swap/ethBancor";

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
  if (contractAddress == "")
    throw new Error("Passed contract is an empty string");
  const isValidAddress = web3.utils.isAddress(contractAddress);
  if (!isValidAddress)
    throw new Error(`${contractAddress} is an invalid contract address`);
};

export const getRemoveLiquidityReturn = async (
  protectionContract: string,
  id: string,
  ppm: string,
  removeTimestamp: number,
  web3?: Web3
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

export const fetchPositionCount = async (
  currentUser: string,
  liquidityStore: string
) => {
  throwIfNotContract(liquidityStore);
  const contract = buildLiquidityProtectionStoreContract(liquidityStore);
  try {
    const positionIds = await contract.methods
      .protectedLiquidityCount(currentUser)
      .call();
    return positionIds;
  } catch (e) {
    throw new Error(`Failed fetching position ids ${e}`);
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
    // @ts-ignore
    .map(res => ({ ...res.position, "8": res.positionId }))
    // @ts-ignore
    .map(res =>
      fromPairs(keys.map((key, index) => [key, res[index]]))
    ) as ProtectedLiquidity[];

  return protectedLiquidity.filter(pos => typeof pos.owner == "string");
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
    const allUndefined = toPairs(registeredContracts).some(
      ([key, data]) => data == undefined
    );
    if (allUndefined) throw new Error("All requests returned undefined");

    return registeredContracts;
  } catch (e) {
    throw new Error(e.message);
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
  throwIfNotContract(liquidityProtectionSettingsAddress);
  try {
    const liquidityProtection = buildLiquidityProtectionSettingsContract(
      liquidityProtectionSettingsAddress
    );
    const whitelistedPools = await liquidityProtection.methods
      .poolWhitelist()
      .call();

    return whitelistedPools;
  } catch (e) {
    throw new Error(
      `Failed fetching whitelisted pools with address ${liquidityProtectionSettingsAddress}`
    );
  }
};

const calculateReturnOnInvestment = (
  investment: string,
  newReturn: string
): string => {
  return new BigNumber(newReturn).div(investment).minus(1).toString();
};

interface RemoveLiquidityReturn {
  positionId: string;
  fullLiquidityReturn: PositionReturn;
  currentLiquidityReturn: PositionReturn;
  roiDec: string;
}

export const removeLiquidityReturn = async (
  position: ProtectedLiquidity,
  liquidityProtectionContract: string
): Promise<RemoveLiquidityReturn> => {
  const now = dayjs();
  const fullWaitTime = now.clone().add(1, "year").unix();

  const timeNow = dayjs().unix();

  const oneMillion = "1000000";
  const [fullLiquidityReturn, currentLiquidityReturn] = await Promise.all([
    getRemoveLiquidityReturn(
      liquidityProtectionContract,
      position.id,
      oneMillion,
      fullWaitTime
    ),
    getRemoveLiquidityReturn(
      liquidityProtectionContract,
      position.id,
      oneMillion,
      timeNow
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
};

interface PendingReserveReward {
  poolId: string;
  reserveId: string;
  decBnt: string;
}

export const pendingRewardRewards = async (
  stakingRewardsContract: string,
  currentUser: string,
  poolId: string,
  reserveId: string
): Promise<PendingReserveReward> => {
  const contract = buildStakingRewardsContract(stakingRewardsContract);

  const wei = await contract.methods
    .pendingReserveRewards(currentUser, poolId, reserveId)
    .call();
  const decBnt = shrinkToken(wei, 18);

  return {
    poolId,
    reserveId,
    decBnt
  };
};

export const fetchRelayReserveBalances = async (
  pool: MinimalPool,
  blockHeight?: number
) => {
  const contract = buildConverterContract(pool.converterAddress);
  console.log("pool.converterAddress", pool.converterAddress);
  return Promise.all(
    pool.reserves.map(async reserve => ({
      contract: reserve,
      weiAmount: await contract.methods
        .getConnectorBalance(reserve)
        .call(undefined, blockHeight)
    }))
  );
};

export const fetchTokenSupply = async (
  tokenAddress: string,
  blockHeight?: number
) => {
  const smartTokenContract = buildTokenContract(tokenAddress);
  return smartTokenContract.methods.totalSupply().call(undefined, blockHeight);
};

export const fetchHistoricBalances = async (
  timeScales: TimeScale[],
  pools: MinimalPool[]
) => {
  const atLeastOneAnchorAndScale = timeScales.length > 0 && pools.length > 0;
  if (!atLeastOneAnchorAndScale)
    throw new Error("Must pass at least one time scale and anchor");
  return Promise.all(
    timeScales.map(scale =>
      Promise.all(
        pools.map(async pool => {
          const blockHeight = scale.blockHeight;
          let smartTokenSupply = "";
          try {
            smartTokenSupply = await fetchTokenSupply(
              pool.anchorAddress,
              blockHeight
            );
          } catch (e) {
            console.error("Failed to fetch token supply.", e);
          }

          console.log("blockHeight", blockHeight);

          let reserveBalances: { weiAmount: string; contract: string }[] = [
            { weiAmount: "0", contract: pool.reserves[0] },
            { weiAmount: "0", contract: pool.reserves[1] }
          ];
          try {
            reserveBalances = await fetchRelayReserveBalances(
              pool,
              blockHeight
            );
          } catch (e) {
            console.log(pool);
            console.error("Failed to fetch Relay Reserve Balances.", e);
          }
          return {
            scale,
            pool,
            smartTokenSupply,
            reserveBalances
          };
        })
      )
    )
  );
};

export const getPoolAprs = async (
  positions: ProtectedLiquidity[],
  historicBalances: PoolHistoricBalance[],
  liquidityProtectionContract: string
) => {
  try {
    const res = await Promise.all(
      positions.map(position =>
        Promise.all(
          historicBalances.map(async historicBalance => {
            const poolTokenSupply = historicBalance.smartTokenSupply;

            const [
              tknReserveBalance,
              opposingTknBalance
            ] = sortAlongSide(
              historicBalance.reserveBalances,
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
            const lpContract = buildLiquidityProtectionContract(
              liquidityProtectionContract
            );

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
                address: liquidityProtectionContract,
                poolToken,
                reserveToken,
                reserveAmount,
                poolRateN,
                poolRateD,
                reserveRateN,
                reserveRateD
              });
            }

            const scale = historicBalance.scale;
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
              positionId: position.id,
              scaleId: historicBalance.scale.label
            };
          })
        )
      )
    );
    return res;
  } catch (e) {
    throw new Error(`Failed fetching pool aprs ${e}`);
  }
};

export const getHistoricBalances = async (
  positions: ProtectedLiquidity[],
  blockNow: number,
  pools: MinimalPool[]
): Promise<PoolHistoricBalance[][]> => {
  const timeScales: TimeScale[] = ([
    [1, "day"],
    [7, "week"]
  ] as [number, string][]).map(([days, label]) => ({
    blockHeight: rewindBlocksByDays(blockNow, days),
    days,
    label
  }));
  const uniqueAnchors = uniqWith(
    positions.map(pos => pos.poolToken),
    compareString
  );
  const relevantPools = pools.filter(pool =>
    uniqueAnchors.some(anchor => compareString(pool.anchorAddress, anchor))
  );
  return fetchHistoricBalances(timeScales, relevantPools);
};

export const fetchRewardsMultiplier = async (
  poolId: string,
  reserveId: string,
  stakingRewardsContract: string,
  currentUser: string
): Promise<BigNumber> => {
  const contract = buildStakingRewardsContract(stakingRewardsContract);
  const result = await contract.methods
    .rewardsMultiplier(currentUser, poolId, reserveId)
    .call();

  return new BigNumber(shrinkToken(result, 6));
};

export const fetchLockedBalances = async (
  storeAddress: string,
  currentUser: string
): Promise<LockedBalance[]> => {
  const owner = currentUser;

  const contractAddress = storeAddress;
  const storeContract = buildLiquidityProtectionStoreContract(contractAddress);
  const lockedBalanceCount = Number(
    await storeContract.methods.lockedBalanceCount(owner).call()
  );

  const lockedBalances =
    lockedBalanceCount > 0
      ? await traverseLockedBalances(contractAddress, owner, lockedBalanceCount)
      : [];
  return lockedBalances;
};

export const fetchPoolLiqMiningApr = async (
  multiCallAddress: string,
  poolPrograms: PoolProgram[],
  relays: MinimalPoolWithReserveBalances[],
  protectionStoreAddress: string,
  liquidityNetworkToken: string
) => {
  const ethMulti = new MultiCall(web3, multiCallAddress, [
    500,
    300,
    100,
    50,
    20,
    1
  ]);

  const highTierPools = relays.filter(relay =>
    poolPrograms.some(poolProgram =>
      compareString(relay.anchorAddress, poolProgram.poolToken)
    )
  );

  if (highTierPools.length == 0) return [];

  const storeAddress = protectionStoreAddress;

  const protectedShapes = highTierPools.map(pool => {
    const [reserveOne, reserveTwo] = pool.reserveBalances;
    return protectedReservesShape(
      storeAddress,
      pool.anchorAddress,
      reserveOne.id,
      reserveTwo.id
    );
  });

  const [protectedReserves] = ((await ethMulti.all([
    protectedShapes
  ])) as unknown[]) as {
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

  const res = zippedProtectedReserves.map(pool => {
    const poolProgram: PoolProgram = findOrThrow(poolPrograms, pp =>
      compareString(pool.anchorAddress, pp.poolToken)
    );

    const poolReserveBalances = findOrThrow(highTierPools, p =>
      compareString(pool.anchorAddress, p.anchorAddress)
    );

    const networkToken = liquidityNetworkToken;

    const [
      bntReserve,
      tknReserve
    ] = sortAlongSide(
      poolReserveBalances.reserveBalances,
      reserve => reserve.id,
      [networkToken]
    );

    const [bntProtected, tknProtected] = sortAlongSide(
      pool.reserves,
      reserve => reserve.contract,
      [networkToken]
    );

    const [
      bntProtectedShare,
      tknProtectedShare
    ] = sortAlongSide(poolProgram.reserves, reserve => reserve.reserveId, [
      networkToken
    ]);

    const poolRewardRate = poolProgram.rewardRate;

    const bntReward = miningBntReward(
      bntProtected.amount,
      poolRewardRate,
      ppmToDec(bntProtectedShare.rewardShare)
    );

    const tknReward = miningTknReward(
      tknReserve.amount,
      bntReserve.amount,
      tknProtected.amount,
      poolRewardRate,
      ppmToDec(tknProtectedShare.rewardShare)
    );

    return {
      ...pool,
      bntReward,
      tknReward,
      endTime: poolProgram.endTimes
    };
  });

  const liqMiningApr = res.map(calculated => {
    const [bntReserve, tknReserve] = sortAlongSide(
      calculated.reserves,
      reserve => reserve.contract,
      [liquidityNetworkToken]
    );

    return {
      poolId: calculated.anchorAddress,
      endTime: Number(calculated.endTime),
      rewards: [
        {
          address: bntReserve.contract,
          amount: bntReserve.amount,
          reward: calculated.bntReward
        },
        {
          address: tknReserve.contract,
          amount: tknReserve.amount,
          reward: calculated.tknReward
        }
      ]
    };
  });

  return liqMiningApr;
};
