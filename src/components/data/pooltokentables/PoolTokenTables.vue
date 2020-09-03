<template>
  <div class="pt-2">
    <div class="float-right mr-2">
      <multi-input-field
        v-model="search"
        placeholder="Search"
        prepend="search"
      />
    </div>

    <b-tabs no-fade :class="darkMode ? 'tabs-dark' : 'tabs-light'">
      <b-tab title="Pools" active>
        <table-pools :filter="search" />
      </b-tab>
      <b-tab title="Tokens">
        <table-tokens :filter="search" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import TablePools from "@/components/data/pooltokentables/TablePools.vue";
import TableTokens from "@/components/data/pooltokentables/TableTokens.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";

@Component({
  components: {
    MultiInputField,
    TablePools,
    TableTokens
  }
})
export default class PoolTokenTables extends Vue {
  search: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
