<template>
  <div>
    <b-table
      :dark="darkMode"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :filter="filter"
    >
      <template v-slot:cell(description)="data">
        <a :href="data.item.txLink" target="_blank">{{ data.value }}</a>
      </template>

      <template v-slot:cell(account)="data">
        <a :href="data.item.accountLink" target="_blank">{{ data.value }}</a>
      </template>

      <template v-slot:cell()="data">
        <span>{{ data.value }}</span>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      hide-goto-end-buttons
      align="center"
      limit="3"
    >
      <template v-slot:prev-text="{ page, index, disabled }">
        <font-awesome-icon
          icon="long-arrow-alt-left"
          :class="iconClass(disabled)"
        />
      </template>
      <template v-slot:next-text="{ page, index, disabled }">
        <font-awesome-icon
          icon="long-arrow-alt-right"
          :class="iconClass(disabled)"
        />
      </template>
    </b-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewTableTxSwap } from "@/components/data/transactiontables/TableTransactions.vue";
import { formatNumber, shortenEthAddress } from "@/api/helpers";
import { format } from "numeral";
import moment from "moment";

@Component
export default class TableTransactionsNew extends Vue {
  @Prop() filter!: string;
  @Prop() txType!: "swap" | "add" | "remove";

  sortBy = "unixTime";
  sortDesc = true;

  perPage = 5;
  currentPage = 1;

  fields = [
    {
      key: "description",
      label: "Description",
      thStyle: { "min-width": "260px" },
      sortable: false,
      formatter: (value: any, label: string, item: any) =>
        `Swap ${item.data.from.symbol} for ${item.data.to.symbol}`
    },
    {
      key: "valueTransmitted",
      label: "Total Value",
      thStyle: { "min-width": "180px" },
      sortable: true,
      formatter: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(value)
    },
    {
      key: "from",
      label: "Amount From",
      thStyle: { "min-width": "200px" },
      sortable: true,
      formatter: (value: any, label: string, item: any) =>
        `${formatNumber(item.data.from.amount)} ${item.data.from.symbol}`
    },
    {
      key: "to",
      label: "Amount To",
      thStyle: { "min-width": "200px" },
      sortable: true,
      formatter: (value: any, label: string, item: any) =>
        `${formatNumber(item.data.to.amount)} ${item.data.to.symbol}`
    },
    {
      key: "account",
      label: "Account",
      thStyle: { "min-width": "160px" },
      sortable: true,
      formatter: (value: string) =>
        value.length > 12 ? shortenEthAddress(value) : value
    },
    {
      key: "unixTime",
      label: "Time",
      thStyle: { "min-width": "120px" },
      sortable: true,
      formatter: (value: number) => moment.unix(value).fromNow()
    }
  ];

  get totalRows() {
    return this.items.length;
  }

  iconClass(disabled: boolean) {
    return disabled
      ? this.darkMode
        ? "text-muted-dark"
        : "text-muted-light"
      : "text-primary";
  }

  get items() {
    const liquidityHistory = vxm.bancor.liquidityHistory;
    if (liquidityHistory.loading) return [];
    return liquidityHistory.data;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
