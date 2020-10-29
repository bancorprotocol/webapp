<template>
  <div>
    <table-wrapper
      v-if="protectedTxTable.items.length"
      primarykey="id"
      :items="protectedTxTable.items"
      :fields="protectedTxTable.fields"
      :filter="search"
      :filterFunction="doFilter"
      sort-by="insuranceStart"
    >
      <template #head(stake)="data">
        {{ data.label }}
        <font-awesome-icon
          v-b-popover.hover.top="toolTips.stake"
          icon="info-circle"
        />
      </template>

      <template #head(protectedAmount)="data">
        {{ data.label }}
        <font-awesome-icon
          v-b-popover.hover.top="toolTips.protectedAmount"
          icon="info-circle"
        />
      </template>

      <template #head(apr)="data">
        {{ data.label }}
        <font-awesome-icon
          v-b-popover.hover.top="toolTips.apr"
          icon="info-circle"
        />
      </template>

      <template v-slot:cell(stake)="data">
        <div class="d-flex align-items-start">
          <pool-logos-overlapped :pool-id="data.value.poolId" size="20" />
          <div class="d-flex flex-column ml-2">
            <span>{{ poolName(data.value.poolId) }}</span>
            <span
              v-text="
                `${prettifyNumber(data.value.amount)} ${data.item.stake.symbol}`
              "
            />
            <span
              v-if="data.value.usdValue !== undefined"
              v-text="`(~${prettifyNumber(data.value.usdValue, true)})`"
              class="font-size-12 font-w400 text-primary"
            />
            <span
              v-text="formatDate(data.item.stake.unixTime).dateTime"
              class="font-size-12 font-w400"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            />
          </div>
        </div>
      </template>

      <template v-slot:cell(protectedAmount)="data">
        <div class="d-flex align-items-start">
          <span
            v-text="
              data.value && typeof data.value.amount !== 'undefined'
                ? `${prettifyNumber(data.value.amount)} ${data.value.symbol}`
                : 'Error calculating'
            "
          />
        </div>
        <span
          v-if="
            data.value.usdValue !== undefined &&
              typeof data.value.amount !== 'undefined'
          "
          v-text="`(~${prettifyNumber(data.value.usdValue, true)})`"
          class="font-size-12 font-w400 text-primary"
        />
      </template>

      <template v-slot:cell(roi)="data">
        <span>{{ data.value }}</span>
      </template>

      <template v-slot:cell(apr)="data">
        <div class="d-flex align-items-center">
          <b-badge class="badge-version text-primary px-2 mr-2">1d</b-badge>
          {{
            typeof data.value.day !== "undefined"
              ? stringifyPercentage(data.value.day)
              : "Error calculating"
          }}
        </div>
        <div class="d-flex align-items-center my-1">
          <b-badge class="badge-version text-primary px-2 mr-2">1w</b-badge>
          {{
            typeof data.value.week !== "undefined"
              ? stringifyPercentage(data.value.week)
              : "Error calculating"
          }}
        </div>
        <!-- <div class="d-flex align-items-center"> -->
        <!-- <b-badge class="badge-version text-primary px-2 mr-2">1m</b-badge> -->
        <!-- {{ stringifyPercentage(data.value.month) }} -->
        <!-- </div> -->
      </template>

      <template v-slot:cell(insuranceStart)="data">
        <div class="d-flex flex-column">
          <span v-text="formatDate(data.item.insuranceStart).date" />
          <span
            v-text="formatDate(data.item.insuranceStart).time"
            class="font-size-12 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          />
        </div>
      </template>

      <template v-slot:cell(currentCoverage)="data">
        <div class="d-flex flex-column font-size-12 font-w600">
          <span
            v-if="insuranceStarted(data.item.insuranceStart)"
            v-text="stringifyPercentage(data.item.coverageDecPercent)"
          />
          <span v-else class="font-size-12 font-w600 text-danger">
            Cliff:
            <countdown-timer :date-unix="data.item.insuranceStart" />
          </span>
          <b-progress
            :value="data.item.coverageDecPercent * 100"
            :max="100"
            height="7px"
            class="my-1"
          />
          <span class="text-primary">
            {{ formatEndTime(data.item.fullCoverage) }}
          </span>
        </div>
      </template>

      <template v-slot:cell(actionButtons)="data">
        <b-btn
          @click="goToWithdraw(data.item.id)"
          :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
          class="table-button"
        >
          Withdraw
        </b-btn>
      </template>
    </table-wrapper>

    <protected-empty v-else class="mx-3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import TableWrapper from "@/components/common/TableWrapper.vue";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import {
  buildPoolName,
  compareString,
  formatUnixTime,
  prettifyNumber
} from "@/api/helpers";
import numeral from "numeral";
import moment from "moment";
import { ViewProtectedLiquidity } from "@/types/bancor";
import ProtectedEmpty from "@/components/protection/ProtectedEmpty.vue";
import CountdownTimer from "@/components/common/CountdownTimer.vue";

@Component({
  components: {
    CountdownTimer,
    ProtectedEmpty,
    PoolLogosOverlapped,
    TableWrapper,
    ContentBlock
  }
})
export default class Protected extends Vue {
  @Prop({ default: "" }) search!: string;

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
    const position = this.protectedLiquidity.find(pos =>
      compareString(pos.id, id)
    )!;
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

  stringifyPercentage(percentage: number) {
    return numeral(percentage).format("0.00%");
  }

  get protectedLiquidity(): ViewProtectedLiquidity[] {
    return vxm.ethBancor.protectedPositions;
  }

  prettifyNumber(number: string | number, usd = false): string {
    return prettifyNumber(number, usd);
  }

  get toolTips() {
    const tooltips = {
      stake: "Amount of tokens you originally staked in the pool.",
      protectedAmount:
        "Amount of tokens you can withdraw with 100% protection + fees.",
      claimableValue:
        "Amount of tokens you can withdraw right now (assuming you have not earned full protection, this value will be lower than Protected Value).",
      fees: "Fees your stake has earned since you entered the pool.",
      roi: "The ROI of your fully protected value vs. your initial stake.",
      apr: "How much the pool has earned within different time frames."
    };
    return tooltips;
  }

  get protectedTxTable() {
    const items: ViewProtectedLiquidity[] = this.protectedLiquidity;
    const fields = [
      {
        key: "stake",
        label: "Initial Stake",
        thStyle: { "min-width": "250px" }
      },
      {
        key: "protectedAmount",
        label: "Protected Value",
        sortable: true,
        thStyle: { "min-width": "210px" }
      },
      // {
      //   key: "roi",
      //   sortable: true,
      //   thStyle: { "min-width": "60px" },
      //   formatter: (value: string) =>
      //     value ? this.stringifyPercentage(Number(value)) : "Error calculating"
      // },
      {
        key: "apr",
        sortable: false,
        thStyle: { "min-width": "100px" }
      },
      {
        key: "insuranceStart",
        label: "Protection Start",
        sortable: true,
        thStyle: { "min-width": "160px" }
      },
      {
        key: "currentCoverage",
        sortable: true,
        thStyle: { "min-width": "180px" }
      },
      {
        key: "actionButtons",
        label: "",
        thStyle: { width: "160px", "min-width": "160px" }
      }
    ];

    return { items, fields };
  }

  doFilter(row: any, filter: string) {
    return (row.stake.symbol as string)
      .toLowerCase()
      .includes(filter.toLowerCase());
  }
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
