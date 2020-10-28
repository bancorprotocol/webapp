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
      <statistics-data-block
        :title="nativeTokenLabel"
        :value="nativeTokenPrice"
      />
    </b-col>
    <b-col
      md="6"
      lg="3"
      class="mb-4 mb-md-0 mb-lg-0"
      v-if="false && twentyFourHourTradeCount > 0"
    >
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
  get displayCurrency() {
    return vxm.general.currency;
  }
  get conversionRate() {
    const conversionRates = vxm.general.conversionRates;
    const currency = vxm.general.currency;
    return conversionRates[currency].rate;
  }
  get liquidityDepth() {
    return (
      this.stats.totalLiquidityDepth * this.conversionRate
    ).toLocaleString("en", {
      style: "currency",
      currency: this.displayCurrency
    });
  }

  get nativeTokenLabel() {
    return `${this.stats.nativeTokenPrice.symbol} Price`;
  }

  get nativeTokenPrice() {
    return (
      this.stats.nativeTokenPrice.price * this.conversionRate
    ).toLocaleString("en", {
      style: "currency",
      currency: this.displayCurrency
    });
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
