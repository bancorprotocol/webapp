<template>
  <div class="actionsButtons">
    <div id="popover-target">
      <b-btn
        v-if="pool"
        @click="goToPool"
        variant="primary"
        class="mr-3"
        :disabled="pool.whitelisted && stakeMaintenanceMode"
        :class="small ? 'table-button-small' : 'table-button'"
      >
        <span v-if="!small">Add Liquidity</span>
        <font-awesome-icon v-else icon="plus" />
      </b-btn>
      <b-popover
        v-if="stakeMaintenanceMode"
        target="popover-target"
        triggers="hover"
        placement="bottom"
      >
        The site is undergoing maintenance and this option is not currently
        available
      </b-popover>
    </div>

    <b-btn
      @click="goToSwap"
      :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
      :class="small ? 'table-button-small' : 'table-button'"
    >
      <span v-if="!small">Trade</span>
      <font-awesome-icon
        v-else
        icon="exchange-alt"
        v-b-tooltip.hover
        title="Trade"
      />
    </b-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { ViewToken, ViewRelay } from "@/types/bancor";
import BaseComponent from "@/components/BaseComponent.vue";
import BigNumber from "bignumber.js";
import { vxm } from "@/store";

@Component
export default class ActionButtons extends BaseComponent {
  @Prop() pool?: ViewRelay;
  @Prop() token?: ViewToken;
  @Prop({ default: false }) small!: boolean;

  get minNetworkTokenLiquidityforMinting() {
    return vxm.minting.minNetworkTokenLiquidityforMinting;
  }

  get stakeMaintenanceMode() {
    return vxm.bancor.stakeMaintenanceMode;
  }

  goToPool() {
    const limit = this.minNetworkTokenLiquidityforMinting;
    if (
      this.pool &&
      this.pool.whitelisted &&
      this.pool.bntReserveBalance &&
      limit !== null &&
      limit.lt(this.pool.bntReserveBalance)
    ) {
      this.$router.push({
        name: "AddProtectionSingle",
        params: { id: this.pool!.id }
      });
    } else {
      this.$router.push({
        name: "PoolAction",
        params: { poolAction: "add", account: this.pool!.id }
      });
    }
  }

  goToSwap() {
    this.$router.push({
      name: "Swap",
      query: {
        from: this.getId
      }
    });
  }

  get getId() {
    if (this.pool) return this.pool.reserves[1].id;
    else if (this.token) return this.token.id;
    else return null;
  }
}
</script>

<style lang="scss">
.actionsButtons {
  display: grid;
  grid-template-columns: auto auto;
}

.table-button {
  font-size: 14px !important;
  font-weight: 500 !important;
  width: 132px;
  padding: 9px 0px 9px 0px !important;
}

.table-button-small {
  @extend .table-button;

  width: 50px;
}
</style>
