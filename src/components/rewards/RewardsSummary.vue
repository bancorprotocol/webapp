<template>
  <div>
    <ContentBlock
      :no-header="true"
      :shadow-light="true"
      :px0="true"
      class="pt-2 px-3 mb-3 pb-0"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <div class="d-flex justify-content-between align-items-center d-xl-none">
        <span class="font-size-16 font-w500">{{ title }}</span>
        <div>
          <b-btn
            variant="outline-gray"
            :to="{ name: 'RewardsWithdraw' }"
            style="width: 132px"
            class="mr-3"
          >
            Withdraw
          </b-btn>
          <b-btn variant="primary" @click="openModal" style="width: 132px">
            ReStake
          </b-btn>
        </div>
      </div>
      <b-container class="pb-1">
        <b-row>
          <div class="font-size-16 font-w500">{{ title }}</div>
        </b-row>
        <b-row style="align-items: center">
          <b-col
            v-for="item in summarizedRewards"
            :key="item.id"
            class="text-center"
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
          <b-col cols="3">
            <b-row>
              <b-btn
                variant="outline-gray"
                class="btn-block"
                :to="{ name: 'RewardsWithdraw' }"
                >Withdraw</b-btn
              >

              <b-btn variant="primary" class="btn-block" @click="openModal">
                ReStake
              </b-btn>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </ContentBlock>

    <modal-pool-select @select="selectPool" v-model="modal" :pools="pools" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { ViewProtectedLiquidity } from "@/types/bancor";
import { stringifyPercentage } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import { vxm } from "@/store";
interface ViewRewardsSummaryItem {
  id: number;
  label: string;
  bnt: number;
  usd: number;
}

@Component({
  components: { ModalPoolSelect, ContentBlock }
})
export default class RewardsSummary extends BaseComponent {
  @Prop({ default: [] }) positions!: ViewProtectedLiquidity[];
  stringifyPercentage = stringifyPercentage;

  title = "Rewards";
  modal = false;

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.liquidityProtection);
  }

  get summarizedRewards(): ViewRewardsSummaryItem[] {
    return [
      {
        id: 1,
        label: "Total Reward to date",
        bnt: 1.123123,
        usd: 99.12
      },
      {
        id: 2,
        label: "Claimable Rewards",
        bnt: 1231231231.123123123123,
        usd: 99.12
      }
    ];
  }

  openModal() {
    this.modal = true;
  }

  selectPool(id: string) {
    this.modal = false;
    this.$router.push({
      name: "RewardsRestake",
      params: { id }
    });
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
