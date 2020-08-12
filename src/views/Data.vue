<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <content-block title="Statistics" :shadow-light="true">
          <statistics />
        </content-block>
      </b-col>
      <b-col v-if="false" md="6">
        <content-block title="Liquidity">
          <liquidity-chart />
        </content-block>
      </b-col>
      <b-col v-if="false" md="6">
        <content-block title="Volume">
          <liquidity-chart />
        </content-block>
      </b-col>
      <b-col>
        <content-block :px0="true" :shadow-light="true" :no-header="true">
          <div>
            <b-row class="mx-2 mt-2">
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
              <b-col
                sm="6"
                md="4"
                xl="3"
                class="pr-sm-1 d-flex align-items-center"
              >
                <b-form-input
                  :class="
                    !darkMode
                      ? 'form-control-alt-light'
                      : 'form-control-alt-dark'
                  "
                  debounce="500"
                  v-model="filter"
                  placeholder="Search Token"
                  class="mb-1"
                  style="height: 32px"
                ></b-form-input>
              </b-col>
            </b-row>

            <keep-alive>
              <table-pools v-if="!tokensTable" :filter="filter" />
              <tokens-table
                v-else
                scrollToTop
                :loading="false"
                :filter="filter"
              />
            </keep-alive>
          </div>
        </content-block>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import TokensTable from "@/components/data/TokensTable.vue";
import { SimpleToken } from "@/types/bancor";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/Statistics.vue";
import LiquidityChart from "@/components/data/charts/LiquidityChart.vue";
import TablePools from "@/components/data/TablePools.vue";

@Component({
  components: {
    TablePools,
    LiquidityChart,
    Statistics,
    ContentBlock,
    TokensTable
  }
})
export default class Data extends Vue {
  selected: string = "tokens";
  filter: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }

  get tokensTable() {
    return this.selected == "tokens";
  }

  get options() {
    return [
      {
        text: "Tokens",
        value: "tokens"
      },
      {
        text: "Pools",
        value: "pools"
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
