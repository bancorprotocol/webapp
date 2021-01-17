<template>
  <div>
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
          <b-btn
            variant="outline-gray"
            :to="{ name: 'RewardsWithdraw' }"
            style="width: 132px"
            class="mr-3"
          >
            {{ $t("withdraw") }}
          </b-btn>
          <b-btn variant="primary" @click="openModal" style="width: 132px">
            {{ $t("restake") }}
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
          <b-btn
            variant="outline-gray"
            class="btn-block"
            :to="{ name: 'RewardsWithdraw' }"
            >{{ $t("withdraw") }}</b-btn
          >
        </b-col>
        <b-col
          md="6"
          lg="3"
          xl="2"
          class="d-none d-xl-flex align-items-center justify-content-end"
        >
          <b-btn variant="primary" class="btn-block" @click="openModal">
            {{ $t("restake") }}
          </b-btn>
        </b-col>
      </b-row>
    </ContentBlock>

    <modal-pool-select @select="selectPool" v-model="modal" :pools="pools" />
  </div>
</template>

<script lang="ts">
import { i18n } from "@/i18n";
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

  title = i18n.t("rewards");
  modal = false;

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.liquidityProtection);
  }

  get summarizedRewards(): ViewRewardsSummaryItem[] {
    return [
      {
        id: 1,
        label: i18n.tc("claimable_rewards"),
        bnt: 1231231231.123123123123,
        usd: 99.12
      },
      {
        id: 2,
        label: i18n.tc("future_rewards"),
        bnt: 1.123123,
        usd: 99.12
      },
      {
        id: 3,
        label: i18n.tc("total_reward"),
        bnt: 1.123123,
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
