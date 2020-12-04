<template>
  <div id="protected-table">
    <data-table
      v-if="positions.length"
      :fields="fields"
      :items="groupedPositions"
      :collapsable="true"
      :filter="search"
      filter-by="stake"
      :filter-function="doFilter"
      :sort-function="customSort"
      default-sort="roi"
      default-order="desc"
    >
      <template #cell(stake)="{ item, value }">
        <div>
          {{ `${prettifyNumber(value.amount)} ${item.symbol}` }}
        </div>
        <div
          v-if="value && value.usdValue !== undefined"
          v-text="`(~${prettifyNumber(value.usdValue, true)})`"
          class="font-size-12 font-w400 text-primary"
        />
        <div class="d-flex align-items-center">
          <pool-logos-overlapped
            :pool-id="item.poolId"
            size="20"
            class="mr-1"
          />
          {{ poolName(item.poolId) }}
        </div>
      </template>
      <template #cellCollapsed(stake)="{ value }">
        <div>
          {{ `${prettifyNumber(value.amount)} ${value.symbol}` }}
        </div>
        <div
          v-if="value && value.usdValue !== undefined"
          v-text="`(~${prettifyNumber(value.usdValue, true)})`"
          class="font-size-12 font-w400 text-primary"
        />
        <div
          v-text="formatDate(value.unixTime).dateTime"
          class="font-size-12 font-w400"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        />
        <div class="d-flex align-items-center">
          <pool-logos-overlapped
            :pool-id="value.poolId"
            size="20"
            class="mr-1"
          />
          {{ poolName(value.poolId) }}
        </div>
      </template>

      <template #cell(fullyProtected)="{ item, value }">
        <div class="d-flex align-items-start">
          <span
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${item.symbol}`
                : 'Stale data'
            "
          />
        </div>
        <span
          v-if="
            value &&
            value.usdValue !== undefined &&
            typeof value.amount !== 'undefined'
          "
          v-text="`(~${prettifyNumber(value.usdValue, true)})`"
          class="font-size-12 font-w400 text-primary"
        />
      </template>
      <template #cellCollapsed(fullyProtected)="{ value }">
        <div class="d-flex align-items-start">
          <span
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${value.symbol}`
                : 'Stale data'
            "
          />
        </div>
        <span
          v-if="
            value &&
            value.usdValue !== undefined &&
            typeof value.amount !== 'undefined'
          "
          v-text="`(~${prettifyNumber(value.usdValue, true)})`"
          class="font-size-12 font-w400 text-primary"
        />
      </template>

      <template #cell(protectedAmount)="{ item, value }">
        <div class="d-flex align-items-start">
          <span
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${item.symbol}`
                : 'please refresh'
            "
          />
        </div>
        <span
          v-if="
            value &&
            value.usdValue !== undefined &&
            typeof value.amount !== 'undefined'
          "
          v-text="`(~${prettifyNumber(value.usdValue, true)})`"
          class="font-size-12 font-w400 text-primary"
        />
      </template>
      <template #cellCollapsed(protectedAmount)="{ value }">
        <div class="d-flex align-items-start">
          <span
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${value.symbol}`
                : 'please refresh'
            "
          />
        </div>
        <span
          v-if="
            value &&
            value.usdValue !== undefined &&
            typeof value.amount !== 'undefined'
          "
          v-text="`(~${prettifyNumber(value.usdValue, true)})`"
          class="font-size-12 font-w400 text-primary"
        />
      </template>

      <template #cell(fees)="{ item, value }">
        <div class="text-center">
          {{ `${prettifyNumber(value)} ${item.symbol}` }}
        </div>
      </template>
      <template #cellCollapsed(fees)="{ value }">
        <div class="text-center">
          {{ `${prettifyNumber(value.amount)} ${value.symbol}` }}
        </div>
      </template>

      <template #cell(roi)="{ value }">
        <div class="text-center">
          {{
            typeof value !== "undefined" ? stringifyPercentage(value) : "N/A"
          }}
        </div>
      </template>
      <template #cellCollapsed(roi)="{ value }">
        <div class="text-center">
          {{
            typeof value !== "undefined" ? stringifyPercentage(value) : "N/A"
          }}
        </div>
      </template>

      <template #cellCollapsed(apr)="{ value }">
        <div class="d-flex align-items-center">
          <b-badge class="badge-version text-primary px-2 mr-2">1d</b-badge>
          {{
            typeof value.day !== "undefined"
              ? stringifyPercentage(value.day)
              : "N/A"
          }}
        </div>
        <div class="d-flex align-items-center my-1">
          <b-badge class="badge-version text-primary px-2 mr-2">1w</b-badge>
          {{
            typeof value.week !== "undefined"
              ? stringifyPercentage(value.week)
              : "N/A"
          }}
        </div>
      </template>

      <template #cellCollapsed(currentCoverage)="{ item }">
        <div class="d-flex flex-column font-size-12 font-w600">
          {{ stringifyPercentage(item.coverageDecPercent) }}
          <div
            v-if="!insuranceStarted(item.insuranceStart)"
            class="d-flex justify-content-between align-items-center text-danger"
          >
            <div>
              Cliff:
              <countdown-timer :date-unix="item.insuranceStart" />
            </div>
            <font-awesome-icon
              icon="info-circle"
              :id="'popover-cliff-' + item.id"
            />
            <b-popover
              :target="'popover-cliff-' + item.id"
              triggers="hover"
              placement="bottom"
            >
              Impermanent loss protection starts vesting immediately when you
              deposit. But you must be in the pool until the cliff is reached
              before the protection can be utilized.
            </b-popover>
          </div>
        </div>

        <remaining-time2
          :from="item.stake.unixTime * 1000"
          :to="item.fullCoverage * 1000"
          class="mt-1"
        />
      </template>

      <template #cellCollapsed(actions)="{ item }">
        <b-btn
          @click="goToWithdraw(item.id)"
          :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
          class="table-button"
        >
          Withdraw
        </b-btn>
      </template>
    </data-table>

    <protected-empty v-else class="mx-3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import {
  buildPoolName,
  compareString,
  defaultTableSort,
  formatUnixTime,
  prettifyNumber,
  stringifyPercentage
} from "@/api/helpers";
import numeral from "numeral";
import moment from "moment";
import { ViewProtectedLiquidity } from "@/types/bancor";
import ProtectedEmpty from "@/components/protection/ProtectedEmpty.vue";
import CountdownTimer from "@/components/common/CountdownTimer.vue";
import RemainingTime2 from "@/components/common/RemainingTime2.vue";
import DataTable, { ViewTableField } from "@/components/common/DataTable.vue";
import BaseComponent from "@/components/BaseComponent.vue";

