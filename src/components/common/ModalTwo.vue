<template>
  <b-modal
    scrollable
    :size="size"
    centered
    v-model="value"
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
            <b-input-group>
              <b-form-input
                v-model="searchField"
                placeholder="Search"
                :class="
                  darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'
                "
              ></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
      </div>
    </template>

    <slot></slot>
  </b-modal>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  PropSync,
  Vue,
  Emit,
  Model
} from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class ModalTwo extends Vue {
  @Prop() id!: string;
  @Prop() title!: string;
  @Model("input", { type: Boolean }) readonly value!: boolean;
  @Prop({ default: "md" }) size!: "sm" | "md" | "lg";
  @PropSync("search", { type: String }) searchField?: string;
  @Prop({ default: false }) fixedHeight!: boolean;

  tokenSearch: string = "";

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  get contentClass() {
    return [
      { "base-modal": this.fixedHeight },
      { "bg-block-dark": this.darkMode },
      { "bg-block-light": !this.darkMode }
    ];
  }

  @Emit("on-hide-modal")
  onHide(event: any) {}
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
