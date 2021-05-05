import {
  decToPpm,
  expandToken,
  miningBntReward,
  miningTknReward,
  prettifyNumber,
  calculateLimits,
  calculateAmountToGetSpace,
  groupPositionsArray
} from "@/api/pureHelpers";
import { ViewGroupedPositions, ViewProtectedLiquidity } from "@/types/bancor";
import BigNumber from "bignumber.js";

describe("dec to ppm works", () => {
  test("range of percentages", () => {
    expect(decToPpm(0.6)).toBe("600000");
    expect(decToPpm(1)).toBe("1000000");
  });
});

describe("can calculate mining aprs", () => {
  test("USDC Pool", () => {
    const rewardRate = "165343915343915330";
    const protectedBnt = "5464704021365105009750215";
    const protectedTkn = "8246694000590";
    const bntRewardShare = 0.7;
    const tknRewardShare = 0.3;
    const tknReserveBalance = "10034907031540";
    const bntReserveBalance = "5391863391448499616501339";

    const bntReward = miningBntReward(protectedBnt, rewardRate, bntRewardShare);
    const expectedResult = 1.3358;
    expect(bntReward).toBeCloseTo(expectedResult);

    const tknReward = miningTknReward(
      tknReserveBalance,
      bntReserveBalance,
      protectedTkn,
      rewardRate,
      tknRewardShare
    );

    expect(tknReward).toBeCloseTo(0.7061);
  });

  test("ETHBNT Pool", () => {
    const rewardRate = "165343915343915330";
    const protectedBnt = "6444242056039567241062271";
    const protectedTkn = "24483370760343498011551";
    const bntRewardShare = 0.7;
    const tknRewardShare = 0.3;
    const tknReserveBalance = "24286381681461977556211";
    const bntReserveBalance = "16997459221259878949065240";

    const bntReward = miningBntReward(protectedBnt, rewardRate, bntRewardShare);
    const expectedResult = 1.1328;
    expect(bntReward).toBeCloseTo(expectedResult);

    const tknReward = miningTknReward(
      tknReserveBalance,
      bntReserveBalance,
      protectedTkn,
      rewardRate,
      tknRewardShare
    );

    expect(tknReward).toBeCloseTo(0.1826);
  });
});

describe("can convert TKN amount to wei with correct precision and rounding", () => {
  test("Expand Token - Convert to WEI", async () => {
    const { amount, precision } = {
      amount: "9.9999999999999999999999999999999999999999999",
      precision: 18
    };

    const res = expandToken(amount, precision);
    expect(res).toBe("9999999999999999999");
  });
});

