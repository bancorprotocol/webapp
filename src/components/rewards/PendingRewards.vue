<template>
  <b-badge v-if="pendingReward.gt(0)" variant="primary" class="px-2">
    + {{ prettifyNumber(pendingReward) }} BNT
  </b-badge>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import { vxm } from "@/store";
import BigNumber from "bignumber.js";

@Component
export default class PendingRewards extends BaseComponent {
  @Prop() poolId!: string;
  @Prop() symbol!: string;
  pendingReward: BigNumber = new BigNumber(0);

  get reserveTokenId() {
    const pool = vxm.ethBancor.relay(this.poolId);
    const reserve = pool.reserves.find(x => x.symbol === this.symbol);
    return reserve!.id;
  }

  async mounted() {
    const result = await vxm.rewards.fetchPendingReserveRewards({
      poolId: this.poolId,
      reserveId: this.reserveTokenId
    });
    this.pendingReward = result;
  }
}
</script>
