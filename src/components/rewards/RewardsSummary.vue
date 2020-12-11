<template>
  <ContentBlock :no-header="true">
    <div class="d-flex justify-content-between align-items-center d-xl-none">
      <span>{{ title }}</span>
      <b-btn
        variant="primary"
        :to="{ name: 'AddProtectionHome' }"
        style="width: 132px"
      >
        ReStake
      </b-btn>
    </div>
    <b-row>
      <b-col md="6" lg="3" xl="2" class="d-none d-xl-flex align-items-center">
        <div class="font-size-16 font-w600">{{ title }}</div>
      </b-col>
      <b-col
        v-for="(item, index) in summarizedRewards"
        :key="item.la"
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
  </ContentBlock>
  <div
    v-if="false"
    :id="darkMode ? 'protected-summary-dark' : 'protected-summary'"
    class="rounded p-3 mb-3"
    :class="darkMode ? 'text-dark' : 'text-light'"
  >
    <div class="d-flex justify-content-between align-items-center d-xl-none">
      <span>Rewards</span>
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
import { stringifyPercentage } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
interface ViewRewardsSummaryItem {
  label: string;
  bnt: number;
  usd: number;
}
interface ViewRewardsSummary {
  claimable: ViewRewardsSummaryItem;
  future: ViewRewardsSummaryItem;
  total: ViewRewardsSummaryItem;
}

@Component({
  components: { ContentBlock }
})
export default class RewardsSummary extends BaseComponent {
  @Prop({ default: [] }) positions!: ViewProtectedLiquidity[];
  stringifyPercentage = stringifyPercentage;

  title = "Rewards";

  get summarizedRewards(): ViewRewardsSummary {
    return {
      claimable: {
        label: "Claimable Rewards",
        bnt: 1.123123,
        usd: 99.12
      },
      future: {
        label: "Future Rewards",
        bnt: 1.123123,
        usd: 99.12
      },
      future: {
        label: "Total Reward to date",
        bnt: 1.123123,
        usd: 99.12
      }
    };
  }

  getItemStyleClass(index: number) {
    const pos = index + 1;
    if (pos === 1) return "text-center";
    else if (pos < this.summarizedPositions.length) return "text-center";
    else return "text-center";
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/_scss/custom/variables";

#rewards-summary {
  background: $gray-border;
}

#rewards-summary-dark {
  background: $text-color-light;
}
</style>
