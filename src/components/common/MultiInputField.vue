<template>
  <div>
    <label-content-split v-if="label" :label="label" class="mb-2" />
    <b-input-group>
      <b-input-group-prepend v-if="prepend">
        <div
          class="rounded-left d-flex align-items-center pl-2 font-size-12 font-w500"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          :style="stylePrepend"
        >
          <span v-if="prepend !== 'search'">{{ prepend }}</span>
          <font-awesome-icon
            v-else
            icon="search"
            class="ml-1"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          />
        </div>
      </b-input-group-prepend>
      <b-form-input
        :class="[
          !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
          fontSizeClass
        ]"
        v-model="text"
        :placeholder="placeholder"
        :type="type"
        :style="styleInput"
      />
      <b-input-group-append v-if="append">
        <div
          class="rounded-right d-flex align-items-center pr-3 pl-2 font-size-12 font-w500"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          :style="styleAppend"
        >
          {{ append }}
        </div>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel } from "vue-property-decorator";
import { i18n } from "@/i18n";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { LabelContentSplit }
})
export default class MultiInputField extends BaseComponent {
  @VModel() text!: string | number;
  @Prop({ default: i18n.t("enter_here") }) placeholder!: string;
  @Prop({ default: "text" }) type!: string;
  @Prop() label?: string;
  @Prop({ default: "md" }) fontSize!: "sm" | "md" | "lg";
  @Prop({ default: 32 }) height!: number;
  @Prop() append?: string;
  @Prop() prepend?: string;

  get styleInput() {
    const height = "height: " + this.height + "px;";
    const borderRight = "border-right: 0 !important;";
    const borderLeft = "border-left: 0 !important;";
    let border = "";
    if (this.append) border += borderRight;
    if (this.prepend) border += borderLeft;
    return height + border;
  }

  get stylePrepend() {
    const height = "height: " + this.height + "px;";
    const border = "border-right: 0 !important;";
    return height + border;
  }

  get styleAppend() {
    const height = "height: " + this.height + "px;";
    const border = "border-left: 0 !important;";
    return height + border;
  }

  get fontSizeClass() {
    if (this.fontSize === "sm") return "font-size-12";
    else if (this.fontSize === "md") return "font-size-14";
    else return "font-size-16";
  }
}
</script>
<style lang="scss">
// @import "../../../assets/_scss/custom/variables";
</style>
