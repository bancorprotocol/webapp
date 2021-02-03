import {
  decToPpm,
  expandToken,
  miningBntReward,
  miningTknReward,
  prettifyNumber,
  calculateLimits,
  calculateAmountToGetSpace
} from "@/api/pureHelpers";
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

/*describe("calculate grouped positions for protected table", () => {
  test("Group Protected Positions", () => {
    const positions: ViewProtectedLiquidity[] = [
      {
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:2",
        whitelisted: true,
        givenVBnt: "0.999999999999999999",
        single: true,
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        insuranceStart: 1605109590,
        fullCoverage: 1611157590,
        stake: {
          amount: "0.999999999999999999",
          symbol: "BNT",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          unixTime: 1602517590,
          usdValue: 0.99741083
        },
        fullyProtected: {
          amount: "1.005877144022078272",
          symbol: "BNT",
          usdValue: 1.0032727570970905
        },
        protectedAmount: {
          amount: "0.988304322300486270",
          symbol: "BNT",
          usdValue: 0.9857454343983155
        },
        coverageDecPercent: 0.5692694444444445,
        fees: {
          amount: "0.006127116288703279",
          symbol: "BNT"
        },
        roi: 0.005877144022078273,
        pendingPoolReward: new BigNumber(0),
        reserveTokenPrice: 1
      },
      {
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:3",
        whitelisted: true,
        single: true,
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        insuranceStart: 1605109590,
        fullCoverage: 1611157590,
        stake: {
          amount: "0.003102978944697264",
          symbol: "ETH",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          unixTime: 1602517590,
          usdValue: 1.7846539507916555
        },
        fullyProtected: {
          amount: "0.003121215598852726",
          symbol: "ETH",
          usdValue: 1.795142619090029
        },
        protectedAmount: {
          amount: "0.003066687503051707",
          symbol: "ETH",
          usdValue: 1.7637812133780322
        },
        coverageDecPercent: 0.5692694444444445,
        fees: {
          amount: "0.000019012312835558",
          symbol: "ETH"
        },
        roi: 0.005877144022078185
      },
      {
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:22",
        whitelisted: true,
        givenVBnt: "1.119976353898094348",
        single: true,
        apr: {
          day: 0.01752,
          week: 0.054652
        },
        insuranceStart: 1605127478,
        fullCoverage: 1611175478,
        stake: {
          amount: "1.119976353898094348",
          symbol: "BNT",
          poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
          unixTime: 1602535478,
          usdValue: 1.117076544721872
        },
        fullyProtected: {
          amount: "1.131695940901228608",
          symbol: "BNT",
          usdValue: 1.1287657877219255
        },
        protectedAmount: {
          amount: "1.127341412993218302",
          symbol: "BNT",
          usdValue: 1.1244225344269387
        },
        coverageDecPercent: 0.5671990740740741,
        fees: {
          amount: "0.011825823889716568",
          symbol: "BNT"
        },
        roi: 0.01046413789214751,
        pendingPoolReward: new BigNumber(0),
        reserveTokenPrice: 1
      },
      {
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:23",
        whitelisted: true,
        single: true,
        apr: {
          day: 0.01752,
          week: 0.054652
        },
        insuranceStart: 1605127478,
        fullCoverage: 1611175478,
        stake: {
          amount: "0.048010344040805995",
          symbol: "NMR",
          poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
          unixTime: 1602535478,
          usdValue: 1.4617575474277011
        },
        fullyProtected: {
          amount: "0.048520733032588171",
          symbol: "NMR",
          usdValue: 1.4772972186332958
        },
        protectedAmount: {
          amount: "0.048334066249605458",
          symbol: "NMR",
          usdValue: 1.4716138271823387
        },
        coverageDecPercent: 0.5671990740740741,
        fees: {
          amount: "0.000515015617056458",
          symbol: "NMR"
        },
        roi: 0.010630813046213022,
        pendingPoolReward: new BigNumber(0),
        reserveTokenPrice: 1
      },
      {
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:939",
        whitelisted: true,
        givenVBnt: "1.000000000000000000",
        single: true,
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        insuranceStart: 1607613882,
        fullCoverage: 1613661882,
        stake: {
          amount: "1.000000000000000000",
          symbol: "BNT",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          unixTime: 1605021882,
          usdValue: 0.99741083
        },
        fullyProtected: {
          amount: "1.002608722329711269",
          symbol: "BNT",
          usdValue: 1.000012797904117
        },
        protectedAmount: {
          amount: "1.000825163770841809",
          symbol: "BNT",
          usdValue: 0.9982338572815612
        },
        coverageDecPercent: 0.27942083333333334,
        fees: {
          amount: "0.002613383452134935",
          symbol: "BNT"
        },
        roi: 0.002608722329711269,
        pendingPoolReward: new BigNumber(0),
        reserveTokenPrice: 1
      }
    ];

    const grouped = groupPositionsArray(positions);

    const result: ViewGroupedPositions[] = [
      {
        collapsedData: [
          {
            id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:939",
            whitelisted: true,
            givenVBnt: "1.000000000000000000",
            single: true,
            apr: {
              day: 0.02117,
              week: 0.03276
            },
            insuranceStart: 1607613882,
            fullCoverage: 1613661882,
            stake: {
              amount: "1.000000000000000000",
              symbol: "BNT",
              poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
              unixTime: 1605021882,
              usdValue: 0.99741083
            },
            fullyProtected: {
              amount: "1.002608722329711269",
              symbol: "BNT",
              usdValue: 1.000012797904117
            },
            protectedAmount: {
              amount: "1.000825163770841809",
              symbol: "BNT",
              usdValue: 0.9982338572815612
            },
            coverageDecPercent: 0.27942083333333334,
            fees: {
              amount: "0.002613383452134935",
              symbol: "BNT"
            },
            roi: 0.002608722329711269,
            pendingPoolReward: new BigNumber(0),
            reserveTokenPrice: 1
          },
          {
            id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:2",
            whitelisted: true,
            givenVBnt: "0.999999999999999999",
            single: true,
            apr: {
              day: 0.02117,
              week: 0.03276
            },
            insuranceStart: 1605109590,
            fullCoverage: 1611157590,
            stake: {
              amount: "0.999999999999999999",
              symbol: "BNT",
              poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
              unixTime: 1602517590,
              usdValue: 0.99741083
            },
            fullyProtected: {
              amount: "1.005877144022078272",
              symbol: "BNT",
              usdValue: 1.0032727570970905
            },
            protectedAmount: {
              amount: "0.988304322300486270",
              symbol: "BNT",
              usdValue: 0.9857454343983155
            },
            coverageDecPercent: 0.5692694444444445,
            fees: {
              amount: "0.006127116288703279",
              symbol: "BNT"
            },
            roi: 0.005877144022078273,
            pendingPoolReward: new BigNumber(0),
            reserveTokenPrice: 1,
            pendingPoolReward: new BigNumber(0),
            reserveTokenPrice: 1
          }
        ],
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533-BNT",
        positionId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:2",
        poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
        symbol: "BNT",
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        insuranceStart: 1605109590,
        coverageDecPercent: 0.5692694444444445,
        fullCoverage: 1611157590,
        stake: {
          amount: 2,
          usdValue: 1.99482166,
          unixTime: 1602517590
        },
        fullyProtected: {
          amount: 2.0084858663517897,
          usdValue: 2.0032855550012076
        },
        protectedAmount: {
          amount: 1.9891294860713282,
          usdValue: 1.9839792916798769
        },
        roi: 0.0042429331758948585,
        fees: 0.008740499740838214
      },
      {
        collapsedData: [],
        id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533-ETH",
        positionId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533:3",
        poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
        symbol: "ETH",
        apr: {
          day: 0.02117,
          week: 0.03276
        },
        insuranceStart: 1605109590,
        coverageDecPercent: 0.5692694444444445,
        fullCoverage: 1611157590,
        stake: {
          amount: 0.003102978944697264,
          usdValue: 1.7846539507916555,
          unixTime: 1602517590
        },
        fullyProtected: {
          amount: 0.003121215598852726,
          usdValue: 1.795142619090029
        },
        protectedAmount: {
          amount: 0.003066687503051707,
          usdValue: 1.7637812133780322
        },
        roi: 0.005877144022078197,
        fees: 0.000019012312835558
      },
      {
        collapsedData: [],
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44-BNT",
        positionId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:22",
        poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
        symbol: "BNT",
        apr: {
          day: 0.01752,
          week: 0.054652
        },
        insuranceStart: 1605127478,
        coverageDecPercent: 0.5671990740740741,
        fullCoverage: 1611175478,
        stake: {
          amount: 1.1199763538980942,
          usdValue: 1.117076544721872,
          unixTime: 1602535478
        },
        fullyProtected: {
          amount: 1.1316959409012286,
          usdValue: 1.1287657877219255
        },
        protectedAmount: {
          amount: 1.1273414129932182,
          usdValue: 1.1244225344269387
        },
        roi: 0.010464137892147599,
        fees: 0.011825823889716569
      },
      {
        collapsedData: [],
        id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44-NMR",
        positionId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44:23",
        poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
        symbol: "NMR",
        apr: {
          day: 0.01752,
          week: 0.054652
        },
        insuranceStart: 1605127478,
        coverageDecPercent: 0.5671990740740741,
        fullCoverage: 1611175478,
        stake: {
          amount: 0.048010344040805994,
          usdValue: 1.4617575474277011,
          unixTime: 1602535478
        },
        fullyProtected: {
          amount: 0.04852073303258817,
          usdValue: 1.4772972186332958
        },
        protectedAmount: {
          amount: 0.048334066249605456,
          usdValue: 1.4716138271823387
        },
        roi: 0.010630813046213059,
        fees: 0.000515015617056458
      }
    ];
    expect(grouped).toEqual(result);
  });
});*/

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
      "123,456,789.12"
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
      "123,456,789.12"
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
    const { bnt, tkn, bntSpaceAvailable, limit } = {
      bnt: "1711365.486100309578494856",
      tkn: "7542395.245134802630180142",
      bntSpaceAvailable: "1403404.058171372713746323",
      limit: "1000000"
    };

    const res = calculateAmountToGetSpace(bnt, tkn, bntSpaceAvailable, limit);
    expect(res).toBe("403404.28507084303840483049");
  });
});
