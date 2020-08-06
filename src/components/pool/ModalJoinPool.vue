<template>
  <base-modal
    id="modal-join-pool"
    :search.sync="tokenSearch"
    @update:search="currentStep = 1"
    title="Select a Pool"
    size="sm"
    v-on:on-hide-modal="tokenSearch = ''"
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
          <select-pool-row @click.native="selectPool(pool)" :pool="pool" />
        </b-col>
        <b-col cols="6" class="mb-3">
          <main-button
            v-if="totalPools > perStep * currentStep"
            @click.native="currentStep++"
            label="more"
            :small="true"
          />
        </b-col>
        <b-col cols="6">
          <main-button
            v-if="currentStep > 1"
            @click.native="currentStep--"
            label="less"
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
  </base-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import SelectPoolRow from "@/components/pool/SelectPoolRow.vue";
import BaseModal from "@/components/common/BaseModal.vue";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: { BaseModal, SelectPoolRow, MainButton }
})
export default class ModalJoinPool extends Vue {
  tokenSearch: string = "";

  perStep = 30;
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
    this.$bvModal.hide("modal-join-pool");
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
