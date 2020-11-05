<template>
  <table-wrapper
    v-if="false"
    primarykey="id"
    :items="items"
    :fields="fields"
    :filter="filter"
    :filterFunction="doFilter"
    sort-by="liqDepth"
  >
    <template v-slot:head(liqDepth)="data">
      {{ data.label }}
      <font-awesome-icon
        v-b-popover.hover.top="toolTips.liqDepth"
        icon="info-circle"
      />
    </template>

    <template v-slot:head(fee)="data">
      {{ data.label }}
      <font-awesome-icon
        v-b-popover.hover.top="toolTips.fee"
        icon="info-circle"
      />
    </template>

    <template v-slot:head(feesGenerated)="data">
      {{ data.label }}
      <font-awesome-icon
        v-b-popover.hover.top="toolTips.feesGenerated"
        icon="info-circle"
      />
    </template>

    <template v-slot:head(feesVsLiquidity)="data">
      {{ data.label }}
      <font-awesome-icon
        v-b-popover.hover.top="toolTips.feesVsLiquidity"
        icon="info-circle"
      />
    </template>

    <template v-slot:cell(symbol)="data">
      <pool-logos :pool="data.item" :cursor="false" />

      <!-- <router-link :to="{ name: 'DetailsPool', params: { id: data.item.id } }">
        <pool-logos :pool="data.item" :cursor="false" :version="true" />
      </router-link>-->
    </template>

    <template v-slot:head(liquidityProtection)="data">
      <img :src="require(`@/assets/media/icons/liquidity.svg`)" />
    </template>

    <template v-slot:cell(liquidityProtection)="data">
      <img
        v-if="data.value"
        :src="require(`@/assets/media/icons/liquidity_active.svg`)"
      />
    </template>

    <template v-slot:cell(actionButtons)="data">
      <action-buttons :pool="data.item" />
    </template>
  </table-wrapper>

  <data-table
    v-else
    :fields="fields2"
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
      <td><action-buttons :pool="pool" /></td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TableWrapper from "@/components/common/TableWrapper.vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { ViewRelay } from "@/types/bancor";
import { formatPercent, prettifyNumber } from "@/api/helpers";
import BigNumber from "bignumber.js";
import DataTable from "@/components/common/DataTable.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";

@Component({
  components: { DataTable, PoolLogos, ActionButtons, TableWrapper }
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

  get toolTips() {
    const tooltips = {
      liqDepth: "The value of tokens in the pool.",
      fee: "The % deducted from each swap and re-deposited into the pool.",
      feesGenerated:
        "The value of swap fees collected in the pool in the past 24h.",
      feesVsLiquidity: "24h fees annualized divided by liquidity in the pool."
    };
    return tooltips;
  }

  get fields2(): ViewTableFields[] {
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
        minWidth: "150px"
      },
      {
        label: "Fee",
        key: "fee",
        minWidth: "80px"
      },
      ...(this.isEth
        ? [
            {
              label: "Volume (24h)",
              key: "volume",
              minWidth: "140px"
            },
            { label: "Fees (24hr)", key: "feesGenerated", minWidth: "100px" },
            {
              label: "1y Fees / Liquidity",
              key: "feesVsLiquidity",
              minWidth: "120px"
            }
          ]
        : []),
      {
        label: "Actions",
        minWidth: "310px",
        maxWidth: "310px"
      }
    ];
  }

  get fields() {
    return [
      {
        key: "liquidityProtection",
        sortable: true
      },
      {
        key: "symbol",
        label: "Name",
        sortable: true,
        thStyle: { "min-width": "150px" }
      },
      {
        key: "liqDepth",
        label: "Liquidity",
        thStyle: { "min-width": "150px" },
        sortable: true,
        formatter: (value: number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(value)
      },
      {
        key: "fee",
        label: "Fee",
        thStyle: { "min-width": "80px" },
        sortable: true,
        formatter: formatPercent
      },
      ...(this.isEth
        ? [
            {
              key: "volume",
              label: "Volume (24hr)",
              sortable: true,
              thStyle: { "min-width": "140px" },
              formatter: (value: string) =>
                value && new BigNumber(value).isGreaterThan(0)
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD"
                    }).format(Number(value))
                  : "N/A"
            },
            {
              key: "feesGenerated",
              label: "Fees (24hr)",
              sortable: true,
              thStyle: { "min-width": "100px" },
              formatter: (value: string) =>
                value && new BigNumber(value).isGreaterThan(0)
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD"
                    }).format(Number(value))
                  : "N/A"
            },
            {
              key: "feesVsLiquidity",
              label: "1y Fees / Liquidity",
              sortable: true,
              thStyle: { "min-width": "120px" },
              formatter: (value: string) =>
                value && new BigNumber(value).isGreaterThan(0)
                  ? formatPercent(value)
                  : "N/A"
            }
          ]
        : []),
      {
        key: "actionButtons",
        label: "Action",
        thStyle: { width: "310px", "min-width": "310px" }
      }
    ];
  }

  get isEth() {
    return this.$route.params.service == "eth";
  }

  doFilter(row: ViewRelay, filter: string) {
    const symbols = row.reserves.map(reserve => reserve.symbol.toLowerCase());
    return symbols.some(symbol => symbol.includes(filter.toLowerCase()));
  }
}
</script>

<style lang="scss"></style>
