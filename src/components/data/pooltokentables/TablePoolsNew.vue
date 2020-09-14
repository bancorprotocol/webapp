<template>
  <table-wrapper
    :items="items"
    :fields="fields"
    :filter="filter"
    sort-by="liqDepth"
  >
    <template v-slot:cell(symbol)="data">
      <router-link :to="{ name: 'DetailsPool', params: { id: data.item.id } }">
        <pool-logos :pool="data.item" :cursor="false" :version="true" />
      </router-link>
    </template>

    <template v-slot:cell(actionButtons)="data">
      <table-action-buttons :pool="data.item" />
    </template>
  </table-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import numeral from "numeral";
import TableWrapper from "@/components/common/TableWrapper.vue";
import TableActionButtons from "@/components/common/TableActionButtons.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
@Component({
  components: { PoolLogos, TableActionButtons, TableWrapper }
})
export default class TablePoolsNew extends Vue {
  @Prop() filter!: string;

  fields = [
    {
      key: "symbol",
      label: "Name",
      sortable: true
    },
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
      key: "fee",
      label: "Fee",
      thStyle: { "min-width": "80px" },
      sortable: true,
      formatter: (value: any) => numeral(value).format("0.00%")
    },
    {
      key: "actionButtons",
      label: "Action",
      thStyle: { width: "310px", "min-width": "310px" }
    }
  ];

  get items() {
    return vxm.bancor.relays;
  }
}
</script>

<style lang="scss"></style>
