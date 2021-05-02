<template>
  <div
    class="claim-item d-flex justify-content-between align-items-center px-3 py-2"
  >
    <div class="d-flex align-items-center">
      <font-awesome-icon
        v-if="locked"
        icon="lock"
        class="mr-3"
        :class="textMutedClass"
      />
      <img
        class="img-avatar img-avatar20 bg-white logo-shadow"
        :src="bntLogoSrc"
        :title="$t('token_logo')"
      />
      <span class="mx-2">{{ `${prettifyNumber(item.amount)} BNT` }}</span>
    </div>
    <div v-if="!locked">
      <b-btn
        variant="primary"
        @click="click"
        class="font-size-14 font-w500 px-4"
        >{{ `${$t("claim")} BNT` }}</b-btn
      >
    </div>
    <div v-else class="time-left text-center">
      <div
        class="font-size-18"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      >
        {{ lockDuration }}
      </div>
      <div class="font-size-12 font-w400" :class="textMutedClass">
        {{ $t("left_until_claim") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit } from "vue-property-decorator";
import dayjs from "@/utils/dayjs";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class ClaimBnt extends BaseComponent {
  @Prop() item!: any;

  locked = true;

  lockDuration = "00:00:00";

  @Emit()
  click() {}

  @Emit("refresh")
  refresh() {}

  countdown(eventTime: number) {
    const currentTime = Date.now() / 1000;
    const diffTime = eventTime - currentTime;
    let duration = dayjs.duration(diffTime * 1000, "milliseconds");

    const interval = 1000;

    this.locked = diffTime > 0 ? true : false;

    const runInterval = setInterval(() => {
      duration = dayjs.duration(
        duration.asMilliseconds() - interval,
        "milliseconds"
      );

      this.lockDuration =
        duration.hours() +
        "h:" +
        duration.minutes() +
        "m:" +
        duration.seconds() +
        "s";

      if (duration.asMilliseconds() < 0) {
        this.locked = false;

        clearInterval(runInterval);
        this.refresh();
      }
    }, interval);
  }

  get bntLogoSrc() {
    return "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png";
  }

  get textMutedClass() {
    return this.darkMode ? "text-muted-dark" : "text-muted-light";
  }

  created() {
    this.countdown(this.item.lockedUntil);
  }
}
</script>

<style lang="scss">
.claim-item {
  min-height: 70px;
  border-bottom: 1px solid #e6ebf2;

  .time-left {
    min-width: 100px;
  }
}

.claim-item:last-of-type {
  border-bottom: none;
}
</style>
