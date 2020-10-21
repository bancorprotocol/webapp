<template>
  <b-row>
    <b-col cols="12">
      <content-block title="Statistics" :shadow-light="true">
        <statistics class="mt-3" />
      </content-block>
    </b-col>
    <b-col v-if="false" md="6">
      <content-block title="Liquidity">
        <liquidity-chart :data="liquidityChartData" class="mt-3" />
      </content-block>
    </b-col>
    <b-col v-if="false" md="6">
      <content-block title="Volume">
        <volume-chart :data="volumeChartData" class="mt-3" />
      </content-block>
    </b-col>
    <b-col cols="12">
      <content-block :px0="true" :shadow-light="true" :no-header="true">
        <pool-token-tables />
      </content-block>
    </b-col>
    <b-col v-if="isEth" cols="12">
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
import { Chart } from "chart.js";

@Component({
  components: {
    TransactionTables,
    PoolTokenTables,
    LiquidityChart,
    Statistics,
    VolumeChart,
    ContentBlock
  }
})
export default class DataSummary extends Vue {
  get liquidityChartData(): Chart.ChartData {
    const volumeStats = vxm.ethBancor.volumeInfo;
    const labels = volumeStats.map(
      ([blockNumber, totalVolume, totalLiquidity, unixTime]) => unixTime * 1000
    );
    const data = volumeStats.map(
      ([blockNumber, totalVolume, totalLiquidity, unixTime]) =>
        parseFloat(totalLiquidity)
    );

    return {
      labels,
      datasets: [
        {
          label: "Liquidity",
          backgroundColor: "#0f59d1",
          borderColor: "#0f59d1",
          borderWidth: 0,
          pointRadius: 0,
          data
        }
      ]
    };
  }

  get volumeChartData(): Chart.ChartData {
    const volumeStats = vxm.ethBancor.volumeInfo;
    const labels = volumeStats.map(
      ([blockNumber, totalVolume, totalLiquidity, unixTime]) =>
        new Date(unixTime * 1000)
    );
    const data = volumeStats.map(
      ([blockNumber, totalVolume, totalLiquidity, unixTime]) =>
        parseFloat(totalVolume)
    );

    return {
      labels,
      datasets: [
        {
          label: "Volume",
          backgroundColor: "#0f59d1",
          borderColor: "#0f59d1",
          borderWidth: 0,
          pointRadius: 0,
          data
        }
      ]
    };
  }

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
