<template>
  <div>
    <ContentBlock
      :shadow-light="true"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <template #header>
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="font-size-16 font-w500">{{ $t("my_stake") }}</div>
          <b-btn @click="openModal" size="sm" variant="primary" class="rounded">
            <font-awesome-icon icon="plus" class="d-lg-none" />
            <span class="d-none d-lg-inline">{{ $t("stake") }} </span>
          </b-btn>
        </div>
      </template>
      <div class="mt-3">
        <b-row class="mt-4 mb-2">
          <b-col
            v-for="item in summarizedPositions"
            :key="item.key"
            class="text-center"
          >
            <div
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
            >
              {{ item.value }}
            </div>
            <div class="font-size-14 font-w400">
              {{ item.key }}
            </div>
          </b-col>
        </b-row>
      </div>
    </ContentBlock>

    <modal-pool-select @select="selectPool" v-model="modal" :pools="pools" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { ViewProtectedLiquidity } from "@/types/bancor";
import BaseComponent from "@/components/BaseComponent.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import { stringifyPercentage } from "@/api/helpers";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ContentBlock from "@/components/common/ContentBlock.vue";

@Component({ components: { ContentBlock, ModalPoolSelect } })
export default class ProtectedSummary extends BaseComponent {
  @Prop({ default: [] }) positions!: ViewProtectedLiquidity[];

  modal = false;

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.addProtectionSupported);
  }

  get hasPositions() {
    return !!vxm.ethBancor.protectedPositions.length;
  }

  get rewardsBalance() {
    return vxm.rewards.balance;
  }

  get summarizedPositions() {
    if (!this.hasPositions) {
      return [
        {
          key: i18n.t("protected_value"),
          value: "--"
        },
        {
          key: i18n.t("claimable_value"),
          value: "--"
        },
        { key: i18n.t("total_fees"), value: "--" }
      ];
    } else {
      const positions = this.positions;

      const initialStake = positions
        .map(x => Number(x.stake.usdValue || 0))
        .reduce((sum, current) => sum + current, 0);

      const protectedValue = positions
        .map(x => Number((x.fullyProtected && x.fullyProtected.usdValue) || 0))
        .reduce((sum, current) => sum + current, 0);

      const claimableValue = positions
        .map(x =>
          Number((x.protectedAmount && x.protectedAmount.usdValue) || 0)
        )
        .reduce((sum, current) => sum + current, 0);

      const fees = protectedValue - initialStake;

      return [
        {
          key: i18n.t("protected_value"),
          value: "~" + this.prettifyNumber(protectedValue, true)
        },
        {
          key: i18n.t("claimable_value"),
          value: "~" + this.prettifyNumber(claimableValue, true)
        },
        {
          key: i18n.t("total_fees"),
          value: "~" + this.prettifyNumber(fees, true)
        }
      ];
    }
  }

  openModal() {
    this.modal = true;
  }

  selectPool(id: string) {
    this.modal = false;
    this.$router.push({ name: "AddProtectionSingle", params: { id } });
  }

  stringifyPercentage = stringifyPercentage;
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
.seperator {
  margin-bottom: 1.1rem;
  border: 1px solid #97a5b8;
}
</style>
