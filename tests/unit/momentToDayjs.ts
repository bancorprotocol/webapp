import moment from "moment";
import dayjs from 'dayjs'


describe("check moment and dayjs", () => {
  test("durationToSeconds", () => {
    // expect(moment.duration(1, "days").asSeconds())
    const oneDay = moment.duration(1, "day")
    moment.duration(3, "days").asSeconds()
    moment.duration("30", "days").asSeconds()
    moment.duration("100", "days").asSeconds()
    moment.duration("24", "hours").asSeconds()

    const yesterDay = moment().subtract(oneDay);

    moment().isSameOrAfter(yesterDay)
    moment.unix(10).isBefore(moment())
    moment.unix(10).isAfter(moment())

    moment.duration(10, "seconds").humanize()    

    const diffTime = 10
    moment.duration(diffTime * 1000, "milliseconds")    
  })

  test("unixTime", () => {
    moment()

    moment().unix()

    const unixTime = 0
    moment.unix(unixTime).format("MMM D yyyy")
    moment.unix(unixTime).format("HH:mm")

    moment.unix(unixTime).fromNow()
  })

  test("endTime", () => {
    const liquidityMiningEndTime = moment(
      "2021-02-08 20:15 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();
    
    const secondRoundLiquidityMiningEndTime = moment(
      "2021-02-25 18:05 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();

    const thirdRoundLiquidityMiningEndTime = moment(
      "2021-03-22 08:00 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();
      
    const fourthRoundLiquidityMiningEndTime = moment(
      "2021-03-25 09:00 +0000",
      "YYYY-MM-DD HH:mm Z"
    ).unix();
  })

  
  test("countDown", () => {
    // const currentTime = Date.now() / 1000;
    // const diffTime = eventTime - currentTime;
    // let duration = moment.duration(diffTime * 1000, "milliseconds");

    // const interval = 1000;

    // setInterval(() => {
    //   duration = moment.duration(Number(duration) - interval, "milliseconds");
    //   this.lockDuration =
    //     duration.hours() +
    //     "h:" +
    //     duration.minutes() +
    //     "m:" +
    //     duration.seconds() +
    //     "s";
    //   this.locked = diffTime > 0;
    // }, interval);
  })


})