<template>
  <div class="table-responsive">
    <table :class="darkMode ? 'dark-table' : 'table'">
      <table-header
        :fields="fields"
        :sort-by.sync="sortBy"
        :desc-order.sync="descOrder"
      />
      <tbody>
        <tr
          v-for="pool in paginatedPools"
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
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
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
  @Prop() filter!: string;

  numeral = numeral;

  sortBy: string = "liqDepth";
  descOrder: boolean = true;
  currentPage = 1;
  perPage = 25;

  get fields(): ViewTableFields[] {
    return [
      {
        label: "Token",
        key: "symbol"
      },
      {
        label: "Liquidity Depth",
        key: "liqDepth",
        minWidth: "160px"
      },
      {
        label: "Fee",
        key: "fee",
        minWidth: "80px"
      },
      // {
      //   label: "Ratio",
      //   minWidth: "80px"
      // },
      {
        label: "Actions",
        minWidth: "300px",
        maxWidth: "300px"
      }
    ];
  }

  ratio(pool: ViewRelay) {
    return pool.reserves
      .map(reserve => Number.parseInt(String(reserve.reserveWeight * 100)))
      .join("-");
  }

  get pools() {
    const pools = vxm.bancor.relays;
    const filtered = pools.filter((t: ViewRelay) =>
      t.symbol.includes(this.filter.toUpperCase())
    );
    const sorted = sort(filtered)[this.descOrder ? "desc" : "asc"](
      (t: any) => t[this.sortBy]
    );
    return sorted as ViewRelay[];
  }

  get paginatedPools() {
    return this.pools.slice(
      this.currentPage * this.perPage - this.perPage,
      this.currentPage * this.perPage
    );
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
