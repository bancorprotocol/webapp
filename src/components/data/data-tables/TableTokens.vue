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
          v-for="token in filteredTokens"
          :key="token.id"
          class="font-w600 font-size-14"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          <td scope="row"><pool-logos :token="token" :cursor="false" /></td>
          <td><colored-percentage :percentage="token.change24h" /></td>
          <td>{{ numeral(token.price).format("$0.0000") }}</td>
          <td>{{ numeral(token.volume24h).format("$0,0.00") }}</td>
          <td>{{ numeral(token.liqDepth).format("$0,0.00") }}</td>
          <td class="action-column">
            <b-btn
              :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
              class="btn-block"
            >
              Trade
            </b-btn>
          </td>
        </tr>
      </tbody>
    </table>

    <table-pagination
      :current-page.sync="currentPage"
      :row-count.sync="tokens.length"
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
import { ViewToken } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import numeral from "numeral";
import ColoredPercentage from "@/components/common/ColoredPercentage.vue";
import sort from "fast-sort";
import TablePagination from "@/components/common/TablePagination.vue";

@Component({
  components: {
    TableHeader,
    PoolLogos,
    ColoredPercentage,
    TablePagination
  }
})
export default class TableTokens extends Vue {
  numeral = numeral;

  sortBy: string = "liqDepth";
  descOrder: boolean = true;
  currentPage = 1;
  perPage = 25;

  get tokens() {
    const tokens = vxm.bancor.tokens;
    const result = sort(tokens)[this.descOrder ? "desc" : "asc"](
      (t: any) => t[this.sortBy]
    );
    return result as ViewToken[];
  }

  get filteredTokens() {
    return this.tokens.slice(
      this.currentPage * this.perPage - this.perPage,
      this.currentPage * this.perPage
    );
  }

  get fields(): ViewTableFields[] {
    return [
      {
        label: "Name",
        key: "symbol"
      },
      {
        label: "24h Change",
        key: "change24h",
        width: "135px"
      },
      {
        label: "Price USD",
        key: "price",
        width: "120px"
      },
      {
        label: "24h Volume",
        key: "volume24h",
        width: "120px"
      },
      {
        label: "Liquidity Depth",
        key: "liqDepth",
        width: "160px"
      },
      {
        label: "Actions"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
