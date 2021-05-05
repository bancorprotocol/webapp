<template>
  <div>
    <ContentBlock
      :shadow-light="true"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <template #header>
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="font-size-16 font-w500">{{ $t("rewards") }}</div>
          <div>
            <b-btn
              :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
              size="sm"
              class="mr-2 rounded"
              :to="{ name: 'RewardsWithdraw' }"
            >
              <svg
                class="d-lg-none"
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
              <span class="d-none d-lg-inline">{{ $t("withdraw") }}</span>
            </b-btn>
            <b-btn
              @click="openModal"
              variant="primary"
              size="sm"
              class="rounded"
            >
              <font-awesome-icon icon="plus" class="d-lg-none" />
              <span class="d-none d-lg-inline">{{ $t("stake") }}</span>
            </b-btn>
          </div>
        </div>
      </template>

      <b-row :class="currentUser ? 'mt-3' : 'mt-4 mb-2'">
        <b-col
          v-for="item in summarizedRewards"
          :key="item.id"
          class="text-center"
        >
          <div v-if="currentUser">
            <div class="font-size-14 font-w600">
              <animation-number
                :target-value="item.bnt.toNumber()"
                :animation-time="item.id === 1 ? 5000 : 3000"
                :watch="true"
                :intervalFunction="intervalFunction"
                trailing-text="BNT"
              />
            </div>
            <div
              class="font-size-12 font-w500"
              :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
            >
              <animation-number
                :target-value="item.usd.toNumber()"
                :usd="true"
                :animation-time="item.id === 1 ? 5000 : 3000"
                :watch="true"
                :intervalFunction="intervalFunction"
                leading-text="~"
              />
            </div>
          </div>
          <div
            v-else
            class="font-size-14 font-w600"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            --
          </div>
          <div
            class="font-size-14 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ item.label }}
          </div>
        </b-col>
      </b-row>
    </ContentBlock>
    <modal-pool-select @select="selectPool" v-model="modal" :pools="pools" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { ViewProtectedLiquidity } from "@/types/bancor";
import { stringifyPercentage, compareString } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import AnimationNumber from "@/components/common/AnimationNumber.vue";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import BigNumber from "bignumber.js";
interface ViewRewardsSummaryItem {
  id: number;
  label: string;
  bnt: BigNumber;
  usd: BigNumber;
}

@Component({
  components: { ModalPoolSelect, ContentBlock, AnimationNumber }
})
export default class RewardsSummary extends BaseComponent {
  @Prop({ default: [] }) positions!: ViewProtectedLiquidity[];
  stringifyPercentage = stringifyPercentage;

  modal = false;
  disabledPools: string[] = [];

  get bntID() {
    const bnt = vxm.bancor.tokens.find(token =>
      compareString(token.symbol, "BNT")
    );
    return bnt ? bnt.id : "";
  }

  get rewardsBalance() {
    return vxm.rewards.balance;
  }

  get pools() {
    return vxm.bancor.relays.filter(
      pool =>
        pool.liquidityProtection &&
        !this.disabledPools.some(disablePoolID => disablePoolID === pool.id)
    );
  }

  get summarizedRewards(): ViewRewardsSummaryItem[] {
    return [
      {
        id: 1,
        label: i18n.tc("total_reward"),
        bnt: this.rewardsBalance.totalRewards.bnt,
        usd: this.rewardsBalance.totalRewards.usd
      },
      {
        id: 2,
        label: i18n.tc("claimable_rewards"),
        bnt: this.rewardsBalance.pendingRewards.bnt,
        usd: this.rewardsBalance.pendingRewards.usd
      }
    ];
  }

  async intervalFunction() {
    await vxm.rewards.loadData();
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

  async mounted() {
    try {
      await vxm.rewards.loadData();
      this.pools.forEach(async x => {
        const disabledReserves = await vxm.ethBancor.fetchDisabledReserves(
          x.id
        );
        if (
          disabledReserves.some(reserveId =>
            compareString(reserveId, this.bntID)
          )
        )
          this.disabledPools.push(x.id);
      });
    } catch (e) {
      console.error("Load Rewards Data error: ", e);
    }
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
