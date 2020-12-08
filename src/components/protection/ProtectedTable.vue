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
          <div v-if="item.collapsedData.length" class="grouped-pos-icon">+</div>
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
          v-if="false"
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

      <template #cell(apr)="{ value }">
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

      <template #cell(currentCoverage)="{ item }">
        <div class="d-flex flex-column font-size-12 font-w600">
          <span v-if="item.collapsedData.length" class="font-w500">
            Earliest position vesting time
          </span>
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

      <template #cell(actions)="{ item }">
        <b-btn
          v-if="!item.collapsedData.length"
          @click="goToWithdraw(item.positionId)"
          :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
        >
          Withdraw
        </b-btn>
        <div v-else class="text-center">Group</div>
      </template>
      <template #cellCollapsed(actions)="{ item }">
        <b-btn
          @click="goToWithdraw(item.id)"
          :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
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
  findOrThrow,
  formatUnixTime,
  prettifyNumber,
  stringifyPercentage
} from "@/api/helpers";
import { groupPositionsArray } from "@/api/pureHelpers";
import moment from "moment";
import { ViewGroupedPositions, ViewProtectedLiquidity } from "@/types/bancor";
import ProtectedEmpty from "@/components/protection/ProtectedEmpty.vue";
import CountdownTimer from "@/components/common/CountdownTimer.vue";
import RemainingTime2 from "@/components/common/RemainingTime2.vue";
import DataTable, { ViewTableField } from "@/components/common/DataTable.vue";
import BaseComponent from "@/components/BaseComponent.vue";

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
  prettifyNumber = prettifyNumber;

  get groupedPositions() {
    if (this.positions.length > 0) return groupPositionsArray(this.positions);
    else return [];
  }

  poolName(id: string): string {
    return buildPoolName(id);
  }

  insuranceStarted(unixTime: number) {
    return unixTime < moment().unix();
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
    const positions = this.positions;
    const position = findOrThrow(
      positions,
      pos => compareString(pos.id, id),
      `failed to find position of ID ${id} from position ids ${positions
        .map(position => position.id)
        .join(" ")}`
    );
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

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        key: "stake",
        label: "Initial Stake",
        tooltip: "Amount of tokens you originally staked in the pool.",
        minWidth: "170px"
      },
      {
        id: 2,
        key: "fullyProtected",
        label: "Protected",
        tooltip:
          "Amount of tokens you can withdraw with 100% protection + fees",
        minWidth: "160px"
      },
      {
        id: 3,
        key: "protectedAmount",
        label: "Claimable",
        tooltip:
          "Amount of tokens you can withdraw right now (assuming you have not earned full protection, this value will be lower than Protected Value)",
        minWidth: "160px"
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
        minWidth: "115px"
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
        minWidth: "130px",
        maxWidth: "130px"
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
      case "apr":
        return row.apr.day;
      // case "currentCoverage":
      //   return row.coverageDecPercent;
      default:
        return defaultTableSort(row, sortBy, true);
    }
  }
}
</script>

<style lang="scss">
@import "src/assets/_scss/custom/variables";

.grouped-pos-icon {
  border-radius: 8px;
  border: 1px solid $primary;
  color: $primary;
  padding: 0 5px;
  margin-left: 5px;
}
#protected-table {
  table {
    // display: block;
    // min-height: 300px;
  }
}
</style>
