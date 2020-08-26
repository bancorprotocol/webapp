<template>
  <modal-two
    :search.sync="tokenSearch"
    @update:search="currentStep = 1"
    title="Select a Pool"
    size="sm"
    v-model="modal"
    @input="tokenSearch = ''"
    :fixed-height="true"
  >
    <div>
      <b-row>
        <b-col cols="12">
          <span
            class="text-uppercase font-w500 font-size-12"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            Pool Name
          </span>
        </b-col>
        <b-col
          cols="12"
          v-for="pool in searchedPools.slice(0, currentStep * perStep)"
          :key="pool.id"
          class="my-3 cursor"
        >
          <select-pool-row @click="selectPool(pool)" :pool="pool" />
        </b-col>
        <b-col cols="12" class="mb-3 text-center">
          <main-button
            v-if="totalPools > perStep * currentStep"
            @click="currentStep++"
            label="more"
            :small="true"
          />
        </b-col>
        <b-col
          v-if="!searchedPools.length"
          class="text-center font-size-16 font-w500 mt-3"
        >
          <span :class="darkMode ? 'text-dark' : 'text-light'">
            No results found.
          </span>
        </b-col>
      </b-row>
    </div>
  </modal-two>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import SelectPoolRow from "@/components/pool/SelectPoolRow.vue";
import ModalTwo from "@/components/common/ModalTwo.vue";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: { ModalTwo, SelectPoolRow, MainButton }
})
export default class ModalJoinPool extends Vue {
  tokenSearch: string = "";

  perStep = 30;
  modal = false;
  currentStep = 1;

  get totalPools() {
    return this.searchedPools.length;
  }

  selectPool(pool: ViewRelay): void {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: this.$route.params.poolAction
          ? this.$route.params.poolAction
          : "add",
        account: pool.id
      }
    });
    this.modal = false;
  }

  get searchedPools() {
    return this.tokenSearch
      ? this.pools.filter(pool =>
          pool.reserves
            .map(reserve => reserve.symbol)
            .join("/")
            .toLowerCase()
            .includes(this.tokenSearch.toLowerCase())
        )
      : this.pools;
  }

  get pools(): ViewRelay[] {
    return vxm.bancor.relays.filter(relay => relay.addLiquiditySupported);
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  created() {}
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
</style>
