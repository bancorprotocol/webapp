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
    if (this.pool!.whitelisted) {
      this.$router.push({
        name: "PoolAdd",
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
.table-button {
  font-size: 14px !important;
  font-weight: 500 !important;
  width: 132px;
  padding: 9px 0px 9px 0px !important;
}
</style>
