<template>
  <div>
    <label-content-split v-if="label" :label="label" class="mb-2" />
    <b-input-group>
      <b-form-input
        :class="[
          !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
          fontSizeClass
        ]"
        v-model="text"
        :placeholder="placeholder"
        class="mb-1"
        :type="type"
        :style="style"
      />
      <b-input-group-append v-if="append">
        <div
          class="rounded-right d-flex align-items-center pr-3 pl-2"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          style="border-left: 0 !important;"
        >
          {{ append }}
        </div>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { VModel } from "@/api/helpers";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";

@Component({
  components: { LabelContentSplit }
})
export default class MultiInputField extends Vue {
  @VModel() text!: string | number;
  @Prop({ default: "Enter here" }) placeholder!: string;
  @Prop({ default: "text" }) type!: string;
  @Prop() label?: string;
  @Prop({ default: "md" }) fontSize!: "sm" | "md" | "lg";
  @Prop({ default: 32 }) height!: number;
  @Prop() append?: string;

  get style() {
    const height = "height: " + this.height + "px;";
    const border = "border-right: 0 !important;";
    return this.append ? height + border : height;
  }

  get fontSizeClass() {
    if (this.fontSize === "sm") return "font-size-12";
    else if (this.fontSize === "md") return "font-size-14";
    else return "font-size-16";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>
<style lang="scss">
// @import "../../../assets/_scss/custom/variables";
</style>