describe("calculate grouped positions for protected table", () => {
  test("Group Protected Positions", () => {
    const positions: ViewProtectedLiquidity[] = [
      {
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:2",
        initialProtectedWei: "0",
        inititalProtectedToken: "0",
        stake: {
          amount: "0.999999999999999999",
          symbol: "BNT",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          unixTime: 1602517590,
          usdValue: 0.99741083
        },
        protectedAmount: {
          id: "1",
          amount: "0.988304322300486270",
          symbol: "BNT",
          usdValue: 0.9857454343983155
        },
        fullyProtected: {
          id: "1",
          amount: "1.005877144022078272",
          symbol: "BNT",
          usdValue: 1.0032727570970905
        },
        fees: {
          id: "1",
          amount: "0.006127116288703279",
          symbol: "BNT"
        },
        roi: 0.005877144022078273,
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        single: true,
        whitelisted: true,
        insuranceStart: 1605109590,
        coverageDecPercent: 0.5692694444444445,
        fullCoverage: 1611157590,
        givenVBnt: "0.999999999999999999",
        pendingReserveReward: "0",
        rewardsMultiplier: 1,
        reserveTokenPrice: 1,
        bntTokenPrice: 1
      },
      {
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:3",
        initialProtectedWei: "0",
        inititalProtectedToken: "0",
        stake: {
          amount: "0.003102978944697264",
          symbol: "ETH",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          unixTime: 1602517590,
          usdValue: 1.7846539507916555
        },
        protectedAmount: {
          id: "1",
          amount: "0.003066687503051707",
          symbol: "ETH",
          usdValue: 1.7637812133780322
        },
        fullyProtected: {
          id: "1",
          amount: "0.003121215598852726",
          symbol: "ETH",
          usdValue: 1.795142619090029
        },
        fees: {
          id: "1",
          amount: "0.000019012312835558",
          symbol: "ETH"
        },
        roi: 0.005877144022078185,
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        single: true,
        whitelisted: true,
        insuranceStart: 1605109590,
        coverageDecPercent: 0.5692694444444445,
        fullCoverage: 1611157590,
        givenVBnt: "0.999999999999999999",
        pendingReserveReward: "0",
        rewardsMultiplier: 1,
        reserveTokenPrice: 1,
        bntTokenPrice: 1
      },
      {
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:22",
        initialProtectedWei: "0",
        inititalProtectedToken: "0",
        stake: {
          amount: "1.119976353898094348",
          symbol: "BNT",
          poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
          unixTime: 1602535478,
          usdValue: 1.117076544721872
        },
        protectedAmount: {
          id: "1",
          amount: "1.127341412993218302",
          symbol: "BNT",
          usdValue: 1.1244225344269387
        },
        fullyProtected: {
          id: "1",
          amount: "1.131695940901228608",
          symbol: "BNT",
          usdValue: 1.1287657877219255
        },
        fees: {
          id: "1",
          amount: "0.011825823889716568",
          symbol: "BNT"
        },
        roi: 0.01046413789214751,
        apr: {
          day: 0.01752,
          week: 0.054652
        },
        single: true,
        whitelisted: true,
        insuranceStart: 1605127478,
        coverageDecPercent: 0.5671990740740741,
        fullCoverage: 1611175478,
        givenVBnt: "1.119976353898094348",
        pendingReserveReward: "0",
        rewardsMultiplier: 1,
        reserveTokenPrice: 1,
        bntTokenPrice: 1
      },
      {
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:23",
        initialProtectedWei: "0",
        inititalProtectedToken: "0",
        stake: {
          amount: "0.048010344040805995",
          symbol: "NMR",
          poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
          unixTime: 1602535478,
          usdValue: 1.4617575474277011
        },
        protectedAmount: {
          id: "1",
          amount: "0.048334066249605458",
          symbol: "NMR",
          usdValue: 1.4716138271823387
        },
        fullyProtected: {
          id: "1",
          amount: "0.048520733032588171",
          symbol: "NMR",
          usdValue: 1.4772972186332958
        },
        fees: {
          id: "1",
          amount: "0.000515015617056458",
          symbol: "NMR"
        },
        roi: 0.010630813046213022,
        apr: {
          day: 0.01752,
          week: 0.054652
        },
        single: true,
        whitelisted: true,
        insuranceStart: 1605127478,
        coverageDecPercent: 0.5671990740740741,
        fullCoverage: 1611175478,
        givenVBnt: "0.999999999999999999",
        pendingReserveReward: "0",
        rewardsMultiplier: 1,
        reserveTokenPrice: 1,
        bntTokenPrice: 1
      },
      {
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:939",
        initialProtectedWei: "0",
        inititalProtectedToken: "0",
        stake: {
          amount: "1.000000000000000000",
          symbol: "BNT",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          unixTime: 1605021882,
          usdValue: 0.99741083
        },
        protectedAmount: {
          id: "1",
          amount: "1.000825163770841809",
          symbol: "BNT",
          usdValue: 0.9982338572815612
        },
        fullyProtected: {
          id: "1",
          amount: "1.002608722329711269",
          symbol: "BNT",
          usdValue: 1.000012797904117
        },
        fees: {
          id: "1",
          amount: "0.002613383452134935",
          symbol: "BNT"
        },
        roi: 0.002608722329711269,
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        single: true,
        whitelisted: true,
        insuranceStart: 1607613882,
        coverageDecPercent: 0.27942083333333334,
        fullCoverage: 1613661882,
        givenVBnt: "1.000000000000000000",
        pendingReserveReward: "0",
        rewardsMultiplier: 1,
        reserveTokenPrice: 1,
        bntTokenPrice: 1
      }
    ];

    const grouped = groupPositionsArray(positions);

    const result: ViewGroupedPositions[] = [
      {
        apr: { day: 0.02117, week: 0.03276 },
        collapsedData: [
          {
            apr: { day: 0.02117, week: 0.03276 },
            initialProtectedWei: "0",
            inititalProtectedToken: "0",
            bntTokenPrice: 1,
            coverageDecPercent: 0.27942083333333334,
            fees: { id: "1", amount: "0.002613383452134935", symbol: "BNT" },
            fullCoverage: 1613661882,
            fullyProtected: {
              id: "1",
              amount: "1.002608722329711269",
              symbol: "BNT",
              usdValue: 1.000012797904117
            },
            givenVBnt: "1.000000000000000000",
            id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:939",
            insuranceStart: 1607613882,
            pendingReserveReward: "0",
            protectedAmount: {
              id: "1",
              amount: "1.000825163770841809",
              symbol: "BNT",
              usdValue: 0.9982338572815612
            },
            reserveTokenPrice: 1,
            rewardsMultiplier: 1,
            roi: 0.002608722329711269,
            single: true,
            stake: {
              amount: "1.000000000000000000",
              poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
              symbol: "BNT",
              unixTime: 1605021882,
              usdValue: 0.99741083
            },
            whitelisted: true
          },
          {
            apr: { day: 0.02117, week: 0.03276 },
            initialProtectedWei: "0",
            inititalProtectedToken: "0",
            bntTokenPrice: 1,
            coverageDecPercent: 0.5692694444444445,
            fees: { id: "1", amount: "0.006127116288703279", symbol: "BNT" },
            fullCoverage: 1611157590,
            fullyProtected: {
              id: "1",
              amount: "1.005877144022078272",
              symbol: "BNT",
              usdValue: 1.0032727570970905
            },
            givenVBnt: "0.999999999999999999",
            id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:2",
            insuranceStart: 1605109590,
            pendingReserveReward: "0",
            protectedAmount: {
              id: "1",
              amount: "0.988304322300486270",
              symbol: "BNT",
              usdValue: 0.9857454343983155
            },
            reserveTokenPrice: 1,
            rewardsMultiplier: 1,
            roi: 0.005877144022078273,
            single: true,
            stake: {
              amount: "0.999999999999999999",
              poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
              symbol: "BNT",
              unixTime: 1602517590,
              usdValue: 0.99741083
            },
            whitelisted: true
          }
        ],
        coverageDecPercent: 0.5692694444444445,
        fees: 0.008740499740838214,
        fullCoverage: 1611157590,
        fullyProtected: {
          amount: 2.0084858663517897,
          usdValue: 2.0084858663517897
        },
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533-BNT",
        insuranceStart: 1605109590,
        pendingReserveReward: new BigNumber(0),
        poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
        positionId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:2",
        protectedAmount: {
          amount: 1.9891294860713282,
          usdValue: 1.9891294860713282
        },
        rewardsMultiplier: 1,
        roi: { fees: 0.004370249870419107, reserveRewards: new BigNumber(0) },
        stake: { amount: 2, unixTime: 1602517590, usdValue: 2 },
        symbol: "BNT"
      },
      {
        apr: { day: 0.02117, week: 0.03276 },
        collapsedData: [],
        coverageDecPercent: 0.5692694444444445,
        fees: 0.000019012312835558,
        fullCoverage: 1611157590,
        fullyProtected: {
          amount: 0.003121215598852726,
          usdValue: 0.003121215598852726
        },
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533-ETH",
        insuranceStart: 1605109590,
        pendingReserveReward: new BigNumber(0),
        poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
        positionId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:3",
        protectedAmount: {
          amount: 0.003066687503051707,
          usdValue: 0.003066687503051707
        },
        rewardsMultiplier: 1,
        roi: { fees: 0.006127116288703305, reserveRewards: new BigNumber(0) },
        stake: {
          amount: 0.003102978944697264,
          unixTime: 1602517590,
          usdValue: 0.003102978944697264
        },
        symbol: "ETH"
      },
      {
        apr: { day: 0.01752, week: 0.054652 },
        collapsedData: [],
        coverageDecPercent: 0.5671990740740741,
        fees: 0.011825823889716569,
        fullCoverage: 1611175478,
        fullyProtected: {
          amount: 1.1316959409012286,
          usdValue: 1.1316959409012286
        },
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44-BNT",
        insuranceStart: 1605127478,
        pendingReserveReward: new BigNumber(0),
        poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
        positionId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:22",
        protectedAmount: {
          amount: 1.1273414129932182,
          usdValue: 1.1273414129932182
        },
        rewardsMultiplier: 1,
        roi: { fees: 0.010558994257831082, reserveRewards: new BigNumber(0) },
        stake: {
          amount: 1.1199763538980942,
          unixTime: 1602535478,
          usdValue: 1.1199763538980942
        },
        symbol: "BNT"
      },
      {
        apr: { day: 0.01752, week: 0.054652 },
        collapsedData: [],
        coverageDecPercent: 0.5671990740740741,
        fees: 0.000515015617056458,
        fullCoverage: 1611175478,
        fullyProtected: {
          amount: 0.04852073303258817,
          usdValue: 0.04852073303258817
        },
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44-NMR",
        insuranceStart: 1605127478,
        pendingReserveReward: new BigNumber(0),
        poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
        positionId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:23",
        protectedAmount: {
          amount: 0.048334066249605456,
          usdValue: 0.048334066249605456
        },
        rewardsMultiplier: 1,
        roi: { fees: 0.010727180305534255, reserveRewards: new BigNumber(0) },
        stake: {
          amount: 0.048010344040805994,
          unixTime: 1602535478,
          usdValue: 0.048010344040805994
        },
        symbol: "NMR"
      }
    ];
    expect(grouped).toEqual(result);
  });
});

