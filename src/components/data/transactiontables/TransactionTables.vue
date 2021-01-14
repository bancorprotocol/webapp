<template>
  <div class="pt-2">
    <div class="float-right mr-2">
      <multi-input-field
        class="max-search-width-xs"
        v-model="search"
        placeholder="Search"
        prepend="search"
      />
    </div>

    <div>
      <div
        class="title"
        :style="darkMode ? 'color: white;' : 'color: #0f59d1;'"
      >
        Swaps
      </div>
      <table-transactions :filter="search" :items="itemsSwap" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import MultiInputField from "@/components/common/MultiInputField.vue";
import TableTransactions from "@/components/data/transactiontables/TableTransactions.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    TableTransactions,
    MultiInputField
  }
})
export default class TransactionTables extends BaseComponent {
  search: string = "";

  get itemsSwap() {
    const liquidityHistory = vxm.bancor.liquidityHistory;
    if (liquidityHistory.loading) return [];
    return liquidityHistory.data;
  }
}
</script>

<style lang="scss">
.title {
  font-size: 14px;
  font-weight: 600;
  padding: 5px 5px 15px 20px;
}
</style>
