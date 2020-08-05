<template>
  <b-container fluid="xl">
    <b-row>
      <b-col cols="12">
        <tokens-table
          :loading="false"
          :name="name"
          :tokens="tokens"
          @convert="onConvert"
          @transfer="onTransfer"
          scrollToTop
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import TokensTable from "@/components/data/TokensTable.vue";

@Component({
  components: {
    TokensTable
  }
})
export default class Token extends Vue {
  get tokens() {
    return vxm.bancor.tokens;
  }

  get network() {
    return this.$route.params.service;
  }

  get name() {
    return this.network.toUpperCase();
  }

  onConvert(symbolName: string) {
    const { query, params } = this.$route;
    const { base, quote } = query;
    this.$router.push({
      name: "Tokens",
      query: {
        ...query,
        quote: symbolName,
        ...(base == symbolName && { base: quote })
      }
    });
  }

  onTransfer(symbolName: string) {
    this.$router.push({
      name: "Transfer",
      params: { symbolName }
    });
  }
}
</script>

<style lang="scss"></style>