describe("Prettify Numbers", () => {
  test("convert numbers to strings with comma separator and pre-defined decimal precision", () => {
    const numbers: number[] = [
      0,
      0.000000000000000001,
      1.123456789000000001,
      1.100000000000000001,
      1.999999999999999999,
      2.999999999999999999,
      100.123400000000000001,
      123456789.123456789000000001
    ];

    const resultNumbers: string[] = numbers.map(n => prettifyNumber(n));
    const expectedNumbers: string[] = [
      "0",
      "< 0.000001",
      "1.123456",
      "1.1",
      "2",
      "3",
      "100.12",
      "123,456,789"
    ];

    expect(resultNumbers).toEqual(expectedNumbers);
  });

  test("convert string numbers to strings with comma separator and pre-defined decimal precision", () => {
    const numbersStrings: string[] = [
      "0",
      "0.000000000000000001",
      "1.123456789000000001",
      "1.100000000000000001",
      "1.999999999999999999",
      "2.999999999999999999",
      "100.123400000000000001",
      "123456789.123456789000000001"
    ];

    const resultNumbers: string[] = numbersStrings.map(n => prettifyNumber(n));
    const expectedNumbers: string[] = [
      "0",
      "< 0.000001",
      "1.123456",
      "1.1",
      "2",
      "3",
      "100.12",
      "123,456,789"
    ];

    expect(resultNumbers).toEqual(expectedNumbers);
  });

  test("convert usd value numbers to strings with comma separator and pre-defined decimal precision", () => {
    const numbers: number[] = [
      0,
      0.000000000000000001,
      1.123456789000000001,
      1.100000000000000001,
      1.999999999999999999,
      2.999999999999999999,
      100.123400000000000001,
      123456789.123456789000000001
    ];

    const resultNumbers: string[] = numbers.map(n => prettifyNumber(n, true));
    const expectedNumbers: string[] = [
      "$0.00",
      "< $0.01",
      "$1.12",
      "$1.10",
      "$2.00",
      "$3.00",
      "$100",
      "$123,456,789"
    ];

    expect(resultNumbers).toEqual(expectedNumbers);
  });

  test("convert usd value string numbers to strings with comma separator and pre-defined decimal precision", () => {
    const numbersStrings: string[] = [
      "0",
      "0.000000000000000001",
      "1.123456789000000001",
      "1.100000000000000001",
      "1.999999999999999999",
      "2.999999999999999999",
      "100.123400000000000001",
      "123456789.123456789000000001"
    ];

    const resultNumbers: string[] = numbersStrings.map(n =>
      prettifyNumber(n, true)
    );
    const expectedNumbers: string[] = [
      "$0.00",
      "< $0.01",
      "$1.12",
      "$1.10",
      "$2.00",
      "$3.00",
      "$100",
      "$123,456,789"
    ];

    expect(resultNumbers).toEqual(expectedNumbers);
  });
});

