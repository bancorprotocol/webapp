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
        <main-button
          label="Add Liquidity"
          :active="true"
          :block="false"
          class="font-size-14"
        />
        <main-button
          label="Remove liquidity"
          :block="false"
          class="font-size-14 mx-3"
        />
        <main-button label="Trade" :block="false" class="font-size-14" />
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
          <table-wrapper
            :items="poolTokensTable.items"
            :fields="poolTokensTable.fields"
            :filter="searchTokens"
            sort-by="tokenWeight"
          />
        </content-block>
      </b-col>

      <b-col cols="12">
        <content-block
          :px0="true"
          :shadow-light="true"
          title="Transactions"
          :search.sync="searchTx"
        >
          <table-transactions-new :filter="searchTx" :items="txItemsSwap" />
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
import TableWrapper from "@/components/common/TableWrapper.vue";
import numeral from "numeral";
import TableTransactionsNew from "@/components/data/transactiontables/TableTransactionsNew.vue";

@Component({
  components: {
    TableTransactionsNew,
    TableWrapper,
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
  searchTx = "";
  searchTokens = "";

  get loading() {
    return vxm.bancor.loadingTokens;
  }

  get pool(): ViewRelay {
    return vxm.bancor.relay(this.$route.params.id);
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
    return "????????";
  }

  get poolVersion() {
    return this.pool.v2 ? 2 : 1;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get poolTokensTable() {
    const items: any[] = [
      {
        tokenWeight: 0.6,
        symbol: "ETH",
        address: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
        pooledTokens: 7654.76564,
        usdValue: 12345.67
      },
      {
        tokenWeight: 0.3,
        symbol: "REN",
        address: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
        pooledTokens: 7654.76564,
        usdValue: 12345.67
      },
      {
        tokenWeight: 0.1,
        symbol: "LINK",
        address: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
        pooledTokens: 7654.76564,
        usdValue: 12345.67
      }
    ];
    const fields: any[] = [
      {
        key: "tokenWeight",
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
        key: "address",
        label: "Token Address",
        sortable: true,
        formatter: (value: string) => shortenEthAddress(value)
      },
      {
        key: "pooledTokens",
        label: "Pooled Tokens",
        sortable: true,
        formatter: (value: any, label: string, item: any) =>
          `${formatNumber(value)} ${item.symbol}`
      },
      {
        key: "usdValue",
        label: "USD Value",
        sortable: true,
        formatter: (value: number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(value)
      }
    ];

    return { items, fields };
  }

  get txItemsSwap() {
    const liquidityHistory = vxm.bancor.liquidityHistory;
    if (liquidityHistory.loading) return [];
    return liquidityHistory.data;
  }

  // async created() {
  //   const id = this.$route.params.id;
  //   try {
  //     const pool = await vxm.bancor.relay(id);
  //     this.pool = pool;
  //   } catch (e) {
  //     console.log(e);
  //     await this.$router.replace({ name: "404" });
  //   }
  // }
}
</script>

<style lang="scss"></style>
