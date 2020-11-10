import { compareString } from "@/api/helpers";

describe("unit testing on helpers file", () => {
  test("compare string", async () => {
    const tested = compareString("hello", "HELLO");

    expect(tested).toBe(true);
    expect(true).toBe(true);
  });
});
