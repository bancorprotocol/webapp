<template>
  <table-wrapper
    :items="items"
    :fields="fields"
    :filter="filter"
    :filterFunction="doFilter"
    sort-by="liqDepth"
  >
    <template v-slot:cell(symbol)="data">
      <pool-logos :pool="data.item" :cursor="false" />

      <!-- <router-link :to="{ name: 'DetailsPool', params: { id: data.item.id } }">
        <pool-logos :pool="data.item" :cursor="false" :version="true" />
      </router-link>-->
    </template>

    <template v-slot:head(liquidityProtection)="data">
      <img :src="require(`@/assets/media/icons/liquidity.svg`)" />
    </template>

    <template v-slot:cell(liquidityProtection)="data">
      <img
        v-if="data.value"
        :src="require(`@/assets/media/icons/liquidity_active.svg`)"
      />
    </template>

    <template v-slot:cell(actionButtons)="data">
      <action-buttons :pool="data.item" />
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
import { ViewRelay } from "@/types/bancor";
@Component({
  components: { PoolLogos, ActionButtons, TableWrapper }
})
export default class TablePools extends Vue {
  @Prop() items!: ViewRelay[];
  @Prop() filter!: string;

  fields = [
    {
      key: "symbol",
      label: "Name",
      sortable: true,
      thStyle: { "min-width": "250px" }
    },
    {
      key: "liquidityProtection",
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
  doFilter(row: any, filter: string) {
    const symbols = row.reserves.map((reserve: any) => reserve.symbol);
    let r = false;
    symbols.forEach((s: string) => {
      r = r || s.toLowerCase().indexOf(filter) >= 0;
    });
    return r;
  }
}
</script>

<style lang="scss"></style>
