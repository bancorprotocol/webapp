<template>
  <div id="protected-table">
    <data-table
      :fields="fields"
      :items="groupedPositions"
      :collapsable="true"
      :filter="search"
      filter-by="stake"
      :filter-functions="[
        doFilter,
        ...(filterFunctions ? filterFunctions : [])
      ]"
      :sort-function="customSort"
      default-sort="stake"
      default-order="desc"
    >
      <template #cell(pool)="{ item }">
        <img
          :key="item.poolId"
          class="img-avatar img-avatar20 bg-white logo-shadow"
          :src="poolLogo(item.poolId, item.symbol)"
          :alt="$t('token_logo')"
        />

        <span class="font-w400">
          {{ item.symbol }}
          <div
            class="font-size-12 ml-4 mt-1"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ poolName(item.poolId) }}
          </div>
        </span>
      </template>

      <template #cellCollapsed(pool)="{ item }">
        <img
          :key="item.stake.poolId"
          class="img-avatar img-avatar20 bg-white logo-shadow"
          :src="poolLogo(item.stake.poolId, item.stake.symbol)"
          :alt="$t('token_logo')"
        />

        <span class="font-w400">
          {{ item.stake.symbol }}
          <div
            class="font-size-12 mt-1"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ poolName(item.stake.poolId) }}
          </div>
        </span>
      </template>

      <template #cell(stake)="{ item, value, isCollapsable }">
        <div :id="`popover-stake-${item.id}`" class="text-center py-3">
          <div class="font-w400">
            {{ `${prettifyNumber(value.amount)} ${item.symbol}` }}
          </div>
          <div
            v-if="value && value.usdValue !== undefined"
            v-text="`(~${prettifyNumber(value.usdValue, true)})`"
            class="font-size-12 font-w400 mt-1"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          />
          <b-popover
            v-if="!isCollapsable"
            :target="`popover-stake-${item.id}`"
            triggers="hover"
            placement="top"
            class="font-size-12 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ formatDate(value.unixTime).dateTime }}
          </b-popover>
        </div>
      </template>
      <template #cellCollapsed(stake)="{ item, value }">
        <div :id="`popover-stake-${item.id}`" class="text-center">
          <div class="font-w400">
            {{ `${prettifyNumber(value.amount)} ${value.symbol}` }}
          </div>
          <div
            v-if="value && value.usdValue !== undefined"
            v-text="`(~${prettifyNumber(value.usdValue, true)})`"
            class="font-size-12 font-w400 mt-1"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          />
          <b-popover
            :target="`popover-stake-${item.id}`"
            triggers="hover"
            placement="top"
            class="font-size-12 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ formatDate(value.unixTime).dateTime }}
          </b-popover>
        </div>
      </template>

      <template #cell(fullyProtected)="{ item, value }">
        <div class="text-center">
          <div
            class="font-w400"
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${item.symbol}`
                : $t('stale_data')
            "
          />

          <div
            v-if="
              value &&
              value.usdValue !== undefined &&
              typeof value.amount !== 'undefined'
            "
            v-text="`(~${prettifyNumber(value.usdValue, true)})`"
            class="font-size-12 font-w400 mt-1"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          />
        </div>
      </template>
      <template #cellCollapsed(fullyProtected)="{ value }">
        <div class="text-center">
          <div
            class="font-w400"
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${value.symbol}`
                : $t('stale_data')
            "
          />
          <div
            v-if="
              value &&
              value.usdValue !== undefined &&
              typeof value.amount !== 'undefined'
            "
            v-text="`(~${prettifyNumber(value.usdValue, true)})`"
            class="font-size-12 font-w400 mt-1"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          />
        </div>
      </template>

      <template #cell(protectedAmount)="{ item, value }">
        <div class="text-center">
          <div
            class="font-w400"
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${item.symbol}`
                : $t('please_refresh')
            "
          />

          <div
            v-if="
              value &&
              value.usdValue !== undefined &&
              typeof value.amount !== 'undefined'
            "
            v-text="`(~${prettifyNumber(value.usdValue, true)})`"
            class="font-size-12 font-w400 mt-1"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          />
        </div>
      </template>
      <template #cellCollapsed(protectedAmount)="{ value }">
        <div class="text-center">
          <div
            class="font-w400"
            v-text="
              value && typeof value.amount !== 'undefined'
                ? `${prettifyNumber(value.amount)} ${value.symbol}`
                : $t('please_refresh')
            "
          />
          <div
            v-if="
              value &&
              value.usdValue !== undefined &&
              typeof value.amount !== 'undefined'
            "
            v-text="`(~${prettifyNumber(value.usdValue, true)})`"
            class="font-size-12 font-w400 mt-1"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          />
        </div>
      </template>

      <template #cell(fees)="{ item, value }">
        <div :id="`popover-fees-${item.id}`" class="text-center font-w400">
          <div>
            {{ `${prettifyNumber(value)} ${item.symbol}` }}
          </div>
          <b-badge
            v-if="new BigNumber(item.pendingReserveReward).gt(0)"
            class="font-size-12 font-w500 p-1"
            :class="darkMode ? 'badge-dark' : 'badge-light'"
          >
            {{
              `+ ${prettifyNumber(item.pendingReserveReward)} BNT ${
                item.rewardsMultiplier > 0
                  ? "| X" + prettifyNumber(item.rewardsMultiplier)
                  : ""
              }`
            }}
          </b-badge>
          <div v-else style="height: 20px !important"></div>
        </div>
        <b-popover
          :target="`popover-fees-${item.id}`"
          triggers="hover"
          placement="top"
          class="font-size-12 font-w400"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("multiplier_changes") }}
        </b-popover>
      </template>
      <template #cellCollapsed(fees)="{ value }">
        <div class="font-w400 text-center">
          {{ `${prettifyNumber(value.amount)} ${value.symbol}` }}
        </div>
        <div style="height: 20px !important"></div>
      </template>

      <template #cell(roi)="{ value, item }">
        <div :id="`popover-roi-${item.id}`" class="text-center font-w400">
          <div>
            {{
              value && typeof value.fees !== "undefined"
                ? stringifyPercentage(value.fees)
                : "N/A"
            }}
          </div>
          <b-badge
            v-if="value.reserveRewards.gt(0)"
            class="font-size-12 font-w500 p-1"
            :class="darkMode ? 'badge-dark' : 'badge-light'"
          >
            + {{ stringifyPercentage(value.reserveRewards) }}
          </b-badge>
          <div v-else style="height: 20px !important"></div>
        </div>
        <b-popover
          :target="`popover-roi-${item.id}`"
          triggers="hover"
          placement="top"
          class="font-size-12 font-w400"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("roi_protected_split") }}
        </b-popover>
      </template>
      <template #cellCollapsed(roi)="{ value }">
        <div class="font-w400 text-center">
          {{
            typeof value !== "undefined" ? stringifyPercentage(value) : "N/A"
          }}
        </div>
        <div style="height: 20px !important"></div>
      </template>

      <template #cell(apr)="{ value }">
        <div class="d-flex justify-content-center font-w400">
          <div>
            <div>
              {{
                `D | ${
                  typeof value.day !== "undefined"
                    ? stringifyPercentage(value.day)
                    : "N/A"
                }`
              }}
            </div>
            <div
              class="font-size-12 font-w400 my-1"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            >
              {{
                `W | ${
                  typeof value.week !== "undefined"
                    ? stringifyPercentage(value.week)
                    : "N/A"
                }`
              }}
            </div>
          </div>
        </div>
      </template>
      <template #cellCollapsed(apr)="{ value }">
        <div class="d-flex justify-content-center font-w400">
          <div>
            <div>
              {{
                `D | ${
                  typeof value.day !== "undefined"
                    ? stringifyPercentage(value.day)
                    : "N/A"
                }`
              }}
            </div>
            <div
              class="font-size-12 font-w400 my-1"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            >
              {{
                `W | ${
                  typeof value.week !== "undefined"
                    ? stringifyPercentage(value.week)
                    : "N/A"
                }`
              }}
            </div>
          </div>
        </div>
      </template>

      <template #cell(currentCoverage)="{ item }">
        <b-progress
          :value="item.coverageDecPercent"
          :max="1"
          class="progress-bar-positive mt-3"
          style="width: 80% !important"
        />
        <div
          class="d-flex justify-content-between align-items-center"
          style="width: 140px !important"
        >
          <span
            :id="`popover-currentCoverage-${item.id}`"
            class="font-size-12 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            <font-awesome-icon :icon="['far', 'clock']" class="mr-1" />
            <countdown-timer
              :date-unix="item.fullCoverage"
              :msg-countdown-ended="$t('full_protection')"
            />
          </span>
          <font-awesome-icon
            v-if="!insuranceStarted(item.insuranceStart)"
            :id="'popover-cliff-' + item.id"
            icon="exclamation-circle"
            class="text-danger"
          />
        </div>

        <b-popover
          v-if="!insuranceStarted(item.insuranceStart)"
          :target="'popover-cliff-' + item.id"
          triggers="hover"
          placement="bottom"
        >
          {{ $t("loss_protection_vesting_30") }}
        </b-popover>
        <b-popover
          :target="`popover-currentCoverage-${item.id}`"
          triggers="hover"
          placement="top"
          class="font-size-12 font-w400"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{
            $t("current_protection", {
              amount: stringifyPercentage(item.coverageDecPercent)
            })
          }}
        </b-popover>
      </template>
      <template #cellCollapsed(currentCoverage)="{ item }">
        <b-progress
          :value="item.coverageDecPercent"
          :max="1"
          class="progress-bar-positive mt-3"
          style="width: 80% !important"
        />
        <div class="d-flex justify-content-between">
          <span
            :id="`popover-currentCoverage-${item.id}`"
            class="font-size-12 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            <font-awesome-icon :icon="['far', 'clock']" class="mr-1" />
            <countdown-timer
              :date-unix="item.fullCoverage"
              :msg-countdown-ended="$t('full_protection')"
            />
          </span>
          <font-awesome-icon
            v-if="!insuranceStarted(item.insuranceStart)"
            :id="'popover-cliff-' + item.id"
            icon="exclamation-circle"
            class="text-danger"
          />
        </div>

        <b-popover
          v-if="!insuranceStarted(item.insuranceStart)"
          :target="'popover-cliff-' + item.id"
          triggers="hover"
          placement="bottom"
        >
          {{ $t("loss_protection_vesting_30") }}
        </b-popover>
        <b-popover
          :target="`popover-currentCoverage-${item.id}`"
          triggers="hover"
          placement="top"
          class="font-size-12 font-w400"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{
            $t("current_protection", {
              amount: stringifyPercentage(item.coverageDecPercent)
            })
          }}
        </b-popover>
      </template>

      <template #cell(actions)="{ item, isCollapsable, isExpanded }">
        <b-btn
          v-if="!isCollapsable"
          @click="goToWithdraw(item.positionId)"
          :variant="darkMode ? 'circle-gray-dark' : 'circle-gray'"
          class="d-flex align-items-center justify-content-center"
          style="width: 41px; height: 41px"
        >
          <svg
            width="13"
            height="16"
            viewBox="0 0 13 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5693 6.01098L7.17391 2.94093V11.6756C7.17391 12.1511 6.74329 12.5405 6.21739 12.5405C5.6915 12.5405 5.26087 12.1511 5.26087 11.6756V2.94093L1.86546 6.01098C1.48247 6.35728 0.884639 6.35728 0.502604 6.01098C0.119613 5.66469 0.119613 5.12415 0.502604 4.77872L5.52434 0.238184C5.73919 0.0650422 5.97831 0 6.21744 0C6.45657 0 6.6957 0.0861492 6.8872 0.259286L11.9089 4.79983C12.2919 5.14612 12.2919 5.68666 11.9089 6.03209C11.5502 6.35641 10.9523 6.35642 10.5693 6.01098ZM0.956522 16C0.430626 16 0 15.6106 0 15.1351C0 14.6596 0.430626 14.2703 0.956522 14.2703H11.4783C12.0042 14.2703 12.4348 14.6596 12.4348 15.1351C12.4348 15.6106 12.0042 16 11.4783 16H0.956522Z"
              :fill="darkMode ? '#ffffff' : '#0A2540'"
            />
          </svg>
        </b-btn>
        <div v-else>
          <b-btn
            :variant="darkMode ? 'circle-gray-dark' : 'circle-gray'"
            class="d-flex align-items-center justify-content-center"
            style="width: 41px; height: 41px"
          >
            <font-awesome-icon
              :icon="isExpanded ? 'chevron-up' : 'chevron-down'"
            />
          </b-btn>
        </div>
      </template>
      <template #cellCollapsed(actions)="{ item }">
        <b-btn
          @click="goToWithdraw(item.id)"
          :variant="darkMode ? 'circle-gray-dark' : 'circle-gray'"
          class="d-flex align-items-center justify-content-center"
          style="width: 41px; height: 41px"
        >
          <svg
            width="13"
            height="16"
            viewBox="0 0 13 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5693 6.01098L7.17391 2.94093V11.6756C7.17391 12.1511 6.74329 12.5405 6.21739 12.5405C5.6915 12.5405 5.26087 12.1511 5.26087 11.6756V2.94093L1.86546 6.01098C1.48247 6.35728 0.884639 6.35728 0.502604 6.01098C0.119613 5.66469 0.119613 5.12415 0.502604 4.77872L5.52434 0.238184C5.73919 0.0650422 5.97831 0 6.21744 0C6.45657 0 6.6957 0.0861492 6.8872 0.259286L11.9089 4.79983C12.2919 5.14612 12.2919 5.68666 11.9089 6.03209C11.5502 6.35641 10.9523 6.35642 10.5693 6.01098ZM0.956522 16C0.430626 16 0 15.6106 0 15.1351C0 14.6596 0.430626 14.2703 0.956522 14.2703H11.4783C12.0042 14.2703 12.4348 14.6596 12.4348 15.1351C12.4348 15.6106 12.0042 16 11.4783 16H0.956522Z"
              :fill="darkMode ? '#ffffff' : '#0A2540'"
            />
          </svg>
        </b-btn>
      </template>
    </data-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import {
  buildPoolName,
  compareString,
  defaultTableSort,
  findOrThrow,
  formatUnixTime,
  stringifyPercentage
} from "@/api/helpers";
import { groupPositionsArray } from "@/api/pureHelpers";
import dayjs from "@/utils/dayjs";
import {
  ViewGroupedPositions,
  ViewProtectedLiquidity,
  ViewRelay,
  ViewTableField
} from "@/types/bancor";
import CountdownTimer from "@/components/common/CountdownTimer.vue";
import DataTable from "@/components/common/DataTable.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    DataTable,
    CountdownTimer,
    PoolLogosOverlapped,
    ContentBlock
  }
})
export default class ProtectedTable extends BaseComponent {
  @Prop({ default: "" }) search!: string;
  @Prop() positions!: ViewProtectedLiquidity[];
  @Prop() filterFunctions?: Function[];

  stringifyPercentage = stringifyPercentage;
  BigNumber = BigNumber;

  get groupedPositions() {
    if (this.positions.length > 0) {
      const groupedPositions = groupPositionsArray(this.positions);
      return groupedPositions;
    } else return [];
  }

  poolName(id: string): string {
    return buildPoolName(id);
  }

  poolLogo(id: string, symbol: string) {
    const pool: ViewRelay = vxm.bancor.relay(id);
    const res = findOrThrow(pool.reserves, x =>
      compareString(x.symbol, symbol)
    );
    if (res) return res.logo;

    return "";
  }

  insuranceStarted(unixTime: number) {
    return unixTime < dayjs().unix();
  }

  formatEndTime(fullCoverageSeconds: number) {
    const timeNow = dayjs();
    const fullCoverage = dayjs.unix(fullCoverageSeconds);
    const reachedFullCoverage = timeNow.isAfter(fullCoverage);
    if (reachedFullCoverage) {
      return i18n.t("coverage_achieved");
    } else {
      const timeLeft = dayjs.unix(fullCoverageSeconds).fromNow(true);
      return i18n.t("left_until_coverage", { time: timeLeft });
    }
  }

  goToWithdraw(id: string) {
    const positions = this.positions;
    const position = findOrThrow(
      positions,
      pos => compareString(pos.id, id),
      i18n
        .tc("failed_find_position", 0, {
          id: id as string,
          ids: positions.map(position => position.id).join(" ")
        })
        .toString()
    );
    const routeName = "WithdrawProtectionSingle";
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
        key: "pool",
        label: i18n.tc("pool"),
        tooltip: i18n.tc("pool_staked"),
        minWidth: "120px"
      },
      {
        id: 2,
        key: "stake",
        label: i18n.tc("initial_stake"),
        tooltip: i18n.tc("tokens_originally_staked"),
        thClass: "text-center",
        minWidth: "132px"
      },
      {
        id: 3,
        key: "fullyProtected",
        label: i18n.tc("protected"),
        tooltip: i18n.tc("tokens_can_withdraw"),
        thClass: "text-center",
        minWidth: "125px"
      },
      {
        id: 4,
        key: "protectedAmount",
        label: i18n.tc("claimable"),
        tooltip: i18n.tc("tokens_can_withdraw_now"),
        thClass: "text-center",
        minWidth: "125px"
      },
      {
        id: 5,
        key: "fees",
        label: i18n.tc("fees_rewards"),
        tooltip: i18n.tc("fees_stake_earned"),
        minWidth: "165px",
        thClass: "text-center"
      },
      {
        id: 6,
        key: "roi",
        label: "ROI",
        tooltip: i18n.tc("roi_protected_value"),
        thClass: "text-center",
        minWidth: "80px"
      },
      {
        id: 7,
        key: "apr",
        label: "APR",
        tooltip: i18n.tc("estimated_calculation_annual_returns"),
        sortable: true,
        thClass: "text-center",
        minWidth: "112px"
      },
      {
        id: 8,
        key: "currentCoverage",
        label: i18n.tc("current_coverage"),
        tooltip: i18n.tc("impermanent_loss_protection"),
        minWidth: "174px"
      },
      {
        id: 9,
        key: "actions",
        label: "",
        sortable: false,
        minWidth: "25px",
        maxWidth: "25px"
      }
    ];
  }

  doFilter(row: ViewGroupedPositions) {
    return (row.symbol as string)
      .toLowerCase()
      .includes(this.search.toLowerCase());
  }

  customSort(row: ViewGroupedPositions, sortBy: string) {
    switch (sortBy) {
      case "stake":
        return row.stake.unixTime;
      case "fullyProtected":
        return row.fullyProtected.usdValue;
      case "protectedAmount":
        return row.protectedAmount.usdValue;
      case "apr":
        return row.apr.day;
      case "currentCoverage":
        return row.coverageDecPercent;
      default:
        return defaultTableSort(row, sortBy);
    }
  }
}
</script>

<style lang="scss">
//@import "src/assets/_scss/custom/variables";
//
//#protected-table {
//  table {
//    // display: block;
//    // min-height: 300px;
//  }
//}
</style>
