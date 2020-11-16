<template>
  <div v-if="!loading">
    <b-row class="mb-3">
      <b-col cols="6">
        <pool-logos-overlapped :pool-id="pool.id" size="48" />
        <div
          class="font-size-20 font-w600 mt-3 d-flex align-items-center"
          :class="[darkMode ? 'text-dark' : 'text-light']"
        >
          <span class="mr-2">{{ poolName }} Pool</span>
          <version-badge :version="poolVersion" />
        </div>
      </b-col>

      <b-col cols="6" class="d-flex justify-content-end align-items-end">
        <action-buttons :pool="pool" />
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="4">
        <content-block title="Pool Tokens Statistics" :shadow-light="true">
          <b-row class="mt-3">
            <b-col cols="6">
              <statistics-data-block
                title="Total Liquidity"
                :value="liqDepth"
              />
            </b-col>
            <b-col cols="6">
              <statistics-data-block title="Volume (24h)" :value="volume24h" />
            </b-col>
            <b-col cols="6">
              <statistics-data-block title="Fees (24h)" :value="fees" />
            </b-col>
            <b-col cols="6">
              <statistics-data-block
                title="Transactions"
                :value="transactions"
              />
            </b-col>
          </b-row>
        </content-block>

        <content-block title="Pool Information" :shadow-light="true">
          <div class="my-3">
            <label-content-split label="Pool Name" :value="poolName" />
            <label-content-split
              label="Pool Address"
              :value="shortAddress"
              class="my-3"
            />
            <label-content-split
              label="Total Pool Weight"
              :value="totalPoolWeight"
            />
          </div>

          <main-button label="View on Block Explorer" class="font-size-14" />
        </content-block>
      </b-col>

      <b-col cols="8"></b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <content-block
          :px0="true"
          :shadow-light="true"
          title="Pool Tokens"
          :search.sync="searchTokens"
        >
        </content-block>
      </b-col>

      <b-col cols="12">
        <content-block
          :px0="true"
          :shadow-light="true"
          title="Swap Transactions"
          :search.sync="searchTx"
        >
          <table-transactions :filter="searchTx" :items="txItemsSwap" />
        </content-block>
      </b-col>
    </b-row>
  </div>

  <div v-else>...loading</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/statistics/Statistics.vue";
import { ViewRelay } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import StatisticsDataBlock from "@/components/data/statistics/StatisticsDataBlock.vue";
import TransactionTables from "@/components/data/transactiontables/TransactionTables.vue";
import MainButton from "@/components/common/Button.vue";
import { buildPoolName, formatNumber, shortenEthAddress } from "@/api/helpers";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import VersionBadge from "@/components/common/VersionBadge.vue";
import numeral from "numeral";
import TableTransactions from "@/components/data/transactiontables/TableTransactions.vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
export interface TxHistoryView {
  addEvents: any[];
  conversionEvents: any[];
  removeEvents: any[];
}

@Component({
  components: {
    ActionButtons,
    TableTransactions,
    VersionBadge,
    PoolLogosOverlapped,
    TransactionTables,
    StatisticsDataBlock,
    Statistics,
    ContentBlock,
    PoolLogos,
    LabelContentSplit,
    MainButton
  }
})
export default class DataPool extends Vue {
  loadingFocusPool = false;
  searchTx = "";
  searchTokens = "";

  txHistory: TxHistoryView = {
    addEvents: [],
    conversionEvents: [],
    removeEvents: []
  };

  get poolId() {
    return this.$route.params.id;
  }

  get loading() {
    return vxm.bancor.loadingTokens;
  }

  get pool(): ViewRelay {
    return vxm.bancor.relay(this.poolId);
  }

  get liqDepth() {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(this.pool.liqDepth);
  }

  get shortAddress() {
    return shortenEthAddress(this.pool.id);
  }

  get volume24h() {
    return "????????";
  }

  get fees() {
    return "????????";
  }

  get transactions() {
    return "????????";
  }

  get poolName() {
    return buildPoolName(this.pool.id);
  }

  get totalPoolWeight() {
    const weights = this.poolTokensTable.items.map(x => x.reserveWeight);
    const total = weights.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    return numeral(total).format("0%");
  }

  get poolVersion() {
    return this.pool.v2 ? 2 : 1;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get poolTokensTable() {
    const items = this.pool.reserves;

    const fields: any[] = [
      {
        key: "reserveWeight",
        label: "Token Weight",
        sortable: true,
        formatter: (value: string) => numeral(value).format("0%")
      },
      {
        key: "symbol",
        label: "Token Name",
        sortable: true
      },
      {
        key: "contract",
        label: "Token Address",
        sortable: true,
        formatter: (value: string) => shortenEthAddress(value)
      },
      {
        key: "pooledTokens",
        label: "Pooled Tokens",
        sortable: true,
        formatter: (value: any, label: string, item: any) =>
          `${formatNumber(value ?? 0)} ${item.symbol}`
      },
      {
        key: "usdValue",
        label: "USD Value",
        sortable: true,
        formatter: (value: number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(value ?? 0)
      }
    ];

    return { items, fields };
  }

  get txItemsSwap() {
    return this.txHistory.conversionEvents;
  }

  doFilter(row: any, filter: string) {
    return row.symbol && row.symbol.toLowerCase().indexOf(filter) >= 0;
  }
  async loadFocusPool() {
    this.loadingFocusPool = true;
    try {
      this.txHistory = await vxm.bancor.focusPool(this.poolId);
    } catch (e) {
      console.log(e);
    } finally {
      this.loadingFocusPool = false;
    }
  }

  async created() {
    await this.loadFocusPool();
  }
}
</script>

<style lang="scss"></style>
