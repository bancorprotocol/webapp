<template>
  <table-wrapper
    :items="protectedTxTable.items"
    :fields="protectedTxTable.fields"
    :filter="search"
    :filterFunction="doFilter"
    sort-by="insuranceStart"
  >
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
            v-text="`(~$${data.value.usdValue})`"
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
      <div v-if="data.item.whitelisted" class="d-flex align-items-start">
        <span
          v-text="`${prettifyNumber(data.value.amount)} ${data.value.symbol}`"
        />
        <span
          v-if="data.value.usdValue !== undefined"
          v-text="`(~$${data.value.usdValue})`"
          class="font-size-12 font-w400 text-primary ml-2"
        />
      </div>
      <b-badge v-else variant="danger" class="px-2 pt-1">
        Pool is not whitelisted
      </b-badge>
    </template>

    <template v-slot:cell(roi)="data">
      <span v-if="data.item.whitelisted">{{ data.value }}</span>
      <span v-else>N/A</span>
    </template>

    <template v-slot:cell(apr)="data">
      <div class="d-flex align-items-center">
        <b-badge class="badge-version text-primary px-2 mr-2">1d</b-badge>
        {{ stringifyPercentage(data.value.day) }}
      </div>
      <div class="d-flex align-items-center my-1">
        <b-badge class="badge-version text-primary px-2 mr-2">1w</b-badge>
        {{ stringifyPercentage(data.value.week) }}
      </div>
      <div class="d-flex align-items-center">
        <b-badge class="badge-version text-primary px-2 mr-2">1m</b-badge>
        {{ stringifyPercentage(data.value.month) }}
      </div>
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
        <span v-text="stringifyPercentage(data.item.coverageDecPercent)" />
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

    <template v-slot:empty>
      <protected-empty />
    </template>
  </table-wrapper>
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

@Component({
  components: {
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

  formatEndTime(fullCoverageSeconds: number) {
    const timeNow = moment();
    const fullCoverage = moment.unix(fullCoverageSeconds);
    const reachedFullCoverage = timeNow.isAfter(fullCoverage);
    if (reachedFullCoverage) {
      return "Full coverage achieved";
    } else {
      const timeLeft = moment.unix(fullCoverageSeconds).fromNow(true);
      return `${timeLeft} left till full coverage`;
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
    return vxm.ethBancor.protectedLiquidity;
  }

  prettifyNumber(number: string | number): string {
    return prettifyNumber(number);
  }

  get protectedTxTable() {
    const items: ViewProtectedLiquidity[] = this.protectedLiquidity;
    const fields: any[] = [
      {
        key: "stake",
        thStyle: { "min-width": "250px" }
      },
      {
        key: "protectedAmount",
        label: "Fully Protected Value",
        sortable: true,
        thStyle: { "min-width": "210px" }
      },
      {
        key: "roi",
        sortable: true,
        thStyle: { "min-width": "60px" },
        formatter: (value: number) => this.stringifyPercentage(value)
      },
      {
        key: "apr",
        sortable: false,
        thStyle: { "min-width": "100px" }
      },
      {
        key: "insuranceStart",
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
