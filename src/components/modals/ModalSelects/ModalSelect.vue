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
            class="font-w500 font-size-12"
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
            <p>{{ $t("nothing_here") }}</p>
          </slot>
        </b-col>
        <b-col v-if="loadingTokens" cols="12" class="text-center">
          <span>
            <font-awesome-icon icon="circle-notch" class="mr-3" spin />
            {{ `${$t("loading")}...` }}
          </span>
        </b-col>
        <b-col cols="12" class="mb-3 text-center">
          <main-button
            v-if="canDisplayMoreItems"
            @click="currentStep++"
            :label="$t('more')"
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
            {{ `${$t("no_res_found")}.` }}
          </span>
        </b-col>
      </b-row>
    </div>
  </modal-base>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Emit,
  PropSync,
  VModel
} from "vue-property-decorator";
import { vxm } from "@/store";
import ModalBase from "@/components/modals/ModalBase.vue";
import MainButton from "@/components/common/Button.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { ModalBase, MainButton }
})
export default class ModalSelect extends BaseComponent {
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

  get loadingTokens() {
    return vxm.bancor.loadingTokens;
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

  get showAmount() {
    return this.currentStep * this.perStep;
  }
}
</script>

<style scoped lang="scss"></style>
