<template>
  <b-row>
    <!-- <b-col md="6" lg="3" class="mb-4 mb-lg-0">
      <statistics-data-block
        title="Bancor Eth Price"
        value="123,456,789.00 ETH"
        :percentage="-0.89"
      />
    </b-col> -->
    <b-col md="6" lg="3" class="mb-0">
      <statistics-data-block title="Total Liquidity" :value="liquidityDepth" />
    </b-col>
    <b-col md="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block title="BNT Price" :value="bntPrice" />
    </b-col>
    <b-col md="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        title="Recent Conversions (24hrs)"
        :value="twentyFourHourTradeCount"
      />
    </b-col>
    <!-- <b-col md="6" lg="3"> -->
    <!-- <statistics-data-block -->
    <!-- title="24hrs Transactions" -->
    <!-- value="123,456,789.00 ETH" -->
    <!-- :percentage="+0.89" -->
    <!-- /> -->
    <!-- </b-col> -->
  </b-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import StatisticsDataBlock from "@/components/data/statistics/StatisticsDataBlock.vue";
import numeral from "numeral";

@Component({
  components: { StatisticsDataBlock }
})
export default class Statistics extends Vue {
  get liquidityDepth() {
    return numeral(this.stats.totalLiquidityDepth).format("$0,0.00");
  }

  get bntPrice() {
    return numeral(this.stats.bntPrice).format("$0,0.00");
  }

  get twentyFourHourTradeCount() {
    return String(this.stats.twentyFourHourTradeCount);
  }

  get stats() {
    return vxm.bancor.stats;
  }
}
</script>

<style lang="scss"></style>
