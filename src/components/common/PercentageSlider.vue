<template>
  <div>
    <label-content-split :label="label">
      <multi-input-field
        style="width: 80px"
        v-model="percentage"
        :padding="false"
        placeholder=""
        append="%"
        :format="true"
      />
    </label-content-split>
    <b-form-input
      id="range-1"
      v-model="percentage"
      type="range"
      min="0"
      max="100"
      debounce="300"
      :disabled="disabled"
      class="my-2"
    />
    <b-row v-if="showButtons">
      <b-col cols="3" v-for="p in percentages" :key="p">
        <b-btn @click="percentage = p" :variant="getVariant(p)" size="xs" block>
          {{ p }}%
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel } from "vue-property-decorator";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import MainButton from "@/components/common/Button.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { LabelContentSplit, MainButton, MultiInputField }
})
export default class PercentageSlider extends BaseComponent {
  @Prop() label!: string;
  @Prop({ default: false }) showButtons!: boolean;
  @VModel({ type: String }) percentage!: string;
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: true }) buttonsDirty!: boolean;

  percentages = ["25", "50", "75", "100"];

  getVariant(percentage: string) {
    if (this.percentage === percentage) return "primary";
    else return this.darkMode ? "outline-gray-dark" : "outline-gray";
  }
}
</script>

<style scoped lang="scss">
.btn-xs {
  padding: 0.25rem 0.4rem !important;
  font-size: 12px !important;
  line-height: 1.1 !important;
  border-radius: 8px !important;
}
</style>
