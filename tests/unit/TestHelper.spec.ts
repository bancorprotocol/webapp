import { calculatePositionFees } from "@/api/pureHelpers";

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
      originalPoolTokenAmount: "1370909146698872747",
      currentPoolTokenSupply: "11338379267323634752139485",
      depositedAmount: "1124989041279995704",
      depositedReserveCurrentBalance: "6847120160277936759163837",
      opposingDepositedReserveCurrentBalance: "10932903826342227802656",
      reserveRate: "0.00344092983365092823"
    };

    // current result is -467584274913337187

    const res = calculatePositionFees(
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    );
    expect(res).toBe("?");
  });
});
