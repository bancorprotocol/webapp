<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <content-block title="Statistics" :shadow-light="true">
          <statistics class="mt-3" />
        </content-block>
      </b-col>
      <b-col v-if="false" md="6">
        <content-block title="Liquidity">
          <liquidity-chart />
        </content-block>
      </b-col>
      <b-col v-if="false" md="6">
        <content-block title="Volume">
          <liquidity-chart />
        </content-block>
      </b-col>
      <b-col>
        <content-block :px0="true" :shadow-light="true" :no-header="true">
          <data-table />
        </content-block>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/statistics/Statistics.vue";
import LiquidityChart from "@/components/data/charts/LiquidityChart.vue";
import DataTable from "@/components/data/data-tables/DataTables.vue";

@Component({
  components: {
    LiquidityChart,
    Statistics,
    ContentBlock,
    DataTable
  }
})
export default class Data extends Vue {
  selected: string = "pools";
  filter: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
