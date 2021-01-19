<template>
  <div>
    <ContentBlock
      :shadow-light="true"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <template #header>
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="font-size-16 font-w500">Rewards</div>
          <div class="d-lg-none">
            <b-btn
              variant="outline-gray"
              size="sm"
              class="mr-2"
              :to="{ name: 'RewardsWithdraw' }"
            >
              <svg
                width="13"
                height="16"
                viewBox="0 0 13 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5693 6.01098L7.17391 2.94093V11.6756C7.17391 12.1511 6.74329 12.5405 6.21739 12.5405C5.6915 12.5405 5.26087 12.1511 5.26087 11.6756V2.94093L1.86546 6.01098C1.48247 6.35728 0.884639 6.35728 0.502604 6.01098C0.119613 5.66469 0.119613 5.12415 0.502604 4.77872L5.52434 0.238184C5.73919 0.0650422 5.97831 0 6.21744 0C6.45657 0 6.6957 0.0861492 6.8872 0.259286L11.9089 4.79983C12.2919 5.14612 12.2919 5.68666 11.9089 6.03209C11.5502 6.35641 10.9523 6.35642 10.5693 6.01098ZM0.956522 16C0.430626 16 0 15.6106 0 15.1351C0 14.6596 0.430626 14.2703 0.956522 14.2703H11.4783C12.0042 14.2703 12.4348 14.6596 12.4348 15.1351C12.4348 15.6106 12.0042 16 11.4783 16H0.956522Z"
                  :fill="darkMode ? '#ffffff' : '#0A2540'"
                />
              </svg>
            </b-btn>
            <b-btn @click="openModal" variant="primary" size="sm">
              <font-awesome-icon icon="plus" />
            </b-btn>
          </div>
        </div>
      </template>
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
        <b-col cols="3" class="d-none d-lg-block mt-2 mr-4">
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
