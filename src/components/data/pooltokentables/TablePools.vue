<template>
  <data-table
    :fields="fields"
    :items="items"
    :filter="filter"
    :filter-function="doFilter"
    :sort-function="customSort"
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
      <div v-if="value && value.rewards">
        <template v-for="reward in value.rewards">
          <div :key="reward.address" class="font-size-12">
            {{
              `${reward.symbol} ${
                reward.reward ? formatPercent(reward.reward) : "N/A"
              }`
            }}
          </div>
        </template>
        <b-badge variant="danger">
          <countdown-timer
            :date-unix="value.endTime"
            msg-countdown-ended="Rewards ended"
          />
        </b-badge>
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
import { LiqMiningApr, ViewRelay } from "@/types/bancor";
import { defaultTableSort, formatPercent, prettifyNumber } from "@/api/helpers";
import BigNumber from "bignumber.js";
import DataTable from "@/components/common/DataTable.vue";
import { ViewTableField } from "@/components/common/DataTable.vue";
import CountdownTimer from "@/components/common/CountdownTimer.vue";

@Component({
  components: { CountdownTimer, DataTable, PoolLogos, ActionButtons }
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
          "Estimated APR based on the maximum (2x multiplier) weekly BNT Liquidity Mining rewards. Counter indicates time until 12-week rewards cycle concludes. Rewards are pending governance.",
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
              label: "APR",
              key: "feesVsLiquidity",
              tooltip: "24h fees annualized divided by liquidity in the pool.",
              minWidth: "80px"
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

  customSort(row: ViewRelay, sortBy: string) {
    switch (sortBy) {
      case "liquidityProtection":
        return row.liquidityProtection;
      case "symbol":
        return row.symbol;
      case "aprMiningRewards": {
        const rewards = row.aprMiningRewards;
        if (rewards) {
          const reward = rewards.rewards.find(
            (r: LiqMiningApr) => r.symbol !== "BNT"
          );
          return reward ? reward.reward : null;
        }
        return null;
      }
      default:
        return defaultTableSort(row, sortBy);
    }
  }

  get isEth() {
    return this.$route.params.service == "eth";
  }
}
</script>

<style lang="scss"></style>
