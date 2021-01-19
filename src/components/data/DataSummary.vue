<template>
  <b-row>
    <b-col cols="12">
      <content-block :title="$t('statistics')" :shadow-light="true">
        <statistics class="mt-3" />
      </content-block>
    </b-col>
    <b-col cols="12">
      <content-block :px0="true" :shadow-light="true" :no-header="true">
        <pool-token-tables />
      </content-block>
    </b-col>
    <b-col cols="12" v-if="isEth">
      <content-block :px0="true" :shadow-light="true" :no-header="true">
        <transaction-tables />
      </content-block>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/statistics/Statistics.vue";
import PoolTokenTables from "@/components/data/pooltokentables/PoolTokenTables.vue";
import TransactionTables from "@/components/data/transactiontables/TransactionTables.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    TransactionTables,
    PoolTokenTables,
    Statistics,
    ContentBlock
  }
})
export default class DataSummary extends BaseComponent {
  get isEth() {
    return this.$route.params.service === "eth";
  }
}
</script>

<style lang="scss"></style>
