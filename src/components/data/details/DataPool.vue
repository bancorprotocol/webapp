<template>
  <b-row>
    <b-col cols="4">
      <content-block title="Statistics" :shadow-light="true">
        <statistics class="mt-3" />
      </content-block>

      <content-block title="Statistics" :shadow-light="true">
        <statistics class="mt-3" />
      </content-block>
    </b-col>
    <b-col md="8">
      <content-block title="Liquidity">
        <liquidity-chart />
      </content-block>
    </b-col>
    <b-col>
      <content-block :px0="true" :shadow-light="true" :no-header="true">
        <data-table />
      </content-block>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/statistics/Statistics.vue";
import LiquidityChart from "@/components/data/charts/LiquidityChart.vue";
import DataTable from "@/components/data/data-tables/DataTables.vue";
import { ViewToken, ViewReserve } from "@/types/bancor";

@Component({
  components: {
    LiquidityChart,
    Statistics,
    ContentBlock,
    DataTable
  }
})
export default class DataPool extends Vue {
  pool!: ViewReserve;

  get darkMode() {
    return vxm.general.darkMode;
  }

  created() {
    const id = this.$route.params.id;
    const pool = vxm.bancor.relay(id);
    if (pool) this.pool = pool;
    else this.$router.replace({ name: "404" });
  }
}
</script>

<style lang="scss"></style>
