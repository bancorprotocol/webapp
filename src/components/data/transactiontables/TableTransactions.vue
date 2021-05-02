<template>
  <data-table
    :fields="fields"
    :items="items"
    :filter="filter"
    :filter-functions="[doFilter]"
    :sort-function="customSort"
    default-sort="unixTime"
  >
    <template #cell(description)="{ item }">
      <a
        :href="item.txLink"
        target="_blank"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      >
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
      <a
        :href="item.accountLink"
        target="_blank"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      >
        {{ value.length > 12 ? shortenEthAddress(value) : value }}
      </a>
    </template>

    <template #cell(unixTime)="{ value }">
      {{ dayjs.unix(value).fromNow() }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { i18n } from "@/i18n";
import { defaultTableSort, shortenEthAddress } from "@/api/helpers";
import dayjs from "@/utils/dayjs";
import BaseComponent from "@/components/BaseComponent.vue";
import {
  TableItem,
  ViewLiquidityEvent,
  ViewTableField,
  ViewTradeEvent
} from "@/types/bancor";
import DataTable from "@/components/common/DataTable.vue";

@Component({
  components: { DataTable }
})
export default class TableTransactions extends BaseComponent {
  @Prop() filter!: string;
  @Prop({ default: [] }) items!: TableItem[];

  shortenEthAddress = shortenEthAddress;
  dayjs = dayjs;

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        key: "description",
        label: i18n.tc("description"),
        minWidth: "260px"
      },
      {
        id: 2,
        key: "valueTransmitted",
        label: i18n.tc("total_value"),
        minWidth: "160px"
      },
      {
        id: 3,
        key: "from",
        label: i18n.tc("amount_from"),
        minWidth: "200px",
        sortable: false
      },
      {
        id: 4,
        key: "to",
        label: i18n.tc("amount_to"),
        minWidth: "200px",
        sortable: false
      },
      {
        id: 5,
        key: "account",
        label: i18n.tc("account"),
        minWidth: "160px"
      },
      {
        id: 6,
        key: "unixTime",
        label: i18n.tc("time"),
        minWidth: "120px"
      }
    ];
  }

  doFilter(row: ViewLiquidityEvent<ViewTradeEvent>) {
    const fromSymbol = row.data.from.symbol;
    const toSymbol = row.data.to.symbol;
    const lowerFilter = this.filter.toLowerCase();
    return (
      (fromSymbol && fromSymbol.toLowerCase().indexOf(lowerFilter) >= 0) ||
      (toSymbol && toSymbol.toLowerCase().indexOf(lowerFilter) >= 0)
    );
  }

  customSort(row: any, sortBy: string) {
    switch (sortBy) {
      case "description":
        return row.data.from.symbol;
      case "account":
        return row.data.account;
      default:
        return defaultTableSort(row, sortBy);
    }
  }
}
</script>

<style lang="scss"></style>
