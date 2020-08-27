<template>
  <div>
    <label-content-split v-if="label" :label="label" class="mb-2" />
    <b-form-input
      :class="[
        !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
        fontSizeClass
      ]"
      v-model="text"
      :placeholder="placeholder"
      class="mb-1"
      :type="type"
      :style="'height: ' + height + 'px;'"
    ></b-form-input>
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
  @VModel({ type: String }) text!: string;
  @Prop({ default: "Enter here" }) placeholder!: string;
  @Prop({ default: "text" }) type!: string;
  @Prop() label?: string;
  @Prop({ default: "md" }) fontSize!: "sm" | "md" | "lg";
  @Prop({ default: 32 }) height!: number;

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
