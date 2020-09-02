<template>
  <data-table
    v-model="modifiedPools"
    :items="allPools"
    :fields="fields"
    :filter="filter"
    filter-by="symbol"
    default-sort="liqDepth"
  >
    <tr
      v-for="pool in modifiedPools"
      :key="pool.id"
      class="font-w500 font-size-14"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <td scope="row">
        <pool-logos :pool="pool" :cursor="false" :version="true" />
      </td>
      <td>{{ numeral(pool.liqDepth).format("$0,0.00") }}</td>
      <td>{{ numeral(pool.fee).format("0.00%") }}</td>
      <!-- <td>{{ ratio(pool) }}</td> -->
      <td><table-action-buttons :pool="pool" /></td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewRelay } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import numeral from "numeral";
import ColouredPercentage from "@/components/common/ColouredPercentage.vue";
import TableActionButtons from "@/components/common/TableActionButtons.vue";
import DataTable from "@/components/common/DataTable.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";

@Component({
  components: {
    DataTable,
    PoolLogos,
    ColouredPercentage,
    TableActionButtons
  }
})
export default class TablePools extends Vue {
  @Prop() filter!: string;
  modifiedPools: ViewRelay[] = [];

  numeral = numeral;

  get allPools() {
    return vxm.bancor.relays;
  }

  get fields(): ViewTableFields[] {
    return [
      {
        label: "Token",
        key: "symbol"
      },
      {
        label: "Liquidity Depth",
        key: "liqDepth",
        minWidth: "160px"
      },
      {
        label: "Fee",
        key: "fee",
        minWidth: "80px"
      },
      // {
      //   label: "Ratio",
      //   minWidth: "80px"
      // },
      {
        label: "Actions",
        minWidth: "310px",
        maxWidth: "310px"
      }
    ];
  }

  ratio(pool: ViewRelay) {
    return pool.reserves
      .map(reserve => Number.parseInt(String(reserve.reserveWeight * 100)))
      .join("-");
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
