<template>
  <div class="remaining-time remaining-time--primary">
    <div class="remaining-time__progress" :style="{ width: percentage }"></div>
    <div v-if="remainingTime !== 0" class="remaining-time__content">
      <font-awesome-icon
        v-if="remainingPercentage < 1"
        icon="clock"
        class="remaining-time__icon"
      />
      <span class="remaining-time__progress-text">{{ remaining }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class RemainingTime2 extends Vue {
  @Prop() from!: number;
  @Prop() to!: number;
  @Prop({ default: true }) showSeconds!: boolean;

  private remainingPercentage: number = 0;
  private remainingTime: number = 0;
  private interval: any;

  get percentage() {
    if (this.remainingPercentage < 0) {
      return "100%";
    }
    return `${Math.min(100, this.remainingPercentage * 100).toFixed(2)}%`;
  }

  get remaining() {
    if (this.remainingTime < 0) {
      return "Full protection reached";
    }

    const s = this.remainingTime / 1000;
    const m = s / 60;
    const h = m / 60;
    const d = h / 24;

    return `
      ${Math.floor(d)}d
      ${Math.floor(h % 24)}h
      ${Math.floor(m % 60)}m
      ${this.showSeconds ? `${Math.floor(s % 60) + 1}s` : ""}
      left
    `;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  updateTime() {
    const { from = 0, to = 0 } = this;
    const now = Date.now();
    this.remainingPercentage = (now - +from) / (+to - +from);
    this.remainingTime = +to - now;
  }

  mounted() {
    [10, 100, 500, 1000, 2000].map(time =>
      setTimeout(() => this.updateTime(), time)
    );
    this.interval = setInterval(() => this.updateTime(), 1000);
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

.remaining-time {
  &.remaining-time {
    background: #96b8ef;
  }
  .remaining-time__progress {
    background: $primary;
  }

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

  &--done &__progress,
  &--done &__content {
    background: $block-bg-blue;
    color: $text-color-light;
  }
}
</style>
