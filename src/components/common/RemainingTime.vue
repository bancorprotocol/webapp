<template>
  <div :class="`remaining-time remaining-time--${type}`">
    <div class="remaining-time__progress" :style="{ width: percentage }"></div>
    <div v-if="remainingTime !== 0" class="remaining-time__content">
      <font-awesome-icon icon="clock" class="remaining-time__icon" />
      {{ remaining }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import numeral from "numeral";

@Component
export default class RemainingTime extends Vue {
  @Prop() type?: "warn" | "info" | null;
  @Prop() from?: number;
  @Prop() to?: number;

  private remainingPercentage: number = 0;
  private remainingTime: number = 0;
  private interval: any;

  get percentage() {
    if (this.remainingPercentage < 0) {
      return "100%";
    }
    return `${Math.min(100, this.remainingPercentage).toFixed(2)}%`;
  }

  get remaining() {
    if (this.remainingTime < 0) {
      return "No time left";
    }

    const m = this.remainingTime / 60 / 1000;
    const h = m / 60;
    const d = h / 24;

    return `${Math.round(d)}d ${Math.round(h % 24)}h ${Math.round(
      m % 60
    )}m left`;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  updateTime() {
    const { from = 0, to = 0 } = this;
    const now = Date.now();
    this.remainingPercentage = ((now - +from) / (+to - +from)) * 100;
    this.remainingTime = +to - now;
  }

  mounted() {
    [10, 100, 500, 1000, 2000].map(time =>
      setTimeout(() => this.updateTime(), time)
    );
    this.interval = setInterval(() => this.updateTime(), 10 * 1000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

$remaining-time---height: 24px;
$remaining-time---font-size: 12px;
$remaining-time---border-radius: 8px;
$remaining-time---color: #ffffff;

$remaining-time---background: [$primary, #96b8ef];
$remaining-time--warn---background: [$text-warning-light, #fadaa6];
$remaining-time--info---background: [#3ec8c8, #88d5d5];

@mixin remaining-time-background($palette) {
  &.remaining-time {
    background: nth($palette, 2);
  }
  .remaining-time__progress {
    background: nth($palette, 1);
  }
}

.remaining-time {
  @include remaining-time-background($remaining-time---background);

  border-radius: $remaining-time---border-radius;
  overflow: hidden;
  position: relative;

  &,
  &__progress,
  &__content {
    height: $remaining-time---height;
  }

  &__progress,
  &__content {
    position: absolute;
    top: 0;
    left: 0;
  }

  &__content {
    text-align: center;
    width: 100%;
    color: $remaining-time---color;
    font-size: $remaining-time---font-size;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    margin-right: 6px;
  }

  &--warn {
    @include remaining-time-background($remaining-time--warn---background);
  }
  &--info {
    @include remaining-time-background($remaining-time--info---background);
  }
}
</style>
