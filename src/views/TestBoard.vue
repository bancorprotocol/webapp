<template>
  <b-container fluid="xl" class="px-xl-0">
    <h3>TestBoard</h3>
    <!-- <simple-comp-with-vuex /> -->
    <!-- <simple-comp /> -->
    <!-- <table-comp /> -->
    <!-- <liquidity-comp /> -->
    <pool-actions-add-v-1 :pool="pool" />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import SimpleCompWithVuex from "@/components/test/SimpleCompWithVuex.vue";
// import SimpleComp from "@/components/test/SimpleComp.vue";
// import TableComp from "@/components/test/TableComp.vue";
// import LiquidityComp from "@/components/test/LiquidityComp.vue";
import PoolActionsAddV1 from "@/components/test/PoolActionsAddV1.vue";

import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";

@Component({
  components: {
    // SimpleCompWithVuex,
    // SimpleComp,
    // TableComp,
    PoolActionsAddV1    
    // LiquidityComp
  }
})
export default class TestBoard extends Vue {
  account: string = "0x1aCE5DD13Ba14CA42695A905526f2ec366720b13";

  get pool(): ViewRelay {    
    return vxm.bancor.relay(this.account);
  }
}
</script>

<style lang="scss"></style>
