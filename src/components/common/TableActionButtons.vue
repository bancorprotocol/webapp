<template>
  <div>
    <b-btn
      v-if="pool"
      :to="{
        name: 'PoolAction',
        params: {
          poolAction: 'add',
          account: pool.id
        }
      }"
      variant="primary"
      class="mr-2 table-button"
    >
      Add Liquidity
    </b-btn>
    <b-btn
      :to="{
        name: 'Swap',
        query: {
          from: getId
        }
      }"
      :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
      class="table-button"
    >
      Trade
    </b-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewToken, ViewRelay } from "@/types/bancor";

@Component({
  components: {}
})
export default class TableActionButtons extends Vue {
  @Prop() pool?: ViewRelay;
  @Prop() token?: ViewToken;

  get darkMode() {
    return vxm.general.darkMode;
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
  font-size: 14px;
  width: 132px;
  padding: 9px 0px 9px 0px !important;
}
</style>
