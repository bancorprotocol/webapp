<template>
  <data-table
    :fields="fields"
    :items="items"
    :filter="filter"
    filter-by="symbol"
    :filter-functions="[doFilter]"
    :sort-function="customSort"
    default-sort="liqDepth"
  >
    <template #head(liquidityProtection)>
      <img :src="require(`@/assets/media/icons/liquidity.svg`)" class="mr-1" />
    </template>

    <template #cell(liquidityProtection)="{ value }">
      <img
        v-if="value"
        :src="require(`@/assets/media/icons/liquidity_active.svg`)"
      />
      <span v-else />
    </template>

    <template #cell(symbol)="{ item }">
      <pool-logos :token="item" :cursor="false" />
    </template>

    <template #cell(change24h)="{ value }">
      <coloured-percentage :percentage="value" />
    </template>

    <template #cell(price)="{ value }">
      {{ prettifyNumber(value, true) }}
    </template>

    <template #cell(liqDepth)="{ value }">
      {{ prettifyNumber(value, true) }}
    </template>

    <template #cell(actionButtons)="{ item }">
      <action-buttons :token="item" />
    </template>
  </data-table>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ActionButtons from "@/components/common/ActionButtons.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ColouredPercentage from "@/components/common/ColouredPercentage.vue";
import { ViewRelay, ViewTableField, ViewToken } from "@/types/bancor";
import DataTable from "@/components/common/DataTable.vue";
import { defaultTableSort } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    DataTable,
    ColouredPercentage,
    PoolLogos,
    ActionButtons
  }
})
export default class TableTokens extends BaseComponent {
  @Prop() filter!: string;

  get fields(): ViewTableField[] {
    return [
      ...(this.isEth
        ? [
            {
              id: 1,
              label: "",
              key: "liquidityProtection",
              minWidth: "70px",
              maxWidth: "70px"
            }
          ]
        : []),
      {
        id: 2,
        label: i18n.tc("name"),
        key: "symbol",
        minWidth: "150px"
      },
      {
        id: 3,
        key: "change24h",
        label: i18n.tc("change_24"),
        minWidth: "135px"
      },
      {
        id: 4,
        key: "price",
        label: `${i18n.tc("price")} USD`,
        minWidth: "120px"
      },
      /*
    {
      id: 5,
      key: "volume24h",
      label: "24h Volume",
      minWidth: "120px"
    },
    */
      {
        id: 6,
        key: "liqDepth",
        label: i18n.tc("liquidity_depth"),
        minWidth: "160px"
      },
      {
        id: 7,
        key: "actionButtons",
        label: i18n.tc("action"),
        minWidth: "160px",
        maxWidth: "160px",
        sortable: false
      }
    ];
  }

  get items() {
    return vxm.bancor.tokens;
  }

  get isEth() {
    return this.$route.params.service == "eth";
  }

  doFilter(row: ViewToken) {
    const searchTerm = this.filter.toLowerCase();
    return (
      (row.name && row.name.toLowerCase().includes(searchTerm)) ||
      (row.symbol && row.symbol.toLowerCase().includes(searchTerm))
    );
  }

  customSort(row: ViewRelay, sortBy: string) {
    switch (sortBy) {
      case "liquidityProtection":
        return row.liquidityProtection;
      case "symbol":
        return row.symbol;
      default:
        return defaultTableSort(row, sortBy);
    }
  }
}
</script>

<style lang="scss"></style>
