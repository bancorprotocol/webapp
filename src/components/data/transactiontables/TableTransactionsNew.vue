<template>
  <table-wrapper
    :items="items"
    :fields="fields"
    :filter="filter"
    sort-by="unixTime"
  >
    <template v-slot:cell(description)="data">
      <a :href="data.item.txLink" target="_blank">{{ data.value }}</a>
    </template>

    <template v-slot:cell(account)="data">
      <a :href="data.item.accountLink" target="_blank">{{ data.value }}</a>
    </template>
  </table-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewTableTxSwap } from "@/components/data/transactiontables/TableTransactions.vue";
import { formatNumber, shortenEthAddress } from "@/api/helpers";
import { format } from "numeral";
import moment from "moment";
import TableWrapper from "@/components/common/TableWrapper.vue";
@Component({
  components: { TableWrapper }
})
export default class TableTransactionsNew extends Vue {
  @Prop() filter!: string;
  @Prop() txType!: "swap" | "add" | "remove";

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

  get items() {
    const liquidityHistory = vxm.bancor.liquidityHistory;
    if (liquidityHistory.loading) return [];
    return liquidityHistory.data;
  }
}
</script>

<style lang="scss"></style>
