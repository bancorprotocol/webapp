import { testy } from "@/api/pureHelpers";

describe("unit testing on helpers file", () => {
  test("compare string", async () => {
    const tested = testy();

    expect(tested).toBe(5);
  });
});
