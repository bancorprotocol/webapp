<template>
  <b-row>
    <b-col cols="12">
      <content-block
        :title="$t('statistics')"
        :shadow-light="true"
        :rippleAnimation="true"
      >
        <statistics class="mt-3" />
      </content-block>
    </b-col>
    <b-col cols="12">
      <content-block
        :px0="true"
        :shadow-light="true"
        :no-header="true"
        :padding="false"
      >
        <pool-token-tables />
      </content-block>
    </b-col>
    <b-col cols="12" v-if="isEth">
      <content-block
        :padding="false"
        :px0="true"
        :shadow-light="true"
        :title="$t('swaps')"
        :search.sync="txSearch"
      >
        <table-transactions :filter="txSearch" :items="itemsSwap" />
      </content-block>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/statistics/Statistics.vue";
import PoolTokenTables from "@/components/data/pooltokentables/PoolTokenTables.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import TableTransactions from "@/components/data/transactiontables/TableTransactions.vue";
import { vxm } from "@/store";

@Component({
  components: {
    TableTransactions,
    PoolTokenTables,
    Statistics,
    ContentBlock
  }
})
export default class DataSummary extends BaseComponent {
  txSearch = "";

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get itemsSwap() {
    const liquidityHistory = vxm.bancor.liquidityHistory;
    if (liquidityHistory.loading) return [];
    return liquidityHistory.data;
  }
}
</script>

<style lang="scss"></style>
