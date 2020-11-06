<template>
  <data-table
    :fields="fields"
    :items="items"
    v-model="paginatedItems"
    :filter="filter"
    filter-by="symbol"
    default-sort="liqDepth"
  >
    <tr v-for="pool in paginatedItems" :key="pool.id">
      <td v-if="isEth">
        <img
          v-if="pool.liquidityProtection"
          :src="require(`@/assets/media/icons/liquidity_active.svg`)"
        />
      </td>
      <td><pool-logos :pool="pool" :cursor="false" /></td>
      <td>{{ prettifyNumber(pool.liqDepth, true) }}</td>
      <td>{{ formatPercent(pool.fee) }}</td>
      <td v-if="isEth">{{ prettifyNumber(pool.volume, true) }}</td>
      <td v-if="isEth">{{ prettifyNumber(pool.feesGenerated, true) }}</td>
      <td v-if="isEth">{{ formatPercent(pool.feesVsLiquidity) }}</td>
      <td><action-buttons :pool="pool" :small="true" /></td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ActionButtons from "@/components/common/ActionButtons.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { ViewRelay } from "@/types/bancor";
import { formatPercent, prettifyNumber } from "@/api/helpers";
import BigNumber from "bignumber.js";
import DataTable from "@/components/common/DataTable.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";

@Component({
  components: { DataTable, PoolLogos, ActionButtons }
})
export default class TablePools extends Vue {
  @Prop() items!: ViewRelay[];
  @Prop() filter!: string;

  paginatedItems: ViewRelay[] = [];

  formatPercent(percentage: string | number) {
    return new BigNumber(percentage).gte(0) ? formatPercent(percentage) : "N/A";
  }
  prettifyNumber = prettifyNumber;

  get aprsExist() {
    return this.items.some(pool => pool.apr);
  }

  get fields(): ViewTableFields[] {
    return [
      ...(this.isEth
        ? [
            {
              label: "",
              key: "liquidityProtection",
              minWidth: "60px",
              maxWidth: "60px"
            }
          ]
        : []),
      {
        label: "Name",
        key: "symbol",
        minWidth: "150px"
      },
      {
        label: "Liquidity",
        key: "liqDepth",
        tooltip: "The value of tokens in the pool.",
        minWidth: "150px"
      },
      {
        label: "Fee",
        key: "fee",
        tooltip:
          "The % deducted from each swap and re-deposited into the pool.",
        minWidth: "80px"
      },
      ...(this.isEth
        ? [
            {
              label: "Volume (24h)",
              key: "volume",
              minWidth: "140px"
            },
            {
              label: "Fees (24hr)",
              key: "feesGenerated",
              tooltip:
                "The value of swap fees collected in the pool in the past 24h.",
              minWidth: "100px"
            },
            {
              label: "1y Fees / Liquidity",
              key: "feesVsLiquidity",
              tooltip: "24h fees annualized divided by liquidity in the pool.",
              minWidth: "120px"
            }
          ]
        : []),
      {
        label: "Actions",
        minWidth: "150px",
        maxWidth: "150px"
      }
    ];
  }

  get isEth() {
    return this.$route.params.service == "eth";
  }
}
</script>

<style lang="scss"></style>
