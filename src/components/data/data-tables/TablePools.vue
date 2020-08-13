<template>
  <div>
    <table :class="darkMode ? 'dark-table' : 'table'">
      <table-header
        :fields="fields"
        :sort-by.sync="sortBy"
        :desc-order.sync="descOrder"
      />
      <tbody>
        <tr
          v-for="pool in filteredPools"
          :key="pool.id"
          class="font-w600 font-size-14"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          <td scope="row">
            <pool-logos :pool="pool" :cursor="false" :version="true" />
          </td>
          <td>{{ numeral(pool.liqDepth).format("$0,0.00") }}</td>
          <td>{{ numeral(pool.fee).format("0.00%") }}</td>
          <!-- <td>{{ ratio(pool) }}</td> -->
          <td><table-action-buttons :pool="pool" /></td>
        </tr>
      </tbody>
    </table>

    <table-pagination
      :current-page.sync="currentPage"
      :row-count.sync="pools.length"
      :per-page="perPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import TableHeader, {
  ViewTableFields
} from "@/components/common/TableHeader.vue";
import { ViewToken, ViewRelay } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import numeral from "numeral";
import ColoredPercentage from "@/components/common/ColoredPercentage.vue";
import sort from "fast-sort";
import TablePagination from "@/components/common/TablePagination.vue";
import TableActionButtons from "@/components/common/TableActionButtons.vue";

@Component({
  components: {
    TableHeader,
    PoolLogos,
    ColoredPercentage,
    TablePagination,
    TableActionButtons
  }
})
export default class TablePools extends Vue {
  numeral = numeral;

  sortBy: string = "liqDepth";
  descOrder: boolean = true;
  currentPage = 1;
  perPage = 25;

  ratio(pool: ViewRelay) {
    return pool.reserves
      .map(reserve => Number.parseInt(String(reserve.reserveWeight * 100)))
      .join("-");
  }

  get pools() {
    const tokens = vxm.bancor.relays;
    const result = sort(tokens)[this.descOrder ? "desc" : "asc"](
      (t: any) => t[this.sortBy]
    );
    return result as ViewRelay[];
  }

  get filteredPools() {
    return this.pools.slice(
      this.currentPage * this.perPage - this.perPage,
      this.currentPage * this.perPage
    );
  }

  get fields(): ViewTableFields[] {
    return [
      {
        label: "Token",
        key: "symbol"
      },
      {
        label: "Liquidity Depth",
        key: "liqDepth",
        width: "160px"
      },
      {
        label: "Fee",
        key: "fee",
        width: "80px"
      },
      // {
      //   label: "Ratio",
      //   width: "80px"
      // },
      {
        label: "Actions",
        width: "300px"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
