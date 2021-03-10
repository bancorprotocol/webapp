<template>
  <modal-select
    v-model="modal"
    :search.sync="search"
    :items="searchedPools"
    :title="$t('select_pool')"
    :subtitle="$t('pools')"
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
import { Component, Emit, Prop, VModel } from "vue-property-decorator";
import { ViewRelay } from "@/types/bancor";
import SelectPoolRow from "@/components/pool/SelectPoolRow.vue";
import ModalSelect from "@/components/modals/ModalSelects/ModalSelect.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { ModalSelect, SelectPoolRow }
})
export default class ModalPoolSelect extends BaseComponent {
  @VModel({ type: Boolean }) modal!: boolean;
  @Prop() pools!: ViewRelay[];
  @Prop({ default: false }) showTokenBalance!: boolean;

  search: string = "";
  perStep = 30;
  currentStep = 1;

  get searchedPools() {
    const searchString = this.search.toLowerCase();
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
    this.modal = false;
    return id;
  }
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
</style>
