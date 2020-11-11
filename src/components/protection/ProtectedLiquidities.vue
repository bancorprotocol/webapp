<template>
  <content-block
    :px0="true"
    :shadow-light="true"
    title="Protected Liquidities"
    :search.sync="search"
  >
    <table-wrapper
      primarykey="id"
      :items="protectedTxTable.items"
      :fields="protectedTxTable.fields"
      :filter="search"
      sort-by="insuranceStart"
    >
      <template #cell(stake)="data">
        <div class="d-flex align-items-start">
          <pool-logos-overlapped :pool-id="data.value.poolId" size="20" />
          <div class="d-flex flex-column ml-2">
            <span
              v-text="`${data.value.amount} ${poolName(data.value.poolId)}`"
            />
            <span
              v-text="formatDate(data.item.stake.unixTime).dateTime"
              class="font-size-12 font-w400"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            />
          </div>
          <span
            v-text="`(~$${data.value.usdValue})`"
            class="font-size-12 font-w400 text-primary ml-2"
          />
        </div>
      </template>

      <template #cell(protectedAmount)="data">
        <div class="d-flex align-items-start">
          <span v-text="`${data.value.amount} ${data.value.symbol}`" />
          <span
            v-text="`(~$${data.value.usdValue})`"
            class="font-size-12 font-w400 text-primary ml-2"
          />
        </div>
        <b-badge
          v-if="data.item.whitelisted"
          variant="danger"
          class="px-2 pt-1"
        >
          Pool is not whitelisted
        </b-badge>
      </template>

      <template #cell(apr)="data">
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

      <template #cell(insuranceStart)="data">
        <div class="d-flex flex-column">
          <span v-text="formatDate(data.item.insuranceStart).date" />
          <span
            v-text="formatDate(data.item.insuranceStart).time"
            class="font-size-12 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          />
        </div>
      </template>

      <template #cell(currentCoverage)="data">
        <div class="d-flex flex-column font-size-12 font-w600">
          <span
            v-text="
              calculateFullCoverage(
                data.item.insuranceStart,
                data.item.fullCoverage
              ).percentage
            "
          />
          <b-progress
            :value="
              calculateFullCoverage(
                data.item.insuranceStart,
                data.item.fullCoverage
              ).percentage
            "
            :max="100"
            height="7px"
            class="my-1"
          />
          <span class="text-primary">
            {{
              calculateFullCoverage(
                data.item.insuranceStart,
                data.item.fullCoverage
              ).timeLeft
            }}
          </span>
        </div>
      </template>

      <template #cell(actionButtons)="data">
        <b-btn
          @click="goToWithdraw(data.item.stake.poolId)"
          :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
          class="table-button"
        >
          Withdraw
        </b-btn>
      </template>
    </table-wrapper>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import TableWrapper from "@/components/common/TableWrapper.vue";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import { buildPoolName, formatUnixTime } from "@/api/helpers";
import numeral from "numeral";
import moment from "moment";

@Component({
  components: {
    PoolLogosOverlapped,
    TableWrapper,
    ContentBlock
  }
})
export default class ProtectedLiquidities extends Vue {
  search: string = "";

  poolName(id: string): string {
    return buildPoolName(id);
  }

  calculateFullCoverage(start: number, fullCoverage: number) {
    const now = Date.now() / 1000;
    const deltaStartToCoverage = fullCoverage - start;
    const deltaStartToNow = now - start;
    const percentage = this.stringifyPercentage(
      deltaStartToNow / deltaStartToCoverage
    );
    const timeLeft = moment(fullCoverage * 1000).fromNow(true);

    if (parseInt(percentage) < 100)
      return { percentage, timeLeft: timeLeft + " left till full coverage" };
    else return { percentage: "100%", timeLeft: "Full coverage achieved" };
  }

  goToWithdraw(id: string) {
    this.$router.push({
      name: "ProtectionAction",
      params: { action: "withdraw", id }
    });
  }

  formatDate(unixTime: number) {
    return formatUnixTime(unixTime);
  }

  stringifyPercentage(percentage: number) {
    return numeral(percentage).format("0%");
  }

  get protectedLiquidity() {
    return vxm.ethBancor.protectedPositions;
  }

  get protectedTxTable() {
    const items = this.protectedLiquidity;
    const fields: any[] = [
      {
        key: "stake",
        thStyle: { "min-width": "300px" }
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

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
