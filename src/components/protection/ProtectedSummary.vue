<template>
  <div
    :id="darkMode ? 'protected-summary-dark' : 'protected-summary'"
    class="rounded p-3 mb-3 block-shadow-light"
    :class="darkMode ? 'text-dark' : 'text-light'"
  >
    <div class="d-flex justify-content-between align-items-center d-xl-none">
      <span class="font-size-16 font-w500">My Stake</span>
      <b-btn variant="primary" @click="openModal" style="width: 132px">
        Stake
      </b-btn>
    </div>
    <b-row>
      <b-col md="6" lg="3" xl="2" class="d-none d-xl-flex align-items-center">
        <div class="font-size-16 font-w500">My Stake</div>
      </b-col>
      <b-col
        v-for="(item, index) in summarizedPositions"
        :key="item.key"
        cols="6"
        lg="4"
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
        <b-btn variant="primary" class="btn-block" @click="openModal">
          Stake
        </b-btn>
      </b-col>
    </b-row>

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
  minNetworkTokenLiquidityforMinting: BigNumber | null = null

  get pools() {
    const limit = this.minNetworkTokenLiquidityforMinting
    return vxm.bancor.relays.filter(
      pool =>
        pool.liquidityProtection &&
        pool.bntReserveBalance &&
        limit !== null && limit.lt(pool.bntReserveBalance)
    );
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

      // const roi = (protectedValue - initialStake) / initialStake;

      return [
        {
          key: "Initial Stake",
          value: this.prettifyNumber(initialStake, true)
        },
        {
          key: "Protected Value",
          value: this.prettifyNumber(protectedValue, true)
        },
        {
          key: "Claimable Value",
          value: this.prettifyNumber(claimableValue, true)
        },
        { key: "", value: "" }
        // { key: "ROI", value: this.stringifyPercentage(roi) }
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

  getItemStyleClass(index: number) {
    const pos = index + 1;
    if (pos === 1) return "text-center";
    else if (pos < this.summarizedPositions.length) return "text-center";
    else return "text-center";
  }

  async mounted() {
   this.minNetworkTokenLiquidityforMinting = await vxm.minting.fetchMinLiqForMinting()
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
