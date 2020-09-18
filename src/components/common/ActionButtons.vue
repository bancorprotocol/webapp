<template>
  <div>
    <b-btn
      v-if="pool"
      @click="goToPool"
      variant="primary"
      class="mr-3 table-button"
    >
      Add Liquidity
    </b-btn>

    <b-btn
      @click="goToSwap"
      :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
      class="table-button"
    >
      Trade
    </b-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewToken, ViewRelay } from "@/types/bancor";

@Component
export default class ActionButtons extends Vue {
  @Prop() pool?: ViewRelay;
  @Prop() token?: ViewToken;

  get darkMode() {
    return vxm.general.darkMode;
  }

  goToPool() {
    let routeData = this.$router.resolve({
      name: "PoolAction",
      params: {
        poolAction: "add",
        account: this.pool!.id
      }
    });
    window.open(routeData.href, "_blank");
  }

  goToSwap() {
    let routeData = this.$router.resolve({
      name: "Swap",
      query: {
        from: this.getId
      }
    });
    window.open(routeData.href, "_blank");
  }

  get getId() {
    if (this.pool) return this.pool.reserves[1].id;
    else if (this.token) return this.token.id;
    else return null;
  }
}
</script>

<style lang="scss">
.table-button {
  font-size: 14px !important;
  font-weight: 500 !important;
  width: 132px;
  padding: 9px 0px 9px 0px !important;
}
</style>
