<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <content-block title="Statistics">
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
        <content-block title="Data Table">
          <div>
            <div class="mb-3">
              <b-btn
                :variant="
                  !tokensTable ? (darkMode ? 'dark' : 'light') : 'primary'
                "
                @click="tokensTable = !tokensTable"
                class="block-rounded mr-2"
                >Tokens</b-btn
              >
              <b-btn
                :variant="
                  tokensTable ? (darkMode ? 'dark' : 'light') : 'primary'
                "
                @click="tokensTable = !tokensTable"
                class="block-rounded"
                >Pools</b-btn
              >
            </div>
            <b-form-input
              class="mb-3"
              :class="
                !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark'
              "
              debounce="500"
              v-model="filter"
              placeholder="Search Token"
            ></b-form-input>
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
  },
  created() {
    console.log("created called!!!!!");
  },
  beforeUpdate() {
    console.log("beforeUpdate");
    console.time("render");
  },
  updated() {
    console.log("ABC");
    console.timeEnd("render");
  }
})
export default class Data extends Vue {
  tokensTable: boolean = true;
  filter: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
