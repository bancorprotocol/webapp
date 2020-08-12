<template>
  <div>
    <div class="font-size-14 font-w600">
      <b-table
        id="relays-table"
        :dark="darkMode ? true : false"
        :items="tokens"
        :fields="fields"
        :filter="filter"
        responsive
        :filter-function="onPoolFilter"
        :current-page="currentPage"
        :per-page="perPage"
        primary-key="id"
        :table-busy="loadingPools"
        head-variant="tableHeader"
      >
        <template v-slot:table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template v-slot:cell(symbol)="data">
          <div class="d-flex align-items-center">
            <pool-logos :pool="data.item" />
            <b-badge variant="primary" class="px-2">
              {{ data.item.v2 ? "V2" : "V1" }}</b-badge
            >
          </div>
        </template>
        <template v-slot:cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template v-slot:cell(v2)="data">
          <span> {{ data.item.v2 ? "V2" : "V1" }}</span>
        </template>
        <template v-slot:cell(actions)="data">
          <b-btn
            :to="{
              name: 'PoolAction',
              params: {
                poolAction: 'add',
                account: data.item.id
              }
            }"
            class="mr-2"
            variant="primary"
          >
            Add Liquidity
          </b-btn>

          <b-btn
            :to="{
              name: 'Swap',
              query: {
                from: data.item.reserves[1].id
              }
            }"
            :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
          >
            Trade
          </b-btn>
        </template>
      </b-table>
    </div>

    <div class="d-flex justify-content-center align-items-center mt-3">
      <div
        :class="currentPage > 1 ? 'cursor' : ''"
        @click="currentPage > 1 ? currentPage-- : null"
      >
        <font-awesome-icon
          icon="long-arrow-alt-left"
          size="2x"
          :class="
            currentPage === 1
              ? darkMode
                ? 'text-muted-dark'
                : 'text-muted-light'
              : 'text-primary'
          "
        />
      </div>
      <span class="mx-3">Page {{ currentPage }} of {{ pagesTotal }}</span>
      <div
        :class="currentPage < pagesTotal ? 'cursor' : ''"
        @click="currentPage < pagesTotal ? currentPage++ : null"
      >
        <font-awesome-icon
          icon="long-arrow-alt-right"
          size="2x"
          :class="
            currentPage === pagesTotal
              ? darkMode
                ? 'text-muted-dark'
                : 'text-muted-light'
              : 'text-primary'
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { LiquidityModule, ViewRelay } from "@/types/bancor";
import Velocity from "velocity-animate";
import { namespace } from "vuex-class";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { compareString } from "../../api/helpers";

const bancor = namespace("bancor");

const numeral = require("numeral");

@Component({
  components: {
    PoolLogos
  }
})
export default class TablePools extends Vue {
  numeral = numeral;
  @Prop({ default: "" }) filter!: string;
  @bancor.Action loadMorePools!: LiquidityModule["loadMorePools"];
  @bancor.Getter morePoolsAvailable!: LiquidityModule["morePoolsAvailable"];
  @bancor.Getter loadingPools!: LiquidityModule["loadingPools"];

  currentPage = 1;
  perPage = 25;

  get pagesTotal() {
    return Math.ceil(this.tokens.length / this.perPage);
  }

  fields = [
    {
      key: "symbol",
      sortable: true,
      label: "Token",
      tdClass: ["tokenss", "align-middle"],
      thClass: "table-head"
    },
    {
      key: "liqDepth",
      sortable: true,
      label: "Liquidity Depth",
      thClass: "table-head",
      tdClass: ["align-middle", "text-light"],
      formatter: (value: any) =>
        value ? numeral(value).format("$0,0.00") : "Not Available"
    },
    {
      key: "fee",
      sortable: true,
      class: ["text-left"],
      tdClass: ["align-middle", "text-light"],
      thClass: "table-head",
      formatter: (value: string) => numeral(value).format("0.00%")
    },
    {
      key: "ratio",
      tdClass: ["align-middle", "text-light"],
      thClass: "table-head",
      formatter: (value: any, key: any, item: ViewRelay) =>
        item.reserves
          .map(reserve => Number.parseInt(String(reserve.reserveWeight * 100)))
          .join("-")
    },
    {
      key: "actions",
      label: "Actions",
      class: ["text-left", "actions-column"],
      tdClass: ["align-middle", "text-right"],
      thClass: "table-head"
    }
  ];

  get darkMode() {
    return vxm.general.darkMode;
  }

  shortenEthAddress(ethAddress: string) {
    return ethAddress.length > 13
      ? ethAddress.substring(0, 4) +
          "..." +
          ethAddress.substring(ethAddress.length - 6, ethAddress.length)
      : ethAddress;
  }

  onPoolFilter(pool: ViewRelay, searchString: string) {
    const reserveSymbols = pool.reserves.map(reserve =>
      reserve.symbol.toLowerCase()
    );
    const splitted = searchString.split("/");
    return splitted.every(symbol =>
      reserveSymbols.some(reserveSymbol => reserveSymbol.includes(symbol))
    );
  }

  get tokens() {
    return vxm.bancor.relays;
  }
}
</script>

<style lang="scss">
.actions-column {
  width: 235px !important;
}
.thead-tableHeader {
  background-color: #f7f9fc !important;
}

.table-head {
  color: #6b7c93 !important;
  font-size: 12px !important;
  font-weight: 500 !important;
}
</style>
