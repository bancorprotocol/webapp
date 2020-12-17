<template>
  <div>
    <label-content-split :label="label">
      <span
        :class="darkMode ? 'text-dark' : 'text-light'"
        class="font-size-16 font-w700"
        >{{ percentage }} %</span
      >
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
    ></b-form-input>
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
import { Prop, VModel } from "vue-property-decorator";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { Options } from "vue-class-component/dist/vue-class-component"

@Options({
  components: { LabelContentSplit, MainButton }
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
    else if (this.darkMode) return "outline-gray-dark";
    else return "outline-gray";
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
