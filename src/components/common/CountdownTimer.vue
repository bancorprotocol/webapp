<template>
  <span>{{ calculateCliffTime }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import moment from "moment";

@Component
export default class CountdownTimer extends Vue {
  @Prop() dateUnix!: number;

  now = Date.now() / 1000;

  get calculateCliffTime() {
    const diffTime = this.dateUnix - this.now;
    let duration = moment.duration(diffTime * 1000, "milliseconds");
    const interval = 1000;
    duration = moment.duration(Number(duration) - interval, "milliseconds");
    const days = duration.days() + "d:";
    const hours = duration.hours() + "h:";
    const minutes = duration.minutes() + "m:";
    const seconds = duration.seconds() + "s";
    let string = days + hours + minutes + seconds;
    return string;
  }

  created() {
    setInterval(() => {
      this.now = Date.now() / 1000;
    }, 1000);
  }
}
</script>

<style lang="scss"></style>
