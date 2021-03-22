<template>
  <b-row>
    <b-col cols="6" lg="3" class="mb-4 mb-lg-0">
      <statistics-data-block
        :title="$t('total_liquidity')"
        :value="stats.totalLiquidityDepth"
        :usd="true"
      />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        :title="`${$t('price')} BNT`"
        :value="stats.bntUsdPrice"
        :percentage="stats.bntPrice24Change"
        blockStyle="width: 95px !important"
        :usd="true"
      />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        :title="$t('volume')"
        :value="stats.totalVolume24h"
        :usd="true"
      />
    </b-col>

    <b-col cols="6" lg="3" class="mb-4 mb-md-0 mb-lg-0">
      <statistics-data-block
        :title="$t('total_bnt_staked')"
        :value="stats.stakedBntPercent"
        :isPercentage="true"
      />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import StatisticsDataBlock from "@/components/data/statistics/StatisticsDataBlock.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { StatisticsDataBlock }
})
export default class Statistics extends BaseComponent {
  get stats() {
    return vxm.bancor.stats;
  }
}
</script>

<style lang="scss"></style>
