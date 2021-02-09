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
      <statistics-data-block
        :title="$t('total_liquidity')"
        :value="liquidityDepth"
      />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        :title="`${$t('price')} BNT`"
        :value="bntPriceUsd"
      />
    </b-col>

    <!--    <b-col md="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        :title="nativeTokenLabel"
        :value="nativeTokenPrice"
      />
    </b-col>-->

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block :title="$t('volume')" :value="volume24h" />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        :title="$t('total_bnt_staked')"
        :value="lockedVsCirculatingBnt"
      />
    </b-col>
    <!--
    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        title="Pool Count"
        :value="stats.totalPoolCount.toString()"
      />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        title="Token Count"
        :value="stats.totalTokenCount.toString()"
      />
    </b-col>-->

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
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import StatisticsDataBlock from "@/components/data/statistics/StatisticsDataBlock.vue";
import numeral from "numeral";
import { stringifyPercentage } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { StatisticsDataBlock }
})
export default class Statistics extends BaseComponent {
  stringifyPercentage = stringifyPercentage;

  get liquidityDepth() {
    return this.prettifyNumber(this.stats.totalLiquidityDepth, true);
  }

  get lockedVsCirculatingBnt() {
    const percentageStaked = this.stats.stakedBntPercent;
    return percentageStaked ? stringifyPercentage(percentageStaked) : null;
  }

  get bntPriceUsd() {
    const price = this.stats.bntUsdPrice;
    return price ? this.prettifyNumber(price, true) : "N/A";
  }

  get volume24h() {
    return this.prettifyNumber(this.stats.totalVolume24h, true);
  }

  get nativeTokenLabel() {
    return `${this.stats.nativeTokenPrice.symbol} ${i18n.t("price")}`;
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
