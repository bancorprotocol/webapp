import {
  calculatePositionFees,
  decToPpm,
  expandToken,
  miningBntReward,
  miningTknReward,
  calculateMaxStakes
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
      originalPoolTokenAmount: "1370909146698872748",
      currentPoolTokenSupply: "11338379267323634752139485",
      depositedAmount: "3874264344838181",
      depositedReserveCurrentBalance: "10932903826342227802656",
      opposingDepositedReserveCurrentBalance: "6847120160277936759163837",
      reserveRate: "290.61911993101308091657"
    };

    const res = calculatePositionFees(
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    );
    expect(res).toBe("1933747839780032");
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
