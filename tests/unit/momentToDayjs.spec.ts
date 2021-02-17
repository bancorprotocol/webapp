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

  /*
  test("durationToSeconds", () => {
    // console.log(moment.duration(3, "days").asSeconds())
    // console.log(dayjs.duration(3, "days").asSeconds())
    expect(moment.duration(3, "days").asSeconds()).toBe(dayjs.duration(3, "days").asSeconds())

    // moment.duration("30", "days").asSeconds()
    expect(moment.duration("30", "days").asSeconds()).toBe(dayjs.duration("30", "days").asSeconds())

    // moment.duration("100", "days").asSeconds()
    expect(moment.duration("100", "days").asSeconds()).toBe(dayjs.duration("100", "days").asSeconds())

    // moment.duration("24", "hours").asSeconds()
    expect(moment.duration("24", "hours").asSeconds()).toBe(dayjs.duration("24", "hours").asSeconds())

    // console.log(moment().clone().add(1, "year").unix())
    expect(moment().clone().add(1, "year").unix()).toBe(dayjs().clone().add(1, "year").unix())

    const oneDayM = moment.duration(1, "day")
    const yesterDayM = moment().subtract(oneDayM)

    const oneDayD = dayjs.duration(1, "day")
    const yesterDayD = dayjs().subtract(oneDayD)    

    // console.log(moment().isSameOrAfter(yesterDayM))
    // console.log(dayjs().isSameOrAfter(yesterDayD))
    expect(moment().isSameOrAfter(yesterDayM)).toBe(dayjs().isSameOrAfter(yesterDayD))
    expect(dayjs().isSameOrAfter(yesterDayD)).toBeTruthy()

    expect(moment().isSameOrBefore(yesterDayM)).toBe(dayjs().isSameOrBefore(yesterDayD))
    expect(dayjs().isSameOrBefore(yesterDayD)).toBeFalsy()

    const unixTime = 1610107544
    // console.log(moment.unix(unixTime).isBefore(moment()))
    // console.log(dayjs.unix(unixTime).isBefore(dayjs()))    

    expect(moment.unix(unixTime).isBefore(moment())).toBe(dayjs.unix(unixTime).isBefore(dayjs()))
    expect(dayjs.unix(unixTime).isBefore(dayjs())).toBeTruthy()

    expect(moment.unix(unixTime).isAfter(moment())).toBe(dayjs.unix(unixTime).isAfter(dayjs()))
    expect(dayjs.unix(unixTime).isAfter(dayjs())).toBeFalsy()    

    // console.log(moment.duration(10, "seconds").humanize())
    // console.log(dayjs.duration(10, "seconds").humanize())
    expect(moment.duration(10, "seconds").humanize()).toBe(dayjs.duration(10, "seconds").humanize())

    const diffTime = 1000
    const diffM = moment.duration(diffTime * 1000, "milliseconds")
    const diffD = dayjs.duration(diffTime * 1000, "milliseconds")
    
    // console.log(diffM.hours())
    // console.log(diffM.minutes())
    // console.log(diffM.seconds())
    expect(diffM.hours()).toBe(diffD.hours())
    expect(diffM.minutes()).toBe(diffD.minutes())
    expect(diffM.seconds()).toBe(diffD.seconds())
  })

  test("unixTime", () => {
    // console.log('m',moment().unix())
    // console.log('d',dayjs().unix())
    expect(moment().unix()).toBe(dayjs().unix())

    const unixTime = 1610707544
    // console.log('m', moment.unix(unixTime).format("MMM D yyyy"))
    // console.log('d', dayjs.unix(unixTime).format("MMM D YYYY"))
    expect(moment.unix(unixTime).format("MMM D yyyy")).toBe(dayjs.unix(unixTime).format("MMM D YYYY"))
    // console.log('m', moment.unix(unixTime).format("HH:mm"))
    // console.log('d', dayjs.unix(unixTime).format("HH:mm"))
    expect(moment.unix(unixTime).format("HH:mm")).toBe(dayjs.unix(unixTime).format("HH:mm"))

    // console.log('m', moment.unix(unixTime).fromNow())
    // console.log('d', dayjs.unix(unixTime).fromNow())
    expect(moment.unix(unixTime).fromNow()).toBe(dayjs.unix(unixTime).fromNow())
    expect(moment.unix(unixTime).fromNow(true)).toBe(dayjs.unix(unixTime).fromNow(true))
  })

  test("endTime", () => {
    const liquidityMiningEndTimeM = moment(
      "2021-02-08 20:15 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();
    const liquidityMiningEndTimeD = dayjs(
      "2021-02-08 20:15 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();
    // console.log(liquidityMiningEndTimeM)

    expect(liquidityMiningEndTimeM).toBe(liquidityMiningEndTimeD)
    
    const secondRoundLiquidityMiningEndTimeM = moment(
      "2021-02-25 18:05 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();
    const secondRoundLiquidityMiningEndTimeD = dayjs(
      "2021-02-25 18:05 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();

    expect(secondRoundLiquidityMiningEndTimeM).toBe(secondRoundLiquidityMiningEndTimeD)
  })

  
  test("countDown", () => {
    const eventTime = (Date.now()+1000) / 1000;
    const currentTime = Date.now() / 1000;
    const diffTime = eventTime - currentTime;
    let durationM = moment.duration(diffTime * 1000, "milliseconds");
    let durationD = dayjs.duration(diffTime * 1000, "milliseconds");

    const interval = 1000;

    setInterval(() => {
      const durationMM = moment.duration(Number(durationM) - interval, "milliseconds");
      const durationDD = dayjs.duration(duration.asMilliseconds() - interval, "milliseconds");

      const lockDurationM =
        durationMM.hours() +
        "h:" +
        durationMM.minutes() +
        "m:" +
        durationMM.seconds() +
        "s";
      const lockDurationD =
        durationDD.hours() +
        "h:" +
        durationDD.minutes() +
        "m:" +
        durationDD.seconds() +
        "s";
      
      expect(lockDurationM).toBe(lockDurationD)

      clearInterval()
    }, interval);
  })
  */

})

