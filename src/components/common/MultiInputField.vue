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
          fontSizeClass,
          active ? 'custom-input-active' : ''
        ]"
        @blur.native="blur"
        v-model="text"
        :placeholder="placeholder"
        :type="type"
        :style="styleInput"
        :autofocus="autofocus"
        :formatter="format ? formatter : null"
      />
      <b-input-group-append v-if="append || clear || appendSlot">
        <div
          class="rounded-right d-flex align-items-center font-size-12 font-w500"
          :class="[
            darkMode ? 'form-control-alt-dark' : 'form-control-alt-light',
            padding ? 'pr-2 pl-2' : ''
          ]"
          :style="styleAppend"
        >
          <div v-if="append" class="pr-2">
            {{ append }}
          </div>

          <slot v-if="appendSlot"></slot>

          <font-awesome-icon
            v-if="clear && text"
            class="cursor"
            @click="clearText"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            icon="times"
          />
          <div v-else style="min-width: 8px"></div>
        </div>
      </b-input-group-append>
    </b-input-group>
    <alert-block
      v-if="alertMsg !== ''"
      :variant="alertVariant"
      :msg="alertMsg"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel } from "vue-property-decorator";
import { i18n } from "@/i18n";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { LabelContentSplit, AlertBlock }
})
export default class MultiInputField extends BaseComponent {
  @VModel() text!: string | number;
  @Prop({ default: i18n.t("enter_here") }) placeholder!: string;
  @Prop({ default: "text" }) type!: string;
  @Prop() label?: string;
  @Prop({ default: "md" }) fontSize!: "sm" | "md" | "lg";
  @Prop({ default: 35 }) height!: number;
  @Prop() append?: string;
  @Prop() prepend?: string;
  @Prop() alertMsg?: string;
  @Prop({ default: true }) padding?: boolean;
  @Prop({ default: false }) format?: boolean;
  @Prop({ default: "error" }) alertVariant?: string;
  @Prop({ default: false }) autofocus?: boolean;
  @Prop({ default: false }) clear!: boolean;
  @Prop({ default: false }) active!: boolean;
  @Prop({ default: false }) appendSlot!: boolean;
  @Prop({ default: false }) centerText!: boolean;
  @Prop() blurFunc?: Function;

  get styleInput() {
    const height = "height: " + this.height + "px;";
    const borderRight = "border-right: 0 !important;";
    const borderLeft = "border-left: 0 !important;";
    let border = "";
    if (this.append || this.clear || this.appendSlot) border += borderRight;
    if (this.prepend) border += borderLeft;
    if (this.centerText) border += "text-align:center;";
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

  blur() {
    if (this.blurFunc) this.blurFunc();
  }

  formatter(text: String) {
    if (text === undefined) text = this.text.toString();

    return text
      .replace(/[^\d\.]/g, "")
      .replace(/\./, "x")
      .replace(/\./g, "")
      .replace(/x/, ".");
  }

  clearText() {
    this.text = "";
  }
}
</script>
<style lang="scss">
// @import "../../../assets/_scss/custom/variables";
</style>
