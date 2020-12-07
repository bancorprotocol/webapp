<template>
  <b-row>
    <!-- <b-col md="6" lg="3" class="mb-4 mb-lg-0">
      <statistics-data-block
        title="Bancor Eth Price"
        value="123,456,789.00 ETH"
        :percentage="-0.89"
      />
    </b-col> -->

    <b-col cols="6" lg="3" class="mb-4 mb-lg-0">
      <statistics-data-block title="Total Liquidity" :value="liquidityDepth" />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block title="BNT Price" :value="bntPriceUsd" />
    </b-col>

    <!--    <b-col md="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        :title="nativeTokenLabel"
        :value="nativeTokenPrice"
      />
    </b-col>-->

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block title="Volume (24hrs)" :value="volume24h" />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        title="Total BNT Staked"
        :value="lockedVsCirculatingBnt"
      />
    </b-col>

    <!--    <b-col
      cols="6"
      lg="3"
      class="mb-4 mb-md-0 mb-lg-0"
      v-if="twentyFourHourTradeCount > 0"
    >
      <statistics-data-block
        title="Swaps (24hrs)"
        :value="twentyFourHourTradeCount"
      />
    </b-col>-->
  </b-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import StatisticsDataBlock from "@/components/data/statistics/StatisticsDataBlock.vue";
import numeral from "numeral";
import { prettifyNumber, stringifyPercentage } from "@/api/helpers";

@Component({
  components: { StatisticsDataBlock }
})
export default class Statistics extends Vue {
  stringifyPercentage = stringifyPercentage;

  get liquidityDepth() {
    return prettifyNumber(this.stats.totalLiquidityDepth, true);
  }

  get lockedVsCirculatingBnt() {
    const percentageStaked = this.stats.stakedBntPercent;
    return percentageStaked ? stringifyPercentage(percentageStaked) : null;
  }

  get bntPriceUsd() {
    const price = this.stats.bntUsdPrice;
    return price ? prettifyNumber(price, true) : "N/A";
  }

  get volume24h() {
    return prettifyNumber(this.stats.totalVolume24h, true);
  }

  get nativeTokenLabel() {
    return `${this.stats.nativeTokenPrice.symbol} Price`;
  }

  get nativeTokenPrice() {
    return numeral(this.stats.nativeTokenPrice.price).format("$0,0.00");
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
