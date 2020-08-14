<template>
  <div>
    <b-row class="mx-2 pt-2">
      <b-col sm="6" md="8" xl="9" class="d-flex align-items-end">
        <b-form-radio-group
          size="sm"
          id="brothers"
          button-variant="branded"
          v-model="selected"
          :options="options"
          buttons
        />
      </b-col>
      <b-col sm="6" md="4" xl="3" class="pr-sm-1 d-flex align-items-center">
        <search-input-field :value.sync="search" />
      </b-col>
    </b-row>
    <div class="table-responsive">
      <keep-alive>
        <table-pools v-if="!tokensTable" :filter="search" />
        <table-tokens v-else :filter="search" />
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import TablePools from "@/components/data/data-tables/TablePools.vue";
import TableTokens from "@/components/data/data-tables/TableTokens.vue";
import SearchInputField from "@/components/common/SearchInputField.vue";

@Component({
  components: {
    TablePools,
    TableTokens,
    SearchInputField
  }
})
export default class DataTable extends Vue {
  selected: string = "pools";
  search: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }

  get tokensTable() {
    return this.selected == "tokens";
  }

  get options() {
    return [
      {
        text: "Pools",
        value: "pools"
      },
      {
        text: "Tokens",
        value: "tokens"
      }
    ];
  }
}
</script>

<style lang="scss">
#brothers .active {
  border-bottom: 2px solid #0f59d1 !important;
  color: #0f59d1 !important;
  border-radius: 0 !important;
}

.btn-branded {
  margin-right: 24px;
  padding-bottom: 14px !important;
  border-radius: 0;
  color: #6b7c93;
}

.btn-branded .active {
  border-bottom: 7px solid blue;
}
</style>
