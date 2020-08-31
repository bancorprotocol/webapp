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
      :disabled="disabled"
      class="my-2"
    ></b-form-input>
    <b-row v-if="showButtons">
      <b-col cols="3" v-for="p in percentages" :key="p">
        <main-button
          @click="percentage = p"
          :label="`${p}%`"
          :active="p === percentage"
          :small="true"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import { VModel } from "@/api/helpers";

@Component({
  components: { LabelContentSplit, MainButton }
})
export default class PercentageSlider extends Vue {
  @Prop() label!: string;
  @Prop({ default: false }) showButtons!: boolean;
  @VModel({ type: String }) percentage!: string;
  @Prop({ default: false }) disabled!: boolean;

  percentages = ["25", "50", "75", "100"];

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
