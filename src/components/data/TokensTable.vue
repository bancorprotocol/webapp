<template>
  <div>
    <div class="table-responsive font-size-14 font-w600">
      <b-table
        id="tokens-table"
        :dark="darkMode ? true : false"
        :items="tokens"
        :fields="fields"
        :filter="filter"
        primary-key="id"
        :current-page="currentPage"
        :per-page="perPage"
        head-variant="tableHeader"
      >
        <template v-slot:head(change24h)="data">
          <span class="cursor">{{ data.label }}</span>
        </template>
        <template v-slot:cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template v-slot:cell(symbol)="data">
          <div class="d-flex align-items-center">
            <img
              class="img-avatar img-avatar32 mr-2"
              :src="data.item.logo"
              alt="Token Logo"
              style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08); border: solid 1px #e6ebf2;"
            />
            <span :class="darkMode ? 'text-dark' : 'text-light'">{{
              data.item.symbol
            }}</span>
          </div>
        </template>
        <template v-slot:cell(change24h)="data">
          <span
            :class="
              data.item.change24h == null
                ? darkMode
                  ? 'text-dark'
                  : 'text-light'
                : data.item.change24h > 0
                ? `text-success `
                : 'text-danger '
            "
            >{{
              data.item.change24h == null
                ? "N/A"
                : numeral(data.item.change24h).format("0.00") + "%"
            }}</span
          >
        </template>
        <template v-slot:cell(price)="data">
          <span :class="darkMode ? 'text-dark' : 'text-light'">
            <span v-if="data.item.price < 100">{{
              numeral(data.item.price).format("$0,0.0000")
            }}</span>
            <span v-else>{{ numeral(data.item.price).format("$0,0.00") }}</span>
          </span>
        </template>
        <template v-slot:cell(actions)="data">
          <b-btn
            :to="{
              name: 'Swap',
              query: {
                from: data.item.id
              }
            }"
            class="btn-block"
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
import numeral from "numeral";
const {
  ContentLoader,
  FacebookLoader,
  CodeLoader,
  BulletListLoader,
  InstagramLoader,
  ListLoader
} = require("vue-content-loader");
const debounce = require("lodash.debounce");
import Velocity from "velocity-animate";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { vxm } from "@/store";

@Component({
  components: {
    ContentBlock,
    ContentLoader,
    FacebookLoader,
    CodeLoader,
    BulletListLoader,
    InstagramLoader,
    ListLoader
  }
})
export default class TokensTable extends Vue {
  @Prop(Boolean) loading?: boolean;
  @Prop({ default: "" }) filter!: string;

  numeral = numeral;

  currentPage = 1;
  perPage = 25;

  get pagesTotal() {
    return Math.ceil(this.tokens.length / this.perPage);
  }

  fields = [
    {
      key: "symbol",
      sortable: true,
      label: "Name",
      tdClass: ["align-middle"],
      thClass: "text-left table-head"
    },
    {
      key: "change24h",
      sortable: true,
      label: "24H Change",
      thClass: "text-left table-head",
      tdClass: ["text-left", "align-middle"]
    },
    {
      key: "price",
      sortable: true,
      label: "Price USD",
      thClass: "text-left table-head",
      tdClass: ["text-left", "align-middle"],
      formatter: (value: any, key: any, item: any) =>
        numeral(value).format("$0,0.0000")
    },
    {
      key: "volume24h",
      sortable: true,
      label: "24H Volume",
      thClass: "text-left table-head",
      tdClass: [
        "text-left",
        "align-middle",
        this.darkMode ? "text-dark" : "text-light"
      ],
      formatter: (value: any, key: any, item: any) =>
        value == null || value == undefined
          ? "N/A"
          : numeral(value).format("$0,0.00")
    },
    {
      key: "liqDepth",
      sortable: true,
      label: "Liquidity Depth",
      thClass: "text-left table-head",
      tdClass: [
        "text-left",
        "align-middle",
        this.darkMode ? "text-dark" : "text-light"
      ],
      formatter: (value: any, key: any, item: any) =>
        numeral(value).format("$0,0.00")
    },
    {
      key: "actions",
      label: "Actions",
      thClass: "text-left table-head",
      thStyle: "width: 120px",
      tdClass: ["text-right", "align-middle"]
    }
  ];

  get darkMode() {
    return vxm.general.darkMode;
  }

  get tokens() {
    return vxm.bancor.tokens;
  }

  get filteredFields() {
    const hasKeys = this.fields.filter(field => {
      if (field.key == "index" || field.key == "actions") return true;
      return this.tokens.some((token: any) =>
        new Object(token).hasOwnProperty(field.key)
      );
    });
    return hasKeys;
  }
}
</script>

<style lang="scss">
.thead-tableHeader {
  background-color: #f7f9fc !important;
}

.table-head {
  color: #6b7c93 !important;
  font-size: 12px !important;
  font-weight: 500 !important;
}
</style>
