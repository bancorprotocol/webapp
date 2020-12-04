<template>
  <div
    :id="darkMode ? 'protected-summary-dark' : 'protected-summary'"
    class="rounded p-3 mb-3"
    :class="darkMode ? 'text-dark' : 'text-light'"
  >
    <div class="d-flex justify-content-between align-items-center d-xl-none">
      <span>My Stake</span>
      <b-btn
        variant="primary"
        :to="{ name: 'AddProtectionHome' }"
        style="width: 132px"
        >Stake</b-btn
      >
    </div>
    <b-row>
      <b-col md="6" lg="3" xl="2" class="d-none d-xl-flex align-items-center">
        <div class="font-size-16 font-w600">My Stake</div>
      </b-col>
      <b-col
        v-for="(item, index) in summarizedPositions"
        :key="item.key"
        cols="6"
        lg="3"
        xl="2"
        class="d-flex flex-column align-items-center mt-3 mt-xl-0"
        :class="getItemStyleClass(index)"
      >
        <div class="font-size-14 font-w600 text-primary">{{ item.value }}</div>
        <div class="text-uppercase font-size-10 font-w500">{{ item.key }}</div>
      </b-col>
      <b-col
        md="6"
        lg="3"
        xl="2"
        class="d-none d-xl-flex align-items-center justify-content-end"
      >
        <b-btn
          variant="primary"
          style="width: 132px"
          :to="{ name: 'AddProtectionHome' }"
          >Stake</b-btn
        >
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { ViewProtectedLiquidity } from "@/types/bancor";
import { prettifyNumber } from "@/api/helpers";
import numeral from "numeral";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class ProtectedSummary extends BaseComponent {
  @Prop({ default: [] }) positions!: ViewProtectedLiquidity[];

  get summarizedPositions() {
    if (!this.positions.length) return [];
    else {
      const initialStake = this.positions
        .map(x => Number(x.stake.usdValue || 0))
        .reduce((sum, current) => sum + current);

      const protectedValue = this.positions
        .map(x => Number(x.fullyProtected.usdValue || 0))
        .reduce((sum, current) => sum + current);

      const claimableValue = this.positions
        .map(x => Number(x.protectedAmount.usdValue || 0))
        .reduce((sum, current) => sum + current);

      const roi = (protectedValue - initialStake) / initialStake;

      return [
        { key: "Initial Stake", value: prettifyNumber(initialStake, true) },
        {
          key: "Protected Value",
          value: prettifyNumber(protectedValue, true)
        },
        {
          key: "Claimable Value",
          value: prettifyNumber(claimableValue, true)
        },
        { key: "ROI", value: this.stringifyPercentage(roi) }
      ];
    }
  }

  stringifyPercentage(percentage: number) {
    if (percentage < 0.0001) return "< 0.01%";
    else return numeral(percentage).format("0.00%");
  }

  getItemStyleClass(index: number) {
    const pos = index + 1;
    if (pos === 1) return "text-center";
    else if (pos < this.summarizedPositions.length) return "text-center";
    else return "text-center";
  }
}
</script>

<style lang="scss">
@import "../../assets/_scss/custom/variables";

#protected-summary {
  background: $gray-border;
}

#protected-summary-dark {
  background: $text-color-light;
}
</style>
