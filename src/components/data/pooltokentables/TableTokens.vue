<template>
  <data-table
    v-model="modifiedTokens"
    :items="allTokens"
    :fields="fields"
    :filter="filter"
    filter-by="symbol"
    default-sort="liqDepth"
  >
    <tr
      v-for="token in modifiedTokens"
      :key="token.id"
      class="font-w600 font-size-14"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <td scope="row"><pool-logos :token="token" :cursor="false" /></td>
      <td><coloured-percentage :percentage="token.change24h" /></td>
      <td>{{ numeral(token.price).format("$0.0000") }}</td>
      <td>{{ numeral(token.volume24h).format("$0,0.00") }}</td>
      <td>{{ numeral(token.liqDepth).format("$0,0.00") }}</td>
      <td><table-action-buttons :token="token" /></td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewTableFields } from "@/components/common/TableHeader.vue";
import { ViewToken } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import numeral from "numeral";
import ColouredPercentage from "@/components/common/ColouredPercentage.vue";
import TableActionButtons from "@/components/common/TableActionButtons.vue";
import DataTable from "@/components/common/DataTable.vue";

@Component({
  components: {
    DataTable,
    PoolLogos,
    ColouredPercentage,
    TableActionButtons
  }
})
export default class TableTokens extends Vue {
  @Prop() filter!: string;
  modifiedTokens: ViewToken[] = [];

  numeral = numeral;

  get allTokens() {
    return vxm.bancor.tokens;
  }

  get fields(): ViewTableFields[] {
    return [
      {
        label: "Name",
        key: "symbol"
      },
      {
        label: "24h Change",
        key: "change24h",
        minWidth: "135px"
      },
      {
        label: "Price USD",
        key: "price",
        minWidth: "120px"
      },
      {
        label: "24h Volume",
        key: "volume24h",
        minWidth: "120px"
      },
      {
        label: "Liquidity Depth",
        key: "liqDepth",
        minWidth: "160px"
      },
      {
        label: "Actions",
        minWidth: "160px",
        maxWidth: "160px"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
