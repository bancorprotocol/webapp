<template>
  <div>
    <div class="content content-boxed">
      <b-row class="d-flex justify-content-around">
        <b-col md="4" lg="3">
          <div class="block">
            <div class="block-header">
              <h3 class="block-title">Token Diversity<small> - EOS</small></h3>
            </div>
            <div class="block-content text-center">
              <h2>{{ tokens.length }}/{{ allTokensLength }}</h2>
            </div>
          </div>
        </b-col>
        <b-col md="4" lg="3">
          <div class="block">
            <div class="block-header">
              <h3 class="block-title">Total Balance<small> - USD</small></h3>
            </div>
            <div class="block-content text-center">
              <h2>{{ numeral(totalValue).format("$0,0.00") }}</h2>
            </div>
          </div>
        </b-col>
      </b-row>
      <div class="block">
        <div class="block-header">
          <h3 class="block-title">EOS <small>Token Balances</small></h3>
        </div>
        <div class="block-content">
          <b-table
            id="tokens-tablee"
            striped
            :fields="fields"
            :items="tokens"
            primary-key="symbol"
          >
            <template v-slot:cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <template v-slot:cell(symbol)="data">
              <img
                v-b-tooltip.hover
                class="img-avatar img-avatar-thumb img-avatar32"
                :src="data.item.logo"
                alt="Token Logo"
              />
              {{ data.item.symbol }}
            </template>
            <template v-slot:cell(price)="data">
              <span class="text-center font-w700">
                <span v-if="data.item.price < 1">{{
                  numeral(data.item.price).format("$0,0.000000")
                }}</span>
                <span v-else>{{
                  numeral(data.item.price).format("$0,0.00")
                }}</span>
              </span>
            </template>
            <template v-slot:cell(actions)="data">
              <span>
                <!-- <b-btn
                  @click="initAction('convert', data.item.id)"
                  size="sm"
                  variant="success"
                  class="mr-1"
                >
                  <font-awesome-icon icon="exchange-alt" />
                </b-btn> -->
                <b-btn
                  @click="initTransfer(data.item.id)"
                  size="sm"
                  variant="info"
                >
                  <font-awesome-icon icon="arrow-right" />
                </b-btn>
              </span>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import { bancorApi } from "@/api/bancorApiWrapper";
import { TokenPrice } from "@/types/bancor";
import SortIcons from "@/components/common/SortIcons.vue";
import numeral from "numeral";

@Component({
  components: {
    SortIcons
  }
})
export default class WalletAccount extends Vue {
  @Prop() account!: string;

  numeral = numeral;

  fields = [
    {
      key: "index",
      label: "#",
      class: "index-header"
    },
    {
      key: "symbol",
      sortable: true,
      label: "Token"
    },
    {
      key: "name",
      sortable: false
    },
    {
      key: "balance",
      class: ["text-center"],
      sortable: true
    },
    {
      key: "price",
      sortable: true,
      label: "Price USD",
      class: ["text-center"],
      formatter: (value: any, key: any, item: any) =>
        numeral(value).format("$0,0.00")
    },
    {
      key: "value",
      sortable: true,
      sortByFormatted: true,
      class: ["text-center"],
      formatter: (value: any, key: any, item: any) =>
        numeral(item.price * item.balance).format("$0,0.00")
    },
    {
      key: "actions",
      class: ["text-right"],
      label: "Actions"
    }
  ];

  get totalValue() {
    return this.tokens.reduce(
      (acc: number, token: any) => acc + token.balance * token.price,
      0
    );
  }

  get tokens() {
    return vxm.bancor.tokens.filter(
      (token: any) => Number(token.balance) > 0.0000001
    );
  }

  get allTokensLength() {
    return vxm.bancor.tokens.length;
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  initTransfer(id: string) {
    this.scrollToTop();

    this.$router.push({
      name: "Transfer",
      params: { id }
    });
  }

  initConvert(id: string) {
    this.scrollToTop();
    // add convert code
  }
}
</script>

<style scoped lang="scss"></style>
