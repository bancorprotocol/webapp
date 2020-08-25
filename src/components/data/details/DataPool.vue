<template>
  <b-row>
    <b-col cols="6">
      <pool-logos
        class="my-1"
        :pool="pool"
        :cursor="false"
        :version="false"
        :showName="false"
      />
      <div
        class="font-size-20 font-w600 mt-2 mb-3 d-flex"
        :class="[darkMode ? 'text-dark' : 'text-light']"
      >
        <pool-name :pool="pool" class="mr-2" />
        Pool
      </div>
    </b-col>
    <b-col cols="6"> </b-col>
    <b-col cols="4">
      <content-block title="Pool Tokens Statistics" :shadow-light="true">
        <statistics class="mt-3" />
      </content-block>

      <content-block title="Pool Information" :shadow-light="true">
        <div class="mt-3">
          <label-content-split label="Pool Name" value="123" />
          <label-content-split label="Pool Address" :value="pool.id" />
          <label-content-split label="Pool Name" value="123" />
        </div>
      </content-block>
    </b-col>
    <b-col md="8">
      <content-block title="Liquidity" :shadow-light="true">
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
import PoolLogos from "@/components/common/PoolLogos.vue";
import PoolName from "@/components/common/PoolName.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";

@Component({
  components: {
    LiquidityChart,
    Statistics,
    ContentBlock,
    DataTable,
    PoolLogos,
    PoolName,
    LabelContentSplit
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
