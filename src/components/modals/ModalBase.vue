<template>
  <b-modal
    scrollable
    :size="size"
    centered
    v-model="show"
    hide-footer
    :content-class="contentClass"
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
  >
    <template slot="modal-header">
      <div class="w-100">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-between mb-2">
            <span
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
              >{{ title }}</span
            >
            <font-awesome-icon
              class="cursor font-size-lg"
              :class="darkMode ? 'text-dark' : 'text-light'"
              @click="onHide"
              icon="times"
            />
          </b-col>
        </b-row>
        <b-row v-if="searchField !== undefined">
          <b-col cols="12">
            <multi-input-field
              v-model="searchField"
              :placeholder="$t('search')"
              prepend="search"
              height="48"
              font-size="lg"
            />
          </b-col>
        </b-row>
      </div>
    </template>

    <slot></slot>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, PropSync, VModel } from "vue-property-decorator";
import MultiInputField from "@/components/common/MultiInputField.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { MultiInputField }
})
export default class ModalBase extends BaseComponent {
  @Prop() title!: string;
  @VModel({ type: Boolean }) show!: boolean;
  @PropSync("search", { type: String }) searchField?: string;
  @Prop({ default: "md" }) size!: "sm" | "md" | "lg";
  @Prop({ default: false }) fixedHeight!: boolean;

  get contentClass() {
    return [
      { "base-modal": this.fixedHeight },
      { "bg-block-dark": this.darkMode },
      { "bg-block-light": !this.darkMode }
    ];
  }

  onHide() {
    this.show = false;
  }
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
.base-modal {
  @media (min-width: 900px) and (max-width: 50000px) {
    height: 60vh !important;
  }

  @media (min-width: 500px) and (max-width: 899px) {
    height: 70vh !important;
  }

  height: 90vh !important;
}
</style>
