<template>
  <div v-if="!loading">
    <b-row class="mb-3">
      <b-col cols="6">
        <img
          class="img-avatar img-avatar48 bg-white logo-shadow"
          :src="token.logo"
          alt="Token Logo"
        />
        <div
          class="font-size-20 font-w600 mt-3 d-flex align-items-center"
          :class="[darkMode ? 'text-dark' : 'text-light']"
        >
          <span class="mr-2">{{ token.symbol }} Token</span>
        </div>
      </b-col>

      <b-col cols="6" class="d-flex justify-content-end align-items-end">
        <action-buttons :token="token" />
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="4">
        <content-block title="Token Statistics" :shadow-light="true">
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

        <content-block title="Token Information" :shadow-light="true">
          <div class="my-3">
            <label-content-split label="Symbol" :value="token.symbol" />
            <label-content-split label="Name" :value="tokenName" class="my-3" />
            <label-content-split label="Token Address" :value="shortAddress" />
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
          title="Token Pools"
          :search.sync="searchTokens"
        >
          <table-pools :items="poolTableItems" :filter="searchTokens" />
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
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { ViewRelay, ViewReserve, ViewToken } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import StatisticsDataBlock from "@/components/data/statistics/StatisticsDataBlock.vue";
import TransactionTables from "@/components/data/transactiontables/TransactionTables.vue";
import MainButton from "@/components/common/Button.vue";
import { prettifyNumber, shortenEthAddress } from "@/api/helpers";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import TableTransactions from "@/components/data/transactiontables/TableTransactions.vue";
import TablePools from "@/components/data/pooltokentables/TablePools.vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import BaseComponent from "@/components/BaseComponent.vue";
export interface TxHistoryView {
  addEvents: any[];
  conversionEvents: any[];
  removeEvents: any[];
}

@Component({
  components: {
    ActionButtons,
    TablePools,
    TableTransactions,
    PoolLogosOverlapped,
    TransactionTables,
    StatisticsDataBlock,
    ContentBlock,
    LabelContentSplit,
    MainButton
  }
})
export default class DataDetailsToken extends BaseComponent {
  searchTx = "";
  searchTokens = "";

  txHistory: TxHistoryView = {
    addEvents: [],
    conversionEvents: [],
    removeEvents: []
  };

  get tokenId() {
    return this.$route.params.id;
  }

  get loading() {
    return vxm.bancor.loadingTokens;
  }

  get token(): ViewToken {
    return vxm.bancor.token(this.tokenId);
  }

  get liqDepth() {
    return prettifyNumber(this.token.liqDepth ?? 0, true);
  }

  get shortAddress() {
    return shortenEthAddress(this.token.contract);
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

  get tokenName() {
    return this.token.name;
  }

  get poolTableItems() {
    return vxm.bancor.relays.filter((x: ViewRelay) =>
      x.reserves.find((x: ViewReserve) => x.symbol === this.token.symbol)
    );
  }

  get txItemsSwap() {
    return this.txHistory.conversionEvents;
  }

  async created() {
    // await this.loadFocusPool();
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/_scss/custom/variables";

.logo-shadow {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  border: solid 1px $gray-border;
}
</style>
