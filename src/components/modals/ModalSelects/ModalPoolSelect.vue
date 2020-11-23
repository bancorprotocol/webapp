<template>
  <modal-select
    v-model="modal"
    :search.sync="search"
    :items="searchedPools"
    title="Select a pool"
    subtitle="Pools"
  >
    <template #item="{ item }">
      <select-pool-row
        @click="selectPool(item.id)"
        :pool="item"
        :show-token-balance="showTokenBalance"
      />
    </template>
  </modal-select>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, VModel } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import SelectPoolRow from "@/components/pool/SelectPoolRow.vue";
import ModalSelect from "@/components/modals/ModalSelects/ModalSelect.vue";

@Component({
  components: { ModalSelect, SelectPoolRow }
})
export default class ModalPoolSelect extends Vue {
  @VModel({ type: Boolean }) modal!: boolean;
  @Prop() pools!: ViewRelay[];
  @Prop({ default: false }) showTokenBalance!: boolean;

  search: string = "";
  perStep = 30;
  currentStep = 1;

  get searchedPools() {
    const searchString = this.search;
    const pools = this.pools;

    return searchString
      ? pools.filter(pool =>
          pool.reserves
            .map(reserve => reserve.symbol)
            .join("/")
            .toLowerCase()
            .includes(searchString)
        )
      : pools;
  }

  @Emit("select")
  selectPool(id: string) {
    console.log("modal pool select is emitting itself..?", id);
    this.modal = false;
    return id;
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
</style>
