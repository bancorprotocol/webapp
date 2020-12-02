import {
  calculatePositionFees,
  decToPpm,
  expandToken,
  miningBntReward,
  miningTknReward,
  calculateMaxStakes,
  calculateMaxStakesInternal
} from "@/api/pureHelpers";
import BigNumber from "bignumber.js";

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
    const systemAmount = expandToken(500000, 18)

    const { maxAllowedTknWei, maxAllowedBntWei } = calculateMaxStakes(
      yfiReserve,
      bntReserve,
      poolTokenSupply,
      systemBalance,
      systemAmount,
      "500000",
      false
    );

    const numberRes = Number(shrinkToken(maxAllowedTknWei, 18));
    expect(numberRes).toBeCloseTo(0.96982720119);

    const numberResBnt = Number(shrinkToken(maxAllowedBntWei, 18));
    expect(numberResBnt).toBeCloseTo(11675.6509095);
  });

  test("results are as expected from #621", () => {
    const yfiReserve = expandToken("22.823617377346322429", 18);
    const bntReserve = expandToken("549542.316191026070027217", 18);
    const poolTokenSupply = expandToken("2988.7630212873065", 18);
    const systemBalance = expandToken("1430.881844360983306284", 18);

    const { maxRatioBnt, systemBNT } = calculateMaxStakesInternal(
      yfiReserve,
      bntReserve,
      poolTokenSupply,
      systemBalance,
      "500000"
    );

    console.log(systemBNT)

    const numberRes = Number(shrinkToken(maxRatioBnt.toString(), 18));
    expect(numberRes).toBeCloseTo(11675.6509095);
  });

  xtest("results are as expected from #621 2", () => {
    const poolTokenSupply = expandToken("459753.978704086465437837", 18);
    const xxxReserve = expandToken("406199.305995522538513417", 18);
    const bntReserve = expandToken("877074.144617658202500557", 18);
    const systemBalance = expandToken("229366.326332824650763918", 18);
    const systemAmount = expandToken(50000, 18)

    const { maxAllowedTknWei } = calculateMaxStakes(
      xxxReserve,
      bntReserve,
      poolTokenSupply,
      systemBalance,
      systemAmount,
      "5000000",
      false
    );

    const numberRes = Number(shrinkToken(maxAllowedTknWei, 18));
    expect(numberRes).toBeCloseTo(0);
  });

  xtest("results are as expected from #621 3", () => {
    const poolTokenSupply = expandToken("3411.112092474850883773", 18);
    const yfiReserve = expandToken("25.23247380420303708", 18);
    const bntReserve = expandToken("647758.396109747717331815", 18);
    const systemBalance = expandToken("1641.951046786342390985", 18);
    const systemAmount = expandToken(5000000000, 18)

    const { maxAllowedTknWei } = calculateMaxStakes(
      yfiReserve,
      bntReserve,
      poolTokenSupply,
      systemBalance,
      systemAmount,
      "5000000",
      false
    );

    const numberRes = Number(shrinkToken(maxAllowedTknWei, 18));
    expect(numberRes).toBeCloseTo(0.94099017502);
  });

  xtest("results are as expected from #621 4", () => {
    const poolTokenSupply = expandToken("459753.978704086465437837", 18);
    const xxxReserve = expandToken("406199.305995522538513417", 18);
    const bntReserve = expandToken("877074.144617658202500557", 18);
    const systemBalance = expandToken("229366.326332824650763918", 18);
    const systemAmount = expandToken(5000000000, 18)

    const { maxAllowedTknWei } = calculateMaxStakes(
      xxxReserve,
      bntReserve,
      poolTokenSupply,
      systemBalance,
      systemAmount,
      "5000000",
      false
    );

    const numberRes = Number(shrinkToken(maxAllowedTknWei, 18));
    expect(numberRes).toBeCloseTo(0);
  });

  xtest("results are as expected from #621 5", () => {
    const poolTokenSupply = expandToken("3411.112092474850883773", 18);
    const yifiReserve = expandToken("25.23247380420303708", 18);
    const bntReserve = expandToken("647758.396109747717331815", 18);
    const systemBalance = expandToken("1641.951046786342390985", 18);
    const systemAmount = expandToken(500000, 18)

    const { maxAllowedTknWei } = calculateMaxStakes(
      yifiReserve,
      bntReserve,
      poolTokenSupply,
      systemBalance,
      systemAmount,
      "5000000",
      false
    );

    const numberRes = Number(shrinkToken(maxAllowedTknWei, 18));
    expect(numberRes).toBeCloseTo(24156.7390998);
  });
});