interface ViewGroupedPositions {
  id: string;
  poolId: string;
  symbol: string;
  stake: {
    amount: number;
    usdValue: number;
  };
  protectedAmount: {
    amount: number;
    usdValue: number;
  };
  fullyProtected: {
    amount: number;
    usdValue: number;
  };
  fees: number;
  roi: number;
  collapsedData: ViewProtectedLiquidity[];
}

@Component({
  components: {
    DataTable,
    RemainingTime2,
    CountdownTimer,
    ProtectedEmpty,
    PoolLogosOverlapped,
    ContentBlock
  }
})
export default class ProtectedTable extends BaseComponent {
  @Prop({ default: "" }) search!: string;
  @Prop() positions!: ViewProtectedLiquidity[];

  stringifyPercentage = stringifyPercentage;

  get groupedPositions() {
    const groupArray = (arr: ViewProtectedLiquidity[]) => {
      const res: ViewGroupedPositions[] = arr.reduce(
        (obj => (acc: any, val: ViewProtectedLiquidity) => {
          const symbol = val.stake.symbol;
          const poolId = val.stake.poolId;
          const id = `${poolId}-${symbol}`;
          let item: ViewGroupedPositions = obj.get(id);
          if (!item) {
            //@ts-ignore
            item = new Object({ stake: "0" });
            item.collapsedData = [];
            item.id = id;

            const filtered = this.positions.filter(
              x => x.stake.poolId === poolId && x.stake.symbol === symbol
            );

            const sumStakeAmount = filtered
              .map(x => Number(x.stake.amount || 0))
              .reduce((sum, current) => sum + current);
            const sumStakeUsd = filtered
              .map(x => Number(x.stake.usdValue || 0))
              .reduce((sum, current) => sum + current);

            const sumProtectedValueAmount = filtered
              .map(x => Number(x.fullyProtected ? x.fullyProtected.amount : 0))
              .reduce((sum, current) => sum + current);
            const sumProtectedValueUsd = filtered
              .map(x =>
                Number(x.fullyProtected ? x.fullyProtected.usdValue : 0)
              )
              .reduce((sum, current) => sum + current);

            const sumProtectedAmount = filtered
              .map(x =>
                Number(x.protectedAmount ? x.protectedAmount.amount : 0)
              )
              .reduce((sum, current) => sum + current);
            const sumProtectedAmountUsd = filtered
              .map(x =>
                Number(x.protectedAmount ? x.protectedAmount.usdValue : 0)
              )
              .reduce((sum, current) => sum + current);
            const sumFees = filtered
              .map(x => Number(x.fees ? x.fees.amount : 0))
              .reduce((sum, current) => sum + current);

            item.poolId = poolId;
            item.symbol = val.stake.symbol;
            item.stake = { amount: sumStakeAmount, usdValue: sumStakeUsd };
            item.fullyProtected = {
              amount: sumProtectedValueAmount,
              usdValue: sumProtectedValueUsd
            };
            item.protectedAmount = {
              amount: sumProtectedAmount,
              usdValue: sumProtectedAmountUsd
            };
            item.roi =
              (sumProtectedValueAmount - sumStakeAmount) / sumStakeAmount;
            item.fees = sumFees;

            obj.set(id, item);
            acc.push(item);
          }
          item.collapsedData.push(val);
          return acc;
        })(new Map()),
        []
      );
      return res;
    };

    if (this.positions.length > 0) return groupArray(this.positions);
    else return [];
  }

