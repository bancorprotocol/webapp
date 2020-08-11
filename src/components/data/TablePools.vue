<template>
  <div>
    <div class="table-responsive">
      <b-table
        id="relays-table"
        :dark="darkMode ? true : false"
        :items="tokens"
        :fields="fields"
        :filter="filter"
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
        <template v-slot:table-colgroup>
          <col key="symbol" style="width: 260px;" />
          <col key="smart" style="width: 200px;" />
        </template>
        <template v-slot:cell(symbol)="data">
          <div class="d-flex align-items-center">
            <pool-logos :pool="data.item" class="font-size-16 font-w700" />
            <b-badge variant="primary">
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
  small = false;
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
      tdClass: ["tokenss", "align-middle"]
    },
    {
      key: "liqDepth",
      sortable: true,
      label: "Liquidity Depth",
      class: ["text-right", "font-w700"],
      tdClass: ["align-middle"],
      formatter: (value: any) =>
        value ? numeral(value).format("$0,0.00") : "Not Available"
    },
    {
      key: "fee",
      sortable: true,
      class: ["text-right", "font-w700"],
      tdClass: ["align-middle"],
      formatter: (value: string) => numeral(value).format("0.00%")
    },
    {
      key: "ratio",
      tdClass: ["align-middle"],
      class: "noWrap",
      formatter: (value: any, key: any, item: ViewRelay) =>
        item.reserves
          .map(reserve => Number.parseInt(String(reserve.reserveWeight * 100)))
          .join("-")
    },
    {
      key: "actions",
      label: "Actions",
      class: "text-right",
      tdClass: ["align-middle", "noWrap"]
    }
  ];

  transProps = {
    name: "flip-list"
  };

  get darkMode() {
    return vxm.general.darkMode;
  }

  transHandler = {
    beforeEnter: function(el: any) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter: function(el: any, done: any) {
      var delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el, { opacity: 1, height: "1.6em" }, { complete: done });
      }, delay);
    },
    leave: function(el: any, done: any) {
      var delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done });
      }, delay);
    }
  };

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

  get focusDoesExist() {
    return this.tokens.some((token: any) => token.focusAvailable);
  }

  get tokens() {
    return vxm.bancor.relays;
  }

  focusRelay(symbolCode: string) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    this.$router.push({
      name: "RelayDetail",
      params: { account: symbolCode }
    });
  }

  goToRelay(symbolCode: string, mode = "addLiquidity") {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    this.$router.push({
      name: "Relay",
      params: {
        account: symbolCode,
        mode
      }
    });
  }

  initAction(action: "convert" | "transfer", symbol: string) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  get filteredFields() {
    return this.small
      ? this.fields.filter(field =>
          ["key", "volume24h", "index", "name"].every(
            fieldName => fieldName !== field.key
          )
        )
      : this.fields;
  }

  handleResize() {
    this.small = window.innerWidth < 768;
  }

  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }
}
</script>

<style lang="scss">
.index-header {
  min-width: 15px;
}

.thead-tableHeader {
  background-color: #f7f9fc !important;
}
</style>
