<template>
  <data-table
    :fields="fields"
    :items="items"
    :filter="filter"
    :filter-functions="[doFilter]"
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
          <div
            v-if="!timeEnded(value.endTime)"
            :key="reward.address"
            class="font-size-12"
          >
            {{
              `${reward.symbol} ${
                reward.reward ? formatPercent(reward.reward) : "N/A"
              }`
            }}
          </div>
        </template>
        <b-badge v-if="!timeEnded(value.endTime)" variant="danger">
          <countdown-timer :date-unix="value.endTime" />
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
      <action-buttons
        :pool="item"
        :small="true"
        :loading="whiteListedPoolsLoading"
      />
    </template>
  </data-table>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { i18n } from "@/i18n";
import ActionButtons from "@/components/common/ActionButtons.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { LiqMiningApr, ViewRelay, ViewTableField } from "@/types/bancor";
import { defaultTableSort, formatPercent } from "@/api/helpers";
import BigNumber from "bignumber.js";
import DataTable from "@/components/common/DataTable.vue";
import CountdownTimer from "@/components/common/CountdownTimer.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { vxm } from "@/store";

@Component({
  components: { CountdownTimer, DataTable, PoolLogos, ActionButtons }
})
export default class TablePools extends BaseComponent {
  @Prop() items!: ViewRelay[];
  @Prop() filter!: string;

  private now: number = Date.now() / 1000;

  get whiteListedPoolsLoading() {
    return vxm.ethBancor.whiteListedPoolsLoading;
  }

  formatPercent(percentage: string | number) {
    return new BigNumber(percentage).gte(0) ? formatPercent(percentage) : "N/A";
  }

  get fields(): ViewTableField[] {
    return [
      ...(this.isEth
        ? [
            {
              id: 1,
              label: "",
              key: "liquidityProtection",
              minWidth: "70px",
              maxWidth: "70px"
            }
          ]
        : []),
      {
        id: 2,
        label: i18n.tc("name"),
        key: "symbol",
        minWidth: "160px"
      },
      {
        id: 3,
        label: i18n.tc("liquidity"),
        key: "liqDepth",
        tooltip: i18n.tc("value_tokens_pool"),
        minWidth: "120px"
      },
      {
        id: 4,
        label: i18n.tc("rewards"),
        key: "aprMiningRewards",
        tooltip: i18n.tc("estimated_apr"),
        minWidth: "150px"
      },
      {
        id: 5,
        label: i18n.tc("fee"),
        key: "fee",
        tooltip: i18n.tc("percentage_deducted"),
        minWidth: "80px"
      },
      ...(this.isEth
        ? [
            {
              id: 6,
              label: i18n.tc("volume"),
              key: "volume",
              minWidth: "140px"
            },
            {
              id: 7,
              label: i18n.tc("fees"),
              key: "feesGenerated",
              tooltip: i18n.tc("value_swap"),
              minWidth: "140px"
            },
            {
              id: 8,
              label: "APR",
              key: "feesVsLiquidity",
              tooltip: i18n.tc("fees_24"),
              minWidth: "85px"
            }
          ]
        : []),
      {
        id: 9,
        label: i18n.tc("actions"),
        key: "actions",
        sortable: false,
        minWidth: "150px",
        maxWidth: "150px"
      }
    ];
  }

  timeEnded(dateUnix: number) {
    const remainingTime = dateUnix - this.now;
    return remainingTime < 0;
  }

  doFilter(row: ViewRelay) {
    const symbols = row.reserves.map(reserve => reserve.symbol.toLowerCase());
    return symbols.some(symbol => symbol.includes(this.filter.toLowerCase()));
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