  poolName(id: string): string {
    return buildPoolName(id);
  }

  insuranceStarted(unixTime: number) {
    return unixTime < Date.now() / 1000;
  }

  formatEndTime(fullCoverageSeconds: number) {
    const timeNow = moment();
    const fullCoverage = moment.unix(fullCoverageSeconds);
    const reachedFullCoverage = timeNow.isAfter(fullCoverage);
    if (reachedFullCoverage) {
      return "Full coverage achieved";
    } else {
      const timeLeft = moment.unix(fullCoverageSeconds).fromNow(true);
      return `${timeLeft} left until full coverage`;
    }
  }

  goToWithdraw(id: string) {
    const position = this.positions.find(pos => compareString(pos.id, id))!;
    const routeName = position.single
      ? "WithdrawProtectionSingle"
      : "WithdrawProtectionDouble";
    this.$router.push({
      name: routeName,
      params: { id }
    });
  }

  formatDate(unixTime: number) {
    return formatUnixTime(unixTime);
  }

  prettifyNumber(number: string | number, usd = false): string {
    return prettifyNumber(number, usd);
  }

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        key: "stake",
        label: "Initial Stake",
        tooltip: "Amount of tokens you originally staked in the pool.",
        minWidth: "160px"
      },
      {
        id: 2,
        key: "fullyProtected",
        label: "Protected Value",
        tooltip:
          "Amount of tokens you can withdraw with 100% protection + fees",
        minWidth: "185px"
      },
      {
        id: 3,
        key: "protectedAmount",
        label: "Claimable Value",
        tooltip:
          "Amount of tokens you can withdraw right now (assuming you have not earned full protection, this value will be lower than Protected Value)",
        minWidth: "180px"
      },
      {
        id: 4,
        key: "fees",
        label: "Fees",
        tooltip: "Fees your stake has earned since you entered the pool.",
        minWidth: "110px",
        thClass: "text-center"
      },
      {
        id: 5,
        key: "roi",
        label: "ROI",
        tooltip:
          "The ROI of your fully protected value vs. your initial stake.",
        minWidth: "75px",
        thClass: "text-center"
      },
      {
        id: 6,
        key: "apr",
        label: "Apr",
        tooltip:
          "Estimated calculation for annual returns based on historical activity (i.e., 7d = 7d fees/liquidity)",
        sortable: true,
        minWidth: "100px"
      },
      {
        id: 7,
        key: "currentCoverage",
        label: "Current Coverage",
        tooltip:
          "The impermanent loss protection you have accrued. Impermanent loss protection starts 30 days after your deposit, at a rate of 30% and gradually increases 1% per day until you reach 100% protection.",
        minWidth: "195px"
      },
      {
        id: 8,
        key: "actions",
        label: "",
        sortable: false,
        minWidth: "160px",
        maxWidth: "160px"
      }
    ];
  }

  doFilter(row: ViewGroupedPositions, filter: string) {
    return (row.symbol as string).toLowerCase().includes(filter.toLowerCase());
  }

  customSort(row: ViewGroupedPositions, sortBy: string) {
    switch (sortBy) {
      case "stake":
        return row.stake.usdValue;
      case "fullyProtected":
        return row.fullyProtected.usdValue;
      case "protectedAmount":
        return row.protectedAmount.usdValue;
      // case "apr":
      //   return row.apr.day;
      // case "currentCoverage":
      //   return row.coverageDecPercent;
      default:
        return defaultTableSort(row, sortBy, true);
    }
  }
}
</script>

<style lang="scss">
#protected-table {
  table {
    // display: block;
    // min-height: 300px;
  }
}
</style>