describe("calculateLimits", () => {
  test("calculate proper limits", () => {
    const { tknLimitWei, bntLimitWei } = calculateLimits(
      "50000000000000000000000",
      "10000000000000000000000",
      "26554714837518616832230",
      "16725525059808512049638",
      "27688994896013371337745"
    );

    BigNumber.set({ EXPONENTIAL_AT: 25 });
    expect(tknLimitWei.toString()).toEqual(
      "14147951967419454727944.8873357485195903336563"
    );
    expect(bntLimitWei.toString()).toEqual("26554714837518616832230");
  });

  test("calculate proper limits when falling back to default", () => {
    const { tknLimitWei, bntLimitWei } = calculateLimits(
      "0",
      "50000000000000000000000",
      "26554714837518616832230",
      "16725525059808512049638",
      "27688994896013371337745"
    );

    BigNumber.set({ EXPONENTIAL_AT: 25 });
    expect(tknLimitWei.toString()).toEqual(
      "14147951967419454727944.8873357485195903336563"
    );
    expect(bntLimitWei.toString()).toEqual("26554714837518616832230");
  });
});

describe("calculate how much bnt you need to stake in order to have room for 1tkn", () => {
  test("Amount to get space", async () => {
    const { bnt, tkn, networkTokensMinted, limit } = {
      bnt: "1711365.486100309578494856",
      tkn: "7542395.245134802630180142",
      networkTokensMinted: "1403404.058171372713746323",
      limit: "1000000"
    };

    const res = calculateAmountToGetSpace(bnt, tkn, networkTokensMinted, limit);
    expect(res).toBe("403404.28507084303840483049");
  });
  test("Amount to get space", async () => {
    const { bnt, tkn, networkTokensMinted, limit } = {
      bnt: "17231379.679880050707841059",
      tkn: "28640.948892010240170099",
      networkTokensMinted: "8019890.870870961053410978",
      limit: "8000000"
    };

    const res = calculateAmountToGetSpace(bnt, tkn, networkTokensMinted, limit);
    expect(res).toBe("20492.5052562200894672684");
  });
});
