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
