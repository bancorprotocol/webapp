<template>
  <table-wrapper
    :items="items"
    :fields="fields"
    :filter="filter"
    :filter-function="doFilter"
    sort-by="liqDepth"
  >
    <template #cell(symbol)="data">
      <pool-logos :token="data.item" :cursor="false" />

      <!--      <router-link :to="{ name: 'DetailsToken', params: { id: data.item.id } }">-->
      <!--        <pool-logos :token="data.item" :cursor="false" />-->
      <!--      </router-link>-->
    </template>

    <template #cell(change24h)="data">
      <coloured-percentage :percentage="data.value" />
    </template>

    <template #head(liquidityProtection)>
      <img :src="require(`@/assets/media/icons/liquidity.svg`)" />
    </template>

    <template #cell(liquidityProtection)="data">
      <img
        v-if="data.value"
        :src="require(`@/assets/media/icons/liquidity_active.svg`)"
      />
    </template>

    <template #cell(actionButtons)="data">
      <action-buttons :token="data.item" />
    </template>
  </table-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import numeral from "numeral";
import TableWrapper from "@/components/common/TableWrapper.vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ColouredPercentage from "@/components/common/ColouredPercentage.vue";
@Component({
  components: {
    ColouredPercentage,
    PoolLogos,
    ActionButtons,
    TableWrapper
  }
})
export default class TableTokens extends Vue {
  @Prop() filter!: string;

  fields = [
    {
      key: "liquidityProtection",
      sortable: true
    },
    {
      key: "symbol",
      label: "Name",
      thStyle: { "min-width": "160px" },
      sortable: true
    },
    {
      key: "change24h",
      label: "24h Change",
      thStyle: { "min-width": "135px" },
      sortable: true
    },
    {
      key: "price",
      label: "Price USD",
      thStyle: { "min-width": "120px" },
      sortable: true,
      formatter: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(value)
    },
    /*
    {
      key: "volume24h",
      label: "24h Volume",
      thStyle: { "min-width": "120px" },
      sortable: true,
      formatter: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(value)
    },
    */
    {
      key: "liqDepth",
      label: "Liquidity Depth",
      thStyle: { "min-width": "160px" },
      sortable: true,
      formatter: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(value)
    },
    {
      key: "actionButtons",
      label: "Action",
      thStyle: { width: "160px", "min-width": "160px" }
    }
  ];

  get items() {
    return vxm.bancor.tokens;
  }

  doFilter(row: any, filter: string) {
    return (
      (row.name && row.name.toLowerCase().indexOf(filter) >= 0) ||
      (row.symbol && row.symbol.toLowerCase().indexOf(filter) >= 0)
    );
  }
}
</script>

<style lang="scss"></style>
