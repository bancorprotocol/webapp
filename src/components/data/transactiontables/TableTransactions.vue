<template>
  <data-table
    :fields="fields"
    :items="items"
    :filter="filter"
    :filter-function="doFilter"
    :sort-function="customSort"
    default-sort="unixTime"
  >
    <template #cell(description)="{ item }">
      <a :href="item.txLink" target="_blank">
        {{ `Swap ${item.data.from.symbol} for ${item.data.to.symbol}` }}
      </a>
    </template>

    <template #cell(valueTransmitted)="{ value }">
      {{ prettifyNumber(value, true) }}
    </template>

    <template #cell(from)="{ item }">
      {{ `${prettifyNumber(item.data.from.amount)} ${item.data.from.symbol}` }}
    </template>

    <template #cell(to)="{ item }">
      {{ `${prettifyNumber(item.data.to.amount)} ${item.data.to.symbol}` }}
    </template>

    <template #cell(account)="{ item, value }">
      <a :href="item.accountLink" target="_blank">
        {{ value.length > 12 ? shortenEthAddress(value) : value }}
      </a>
    </template>

    <template #cell(unixTime)="{ value }">
      {{ moment.unix(value).fromNow() }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  defaultTableSort,
  prettifyNumber,
  shortenEthAddress
} from "@/api/helpers";
import moment from "moment";
import DataTable, {
  Item,
  ViewTableField
} from "@/components/common/DataTable.vue";

@Component({
  components: { DataTable }
})
export default class TableTransactions extends Vue {
  @Prop() filter!: string;
  @Prop({ default: [] }) items!: Item[];

  prettifyNumber = prettifyNumber;
  shortenEthAddress = shortenEthAddress;
  moment = moment;

  fields: ViewTableField[] = [
    {
      id: 1,
      key: "description",
      label: "Description",
      minWidth: "260px"
    },
    {
      id: 2,
      key: "valueTransmitted",
      label: "Total Value",
      minWidth: "160px"
    },
    {
      id: 3,
      key: "from",
      label: "Amount From",
      minWidth: "200px",
      sortable: false
    },
    {
      id: 4,
      key: "to",
      label: "Amount To",
      minWidth: "200px",
      sortable: false
    },
    {
      id: 5,
      key: "account",
      label: "Account",
      minWidth: "160px"
    },
    {
      id: 6,
      key: "unixTime",
      label: "Time",
      minWidth: "120px"
    }
  ];

  doFilter(row: any, filter: string) {
    const fromSymbol = row.data.from.symbol;
    const toSymbol = row.data.to.symbol;
    return (
      (fromSymbol && fromSymbol.toLowerCase().indexOf(filter) >= 0) ||
      (toSymbol && toSymbol.toLowerCase().indexOf(filter) >= 0)
    );
  }

  customSort(row: any, sortBy: string) {
    switch (sortBy) {
      case "description":
        return row.data.from.symbol;
      case "account":
        return row.data.account;
      default:
        return defaultTableSort(row, sortBy, true);
    }
  }
}
</script>

<style lang="scss"></style>
