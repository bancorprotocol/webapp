<template>
  <data-table
    :fields="fields"
    :items="items"
    :filter="filter"
    :filter-function="doFilter"
    default-sort="liqDepth"
  >
    <template #head(liquidityProtection)>
      <img :src="require(`@/assets/media/icons/liquidity.svg`)" class="mr-1" />
    </template>

    <template #cell(liquidityProtection)="{ value }">
      <img
        v-if="value"
        :src="require(`@/assets/media/icons/liquidity_active.svg`)"
      />
      <span v-else />
    </template>

    <template #cell(symbol)="{ item }">
      <pool-logos :pool="item" :cursor="false" />
    </template>

    <template #cell(aprMiningRewards)="{ value }">
      <div v-if="value">
        <template v-for="reward in value.rewards">
          <div :key="reward.address">
            {{
              `${reward.symbol} ${
                reward.reward ? prettifyNumber(reward.reward) : "????"
              }`
            }}
          </div>
        </template>
      </div>
    </template>

    <template #cell(liqDepth)="{ value }">
      {{ prettifyNumber(value, true) }}
    </template>

    <template #cell(fee)="{ value }">
      {{ formatPercent(value) }}
    </template>

    <template #cell(volume)="{ value }">
      {{ prettifyNumber(value, true) }}
    </template>

    <template #cell(feesGenerated)="{ value }">
      {{ prettifyNumber(value, true) }}
    </template>

    <template #cell(feesVsLiquidity)="{ value }">
      {{ formatPercent(value) }}
    </template>

    <template #cell(actions)="{ item }">
      <action-buttons :pool="item" :small="true" />
    </template>
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
import { ViewTableField } from "@/components/common/DataTable.vue";

@Component({
  components: { DataTable, PoolLogos, ActionButtons }
})
export default class TablePools extends Vue {
  @Prop() items!: ViewRelay[];
  @Prop() filter!: string;

  formatPercent(percentage: string | number) {
    return new BigNumber(percentage).gte(0) ? formatPercent(percentage) : "N/A";
  }
  prettifyNumber = prettifyNumber;

  get aprsExist() {
    return this.items.some(pool => pool.apr);
  }

  get fields(): ViewTableField[] {
    return [
      ...(this.isEth
        ? [
            {
              id: 1,
              label: "",
              key: "liquidityProtection",
              minWidth: "60px",
              maxWidth: "60px"
            }
          ]
        : []),
      {
        id: 2,
        label: "Name",
        key: "symbol",
        minWidth: "150px"
      },
      {
        id: 3,
        label: "Liquidity",
        key: "liqDepth",
        tooltip: "The value of tokens in the pool.",
        minWidth: "120px"
      },
      {
        id: 4,
        label: "Rewards",
        key: "aprMiningRewards",
        tooltip:
          "Estimated APR based on weekly BNT Liquidity Mining rewards (pending governance vote). Counter indicates time until 12-week rewards cycle concludes.",
        minWidth: "150px"
      },
      {
        id: 5,
        label: "Fee",
        key: "fee",
        tooltip:
          "The % deducted from each swap and re-deposited into the pool.",
        minWidth: "80px"
      },
      ...(this.isEth
        ? [
            {
              id: 6,
              label: "Volume (24h)",
              key: "volume",
              minWidth: "140px"
            },
            {
              id: 7,
              label: "Fees (24hr)",
              key: "feesGenerated",
              tooltip:
                "The value of swap fees collected in the pool in the past 24h.",
              minWidth: "140px"
            },
            {
              id: 8,
              label: "1y Fees / Liquidity",
              key: "feesVsLiquidity",
              tooltip: "24h fees annualized divided by liquidity in the pool.",
              minWidth: "190px"
            }
          ]
        : []),
      {
        id: 9,
        label: "Actions",
        key: "actions",
        sortable: false,
        minWidth: "150px",
        maxWidth: "150px"
      }
    ];
  }

  doFilter(row: ViewRelay, filter: string) {
    const symbols = row.reserves.map(reserve => reserve.symbol.toLowerCase());
    return symbols.some(symbol => symbol.includes(filter.toLowerCase()));
  }

  get isEth() {
    return this.$route.params.service == "eth";
  }
}
</script>

<style lang="scss"></style>
