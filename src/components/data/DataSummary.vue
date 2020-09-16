<template>
  <b-row>
    <b-col cols="12">
      <content-block title="Statistics" :shadow-light="true">
        <statistics class="mt-3" />
      </content-block>
    </b-col>
    <b-col md="6">
      <content-block title="Liquidity">
        <liquidity-chart />
      </content-block>
    </b-col>
    <b-col md="6">
      <content-block title="Volume">
        <volume-chart />
      </content-block>
    </b-col>
    <b-col cols="12">
      <content-block :px0="true" :shadow-light="true" :no-header="true">
        <pool-token-tables />
      </content-block>
    </b-col>
    <b-col cols="12" v-if="isEth">
      <content-block :px0="true" :shadow-light="true" :no-header="true">
        <transaction-tables />
      </content-block>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/statistics/Statistics.vue";
import LiquidityChart from "@/components/data/charts/LiquidityChart.vue";
import VolumeChart from "@/components/data/charts/VolumeChart.vue";
import PoolTokenTables from "@/components/data/pooltokentables/PoolTokenTables.vue";
import TransactionTables from "@/components/data/transactiontables/TransactionTables.vue";

@Component({
  components: {
    TransactionTables,
    PoolTokenTables,
    LiquidityChart,
    VolumeChart,
    Statistics,
    ContentBlock
  }
})
export default class DataSummary extends Vue {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
