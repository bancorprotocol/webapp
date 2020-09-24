<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div class="mt-2">
          <span
            class="font-size-20 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            Liquidity Protection
          </span>

          <b-btn
            variant="primary"
            class="float-right"
            :to="{ name: 'AddProtection' }"
            >Stake</b-btn
          >
        </div>
        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          You can protect your token pools with our special insurance for
          impermanent loss by simpy adding insurance to each of your
          transactions.
        </p>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <protectable-liquidity />
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <content-block
          :px0="true"
          :shadow-light="true"
          title="Protected Transactions"
          :search.sync="search"
        >
          <table-wrapper
            :items="protectedTxTable.items"
            :fields="protectedTxTable.fields"
            :filter="search"
            sort-by="insuranceStart"
          >
            <template v-slot:cell(stake)="data">
              <div class="d-flex align-items-start">
                <pool-logos-overlapped :pool-id="data.value.poolId" size="20" />
                <div class="d-flex flex-column ml-2">
                  <span
                    v-text="
                      `${data.value.amount} ${poolName(data.value.poolId)}`
                    "
                  />
                  <span
                    v-text="formatDate(data.item.unixTime.staked).dateTime"
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

            <template v-slot:cell(protectedAmount)="data">
              <div class="d-flex align-items-start">
                <span v-text="`${data.value.amount} ${data.value.symbol}`" />
                <span
                  v-text="`(~$${data.value.usdValue})`"
                  class="font-size-12 font-w400 text-primary ml-2"
                />
              </div>
            </template>

            <template v-slot:cell(insuranceStart)="data">
              <div class="d-flex flex-column">
                <span
                  v-text="formatDate(data.item.unixTime.insuranceStart).date"
                />
                <span
                  v-text="formatDate(data.item.unixTime.insuranceStart).time"
                  class="font-size-12 font-w400"
                  :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
                />
              </div>
            </template>

            <template v-slot:cell(currentCoverage)="data">
              <div class="d-flex flex-column font-size-12 font-w600">
                <span
                  v-text="
                    calculateFullCoverage(
                      data.item.unixTime.insuranceStart,
                      data.item.unixTime.fullCoverage
                    ).percentage
                  "
                />
                <b-progress
                  :value="
                    calculateFullCoverage(
                      data.item.unixTime.insuranceStart,
                      data.item.unixTime.fullCoverage
                    ).percentage
                  "
                  :max="100"
                  height="7px"
                  class="my-1"
                />
                <span class="text-primary">
                  {{
                    calculateFullCoverage(
                      data.item.unixTime.insuranceStart,
                      data.item.unixTime.fullCoverage
                    ).timeLeft
                  }}
                </span>
              </div>
            </template>

            <template v-slot:cell(actionButtons)="data">
              <b-btn
                :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
                class="table-button"
              >
                Withdraw
              </b-btn>
            </template>
          </table-wrapper>
        </content-block>
      </b-col>
    </b-row>
  </b-container>
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
import ProtectableLiquidity from "@/components/pool/protection/ProtectableLiquidity.vue";

@Component({
  components: {
    ProtectableLiquidity,
    PoolLogosOverlapped,
    TableWrapper,
    ContentBlock
  }
})
export default class LiquidityProtectionSummary extends Vue {
  search: string = "";

  poolName(id: string): string {
    return buildPoolName(id);
  }

  calculateFullCoverage(start: number, fullCoverage: number) {
    const now = Date.now() / 1000;
    const deltaStartToCoverage = fullCoverage - start;
    const deltaStartToNow = now - start;
    const percentage = numeral(deltaStartToNow / deltaStartToCoverage).format(
      "0%"
    );
    const timeLeft = moment(fullCoverage * 1000).fromNow(true);

    if (parseInt(percentage) < 100)
      return { percentage, timeLeft: timeLeft + " left till full coverage" };
    else return { percentage: "100%", timeLeft: "Full coverage achieved" };
  }

  formatDate(unixTime: number) {
    return formatUnixTime(unixTime);
  }

  get protectedTxTable() {
    const items: any[] = [
      {
        stake: {
          amount: 250,
          poolId: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
          usdValue: 56.86
        },
        protectedAmount: {
          amount: 115,
          symbol: "ETH",
          usdValue: 35.11
        },
        unixTime: {
          staked: 1600583447,
          insuranceStart: 1600646400,
          fullCoverage: 1600688926
        }
      },
      {
        stake: {
          amount: 5123.7865,
          poolId: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
          usdValue: 1146.86
        },
        protectedAmount: {
          amount: 3000,
          symbol: "ETH",
          usdValue: 3589.11
        },
        unixTime: {
          staked: 1599583447,
          insuranceStart: 1600445900,
          fullCoverage: 1601688926
        }
      }
    ];
    const fields: any[] = [
      {
        key: "stake",
        thStyle: { "min-width": "300px" }
      },
      {
        key: "protectedAmount",
        sortable: true,
        thStyle: { "min-width": "180px" }
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
