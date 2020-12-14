<template>
  <ContentBlock
    :no-header="true"
    :shadow-light="true"
    :px0="true"
    class="pt-3 px-3 mb-3"
    :class="darkMode ? 'text-dark' : 'text-light'"
  >
    <div class="d-flex justify-content-between align-items-center d-xl-none">
      <span class="font-size-16 font-w500">{{ title }}</span>
      <div>
        <b-btn variant="outline-gray" style="width: 132px" class="mr-3">
          Withdraw
        </b-btn>
        <b-btn
          variant="primary"
          :to="{ name: 'AddProtectionHome' }"
          style="width: 132px"
        >
          ReStake
        </b-btn>
      </div>
    </div>
    <b-row>
      <b-col md="6" lg="3" xl="2" class="d-none d-xl-flex align-items-center">
        <div class="font-size-16 font-w500">{{ title }}</div>
      </b-col>
      <b-col
        v-for="(item, index) in summarizedRewards"
        :key="item.id"
        cols="6"
        lg="4"
        xl="2"
        class="d-flex flex-column align-items-center mt-3 mt-xl-0"
        :class="getItemStyleClass(index)"
      >
        <div class="font-size-14 font-w600">
          {{ prettifyNumber(item.bnt) }} BNT
        </div>
        <div class="font-size-12 font-w500 text-primary">
          (~{{ prettifyNumber(item.usd, true) }})
        </div>
        <div
          class="text-uppercase font-size-10 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ item.label }}
        </div>
      </b-col>
      <b-col
        md="6"
        lg="3"
        xl="2"
        class="d-none d-xl-flex align-items-center justify-content-end"
      >
        <b-btn variant="outline-gray" class="btn-block">Withdraw</b-btn>
      </b-col>
      <b-col
        md="6"
        lg="3"
        xl="2"
        class="d-none d-xl-flex align-items-center justify-content-end"
      >
        <b-btn
          variant="primary"
          class="btn-block"
          :to="{ name: 'AddProtectionHome' }"
          >ReStake</b-btn
        >
      </b-col>
    </b-row>
  </ContentBlock>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { ViewProtectedLiquidity } from "@/types/bancor";
import { stringifyPercentage, prettifyNumber } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
interface ViewRewardsSummaryItem {
  id: number;
  label: string;
  bnt: number;
  usd: number;
}

@Component({
  components: { ContentBlock }
})
export default class RewardsSummary extends BaseComponent {
  @Prop({ default: [] }) positions!: ViewProtectedLiquidity[];
  stringifyPercentage = stringifyPercentage;
  prettifyNumber = prettifyNumber;

  title = "Rewards";

  get summarizedRewards(): ViewRewardsSummaryItem[] {
    return [
      {
        id: 1,
        label: "Claimable Rewards",
        bnt: 1231231231.123123123123,
        usd: 99.12
      },
      {
        id: 2,
        label: "Future Rewards",
        bnt: 1.123123,
        usd: 99.12
      },
      {
        id: 3,
        label: "Total Reward to date",
        bnt: 1.123123,
        usd: 99.12
      }
    ];
  }

  getItemStyleClass(index: number) {
    const pos = index + 1;
    if (pos === 1) return "text-center";
    else if (pos < this.summarizedRewards.length) return "text-center";
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
