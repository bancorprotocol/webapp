<template>
  <modal-base
    size="sm"
    v-model="show"
    :search.sync="searchQuery"
    @update:search="currentStep = 1"
    :title="title"
    :fixed-height="true"
  >
    <div>
      <b-row>
        <b-col cols="12">
          <span
            class="text-uppercase font-w500 font-size-12"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ subtitle }}
          </span>
        </b-col>
        <b-col
          cols="12"
          v-for="item in paginatedItems"
          :key="item.id"
          class="my-3 cursor"
          @click="selectItem"
        >
          <slot name="item" :item="item">
            <p>Nothing here!</p>
          </slot>
        </b-col>
        <b-col cols="12" class="mb-3 text-center">
          <main-button
            v-if="canDisplayMoreItems"
            @click="currentStep++"
            label="more"
            :small="true"
          />
        </b-col>
        <b-col cols="12" class="mb-3 text-center">
          <slot name="footer"></slot>
        </b-col>
        <b-col
          v-if="totalItemsLength == 0"
          class="text-center font-size-16 font-w500 mt-3"
        >
          <span :class="darkMode ? 'text-dark' : 'text-light'">
            No results found.
          </span>
        </b-col>
      </b-row>
    </div>
  </modal-base>
</template>

<script lang="ts">
import {
  Watch,
  Component,
  Vue,
  Prop,
  Emit,
  PropSync
} from "vue-property-decorator";
import { vxm } from "@/store";
import ModalBase from "@/components/modals/ModalBase.vue";
import { VModel } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: { ModalBase, MainButton }
})
export default class ModalSelect extends Vue {
  @VModel() show!: boolean;
  @Prop({ default: [] }) items!: any[];
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ type: String, default: "" }) subtitle!: string;
  @PropSync("search", { type: String }) searchQuery!: string;

  perStep = 30;
  currentStep = 1;

  @Emit()
  selectItem(item: any) {
    return item;
  }

  get itemsToLoad() {
    return this.currentStep * this.perStep;
  }

  get paginatedItems() {
    return this.items.slice(0, this.itemsToLoad);
  }

  get canDisplayMoreItems() {
    return this.totalItemsLength > this.itemsToLoad;
  }

  get totalItemsLength() {
    return this.items.length;
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
