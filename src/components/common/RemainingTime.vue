<template>
  <div
    :class="`remaining-time remaining-time--${type} remaining-time--${variant}`"
  >
    <div class="remaining-time__progress" :style="{ width: percentage }"></div>
    <div v-if="remainingTime !== 0" class="remaining-time__content">
      <font-awesome-icon
        v-if="!isUnlock && remainingPercentage < 1"
        icon="clock"
        class="remaining-time__icon"
      />
      <span class="remaining-time__progress-text">{{ remaining }}</span>
      <span v-if="isUnlock" class="remaining-time__desc">left to unlock</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class RemainingTime extends BaseComponent {
  @Prop() from?: number;
  @Prop() to?: number;
  @Prop() variant?: string;
  @Prop() showSeconds?: boolean;

  private remainingPercentage: number = 0;
  private remainingTime: number = 0;
  private interval: any;

  get type(): string {
    if (this.remainingPercentage <= 0.2) {
      return "info";
    } else if (this.remainingPercentage <= 0.9) {
      return "";
    } else if (this.remainingPercentage >= 1) {
      return "done";
    } else {
      return "warn";
    }
  }

  get isUnlock() {
    return this.variant === "unlock";
  }

  get percentage() {
    if (this.remainingPercentage < 0) {
      return "100%";
    }
    return `${Math.min(100, this.remainingPercentage * 100).toFixed(2)}%`;
  }

  get remaining() {
    if (this.remainingTime < 0) {
      return "Vote Ended";
    }
    if (this.isUnlock) {
      const diff = (this.to || 0) - Date.now();
      const day = 24 * 60 * 60 * 1000;
      let remaining = "";
      if (diff >= day) {
        const days = Math.floor(diff / day);
        remaining += `${days}d `;
      }
      return remaining + new Date(diff).toISOString().substr(11, 8);
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

  &--done &__progress,
  &--done &__content {
    background: $block-bg-blue;
    color: $text-color-light;
  }

  &--unlock {
    border: 1px solid $gray-placeholder;
    background: transparent !important;
    font-size: 12px;
    font-weight: 400;
    padding: 8px !important;
    height: auto;
  }
  &--unlock &__progress {
    display: none;
  }
  &--unlock &__content {
    position: relative;
    color: $text-muted-light;
    display: flex;
    align-items: center;
  }
  &--unlock &__progress-text {
    padding-right: 8px;
    font-size: 0.9vw;
    color: $primary;
    font-weight: 600;
    white-space: nowrap;

    @media screen and (max-width: $breakpoint-mobile) {
      font-size: 1rem;
    }
  }
  &--unlock &__desc {
    padding-top: 4px;
  }
}
</style>
