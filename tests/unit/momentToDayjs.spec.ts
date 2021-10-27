//run `yarn test:unit -i momentToDayjs.spec.ts`

// import moment from "moment";
import dayjs from "@/utils/dayjs"

describe("check moment and dayjs", () => {  
  test("dayjs", () => {
    const unixTime = 1610107544
    const oneDayD = dayjs.duration(1, "day")
    const yesterDayD = dayjs().subtract(oneDayD)

    expect(dayjs.unix(unixTime).isBefore(dayjs())).toBeTruthy()
    expect(dayjs().isSameOrBefore(yesterDayD)).toBeFalsy()
  })