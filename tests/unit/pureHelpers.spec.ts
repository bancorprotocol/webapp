import {
  calculatePositionFees,
  decToPpm,
  expandToken,
  miningBntReward,
  miningTknReward,
  calculateMaxStakes,
  groupPositionsArray
} from "@/api/pureHelpers";
import BigNumber from "bignumber.js";
import { ViewGroupedPositions, ViewProtectedLiquidity } from "@/types/bancor";

const shrinkToken = (
  amount: string | number,
  precision: number,
  chopZeros = false
) => {
  const res = new BigNumber(amount)
    .div(new BigNumber(10).pow(precision))
    .toFixed(precision);

  return chopZeros ? new BigNumber(res).toString() : res;
};

describe("dec to ppm works", () => {
  test("range of percentages", () => {
    expect(decToPpm(0.6)).toBe("600000");
    expect(decToPpm(1)).toBe("1000000");
  });
});

describe("can calculate position fees", () => {
  test("Protected Position Fee", async () => {
    const {
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    } = {
      originalPoolTokenAmount: "500000000000000000",
      currentPoolTokenSupply: "15576682305422710575136560",
      depositedAmount: "1340922988163890",
      depositedReserveCurrentBalance: "15225916667665690655887",
      opposingDepositedReserveCurrentBalance: "9337353089824759522590240",
      reserveRate: "322.22513507007347536179"
    };

    const res = calculatePositionFees(
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    );
    expect(res).toBe("7570785880343");
  });
});

describe("can calculate mining aprs", () => {
  test("bnt high cap", () => {
    const protectedBnt = "3390211026483950866776662";

    const res = miningBntReward(protectedBnt, true);

    const expectedResult = 2.147358952917518;
    expect(res).toBeCloseTo(expectedResult);
  });

  test("bnt low cap", () => {
    const protectedBnt = "3390211026483950866776662";

    const res = miningBntReward(protectedBnt, false);

    const expectedResult = 0.21473589529175177;
    expect(res).toBeCloseTo(expectedResult);
  });

  test("tkn high cap", () => {
    const protectedTkn = "11221593721149874107090";
    const bntReserveBalance = "8101409855370277274285454";
    const tknReserveBalance = "15800503317283360679542";

    const res = miningTknReward(
      tknReserveBalance,
      bntReserveBalance,
      protectedTkn,
      true
    );

    const expectedResult = 0.5422634970441929;

    expect(res).toBeCloseTo(expectedResult);
  });

  test("tkn low cap", () => {
    const protectedTkn = "11221593721149874107090";
    const bntReserveBalance = "8101409855370277274285454";
    const tknReserveBalance = "15800503317283360679542";

    const res = miningTknReward(
      tknReserveBalance,
      bntReserveBalance,
      protectedTkn,
      false
    );

    const expectedResult = 0.05422634970441928;

    expect(res).toBeCloseTo(expectedResult);
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

describe("calculate max stakes are as expected", () => {
  test("results are as expected from #621", () => {
    const yfiReserve = expandToken("22.823617377346322429", 18);
    const bntReserve = expandToken("549542.316191026070027217", 18);
    const poolTokenSupply = expandToken("2988.7630212873065", 18);
    const systemBalance = expandToken("1430.881844360983306284", 18);

    const { maxAllowedTknWei } = calculateMaxStakes(
      yfiReserve,
      bntReserve,
      poolTokenSupply,
      systemBalance,
      expandToken(5000000, 18),
      "500000",
      false
    );

    const numberRes = Number(shrinkToken(maxAllowedTknWei, 18));
    expect(numberRes).toBeCloseTo(0.96982720119);
  });
});

describe("calculate grouped positions for protected table", () => {
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
        roi: 0.005877144022078273
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
        roi: 0.01046413789214751
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
        roi: 0.010630813046213022
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
        roi: 0.002608722329711269
      }
    ];

    const grouped = groupPositionsArray(positions);

    const result: ViewGroupedPositions[] = [
      {
        collapsedData: [
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
            roi: 0.005877144022078273
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
            roi: 0.002608722329711269
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
});
