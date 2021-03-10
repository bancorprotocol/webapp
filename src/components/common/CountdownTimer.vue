<template>
  <span>{{ remaining }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { i18n } from "@/i18n";

@Component
export default class CountdownTimer extends Vue {
  @Prop() dateUnix!: number;
  @Prop({ default: i18n.t("countdown_ended") }) msgCountdownEnded!: string;

  private now: number = Date.now() / 1000;
  private interval: any;

  get remaining() {
    const remainingTime = this.dateUnix - this.now;
    if (remainingTime < 0) {
      return this.msgCountdownEnded;
    }

    const s = remainingTime;
    const m = s / 60;
    const h = m / 60;
    const d = h / 24;

    return `
      ${Math.floor(d)}d
      ${Math.floor(h % 24)}h
      ${Math.floor(m % 60)}m
      ${Math.floor(s % 60) + 1}s
    `;
  }

  updateTime() {
    this.now = Date.now() / 1000;
  }

  created() {
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style lang="scss"></style>
