import {
  calculatePositionFees,
  decToPpm,
  miningBntReward,
  miningTknReward
} from "@/api/pureHelpers";

describe("dec to ppm works", () => {
  test("range of percentages", () => {
    expect(decToPpm(0.6)).toBe("600000");
    expect(decToPpm(1)).toBe("1000000");
  });
});

describe("can calculate position fees", () => {
  test("test two", async () => {
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

    // current result is -1933747839780032

    const res = calculatePositionFees(
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    );
    expect(res).toBe("-1933747839780032");
  });
});

describe("can calculate mining aprs", () => {
  test("bnt", () => {
    const protectedBnt = "3390211026483950866776662";

    const res = miningBntReward(protectedBnt, true);

    const expectedResult = 1.07367947646;
    expect(res).toBeCloseTo(expectedResult);
  });

  test("tkn", () => {
    const protectedTkn = "11221593721149874107090";
    const bntReserveBalance = "8101409855370277274285454";
    const tknReserveBalance = "15800503317283360679542";

    const res = miningTknReward(
      tknReserveBalance,
      bntReserveBalance,
      protectedTkn,
      true
    );

    const expectedResult = 0.271131748522;

    expect(res).toBeCloseTo(expectedResult);
  });
});
