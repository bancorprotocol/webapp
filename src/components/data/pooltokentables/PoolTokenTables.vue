<template>
  <div class="pt-2">
    <div class="float-right mr-2">
      <multi-input-field
        class="max-search-width-xs"
        v-model="search"
        :placeholder="$t('search')"
        prepend="search"
      />
    </div>
    <div class="float-right mr-2" v-if="loading">
      <b-spinner
        style="display: block; width: 1.5rem; height: 1.5rem"
        class="align-self-center align-middle"
        :class="darkMode ? 'text-primary' : 'text-primary'"
        :label="`${$t('loading')}...`"
      ></b-spinner>
    </div>
    <b-tabs no-fade :class="darkMode ? 'tabs-dark' : 'tabs-light'">
      <b-tab :title="$t('pools')" active>
        <table-pools :filter="search" :items="poolItems" />
      </b-tab>
      <b-tab :title="$t('tokens')">
        <table-tokens :filter="search" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import MultiInputField from "@/components/common/MultiInputField.vue";
import TablePools from "@/components/data/pooltokentables/TablePools.vue";
import TableTokens from "@/components/data/pooltokentables/TableTokens.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    TableTokens,
    TablePools,
    MultiInputField
  }
})
export default class PoolTokenTables extends BaseComponent {
  search: string = "";

  get loading() {
    return vxm.bancor.loadingTokens;
  }

  get poolItems() {
    return vxm.bancor.relays.filter(x => !x.v2);
  }
}
</script>

<style lang="scss"></style>
