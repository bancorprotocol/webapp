<template>
  <div class="pt-2">
    <div class="float-right mr-2">
      <multi-input-field
        v-model="search"
        placeholder="Search"
        prepend="search"
      />
    </div>

    <b-tabs no-fade :class="darkMode ? 'tabs-dark' : 'tabs-light'">
      <b-tab title="All Transactions" active>
        <table-transactions-new :filter="search" tx-type="all" />
      </b-tab>
      <b-tab title="Swap">
        <table-transactions :filter="search" tx-type="swap" />
      </b-tab>
      <b-tab title="Adds">
        <table-transactions :filter="search" tx-type="add" />
      </b-tab>
      <b-tab title="Removes">
        <table-transactions :filter="search" tx-type="remove" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import MultiInputField from "@/components/common/MultiInputField.vue";
import TableTransactions from "@/components/data/transactiontables/TableTransactions.vue";
import TableTransactionsNew from "@/components/data/transactiontables/TableTransactionsNew.vue";

@Component({
  components: {
    TableTransactionsNew,
    TableTransactions,
    MultiInputField
  }
})
export default class TransactionTables extends Vue {
  search: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
