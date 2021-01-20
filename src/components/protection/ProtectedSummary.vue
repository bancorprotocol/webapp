<template>
  <div
    :id="darkMode ? 'protected-summary-dark' : 'protected-summary'"
    class="rounded p-1 block-shadow-light pb-3"
    :class="darkMode ? 'text-dark' : 'text-light'"
  >
    <div>
      <b-row>
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="font-size-16 font-w500 block-header ml-2 pt-1">
            My Stake
          </div>
          <b-btn
            @click="openModal"
            size="sm"
            variant="primary"
            class="d-lg-none mr-4"
          >
            <font-awesome-icon icon="plus" />
          </b-btn>
        </div>
      </b-row>
      <div class="seperator" />
      <b-row style="align-items: center" class="p-3">
        <b-col
          v-for="item in summarizedPositions"
          :key="item.key"
          class="text-center"
        >
          <div
            class="font-size-14 font-w600"
            :style="item.key === 'ROI' ? 'color: #3EC8C8' : 'color: #0F59D1'"
          >
            {{ item.value }}
          </div>
          <div class="text-uppercase font-size-10 font-w500">
            {{ item.key }}
          </div>
        </b-col>
        <b-btn
          class="d-none d-lg-block"
          @click="openModal"
          variant="primary"
          style="margin-right: 15px"
        >
          <font-awesome-icon icon="plus" />
        </b-btn>
      </b-row>
    </div>

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
import BigNumber from "bignumber.js";

@Component({ components: { ModalPoolSelect } })
export default class ProtectedSummary extends BaseComponent {
  @Prop({ default: [] }) positions!: ViewProtectedLiquidity[];

  modal = false;

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.addProtectionSupported);
  }

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
        {
          key: "Protected Value",
          value: "~" + this.prettifyNumber(protectedValue, true)
        },
        {
          key: "Claimable Value",
          value: "~" + this.prettifyNumber(claimableValue, true)
        },
        { key: "ROI", value: this.stringifyPercentage(roi) }
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
  margin-bottom: 1rem;
  border: 1px solid #97a5b8;
}
</style>
