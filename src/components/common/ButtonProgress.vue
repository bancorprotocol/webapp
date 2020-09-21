<template>
  <div :class="`button-progress`">
    <div class="button-progress__radio" :class="{'button-progress__radio--selected': selected}"></div>
    <div class="button-progress__content">
      <div class="pb-1" @click="click">
        <span class="font-size-14 font-w500 text-uppercase">{{title}}</span><!-- 
     --><span class="font-size-12 font-w500 text-muted-light pl-1">{{percentageValue}}</span>
      </div>
      <progress-bar :type="type" :percentage="percentage" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import numeral from "numeral";

import ProgressBar from "@/components/common/ProgressBar.vue";

@Component({
  components: {
    ProgressBar,
  }
})
export default class ButtonProgress extends Vue {
  @Prop() title?: string;
  @Prop() selected?: boolean;
  @Prop() type?: "warn" | "error" | "info";
  @Prop() percentage?: number;
  @Prop() click?: any;

  get percentageValue() {
    return `${(+(this.percentage || 0))?.toFixed(2)}%`;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

$button-progress---padding: 8px;
$button-progress---border-radius: 8px;
$button-progress__radio---size: 14px;
$button-progress__radio--selected---color: $primary;
$button-progress---border: $block-border-blue;
$button-progress---background: $block-bg-blue;

.button-progress {
  border-radius: $button-progress---border-radius;
  padding: $button-progress---padding;
  background: $button-progress---background;
  border: 1px solid $button-progress---border;
  display: flex;
  align-items: top;
  
  &__radio {
    box-sizing: border-box;
    height: $button-progress__radio---size;
    width: $button-progress__radio---size;
    border-radius: $button-progress__radio---size / 2;
    border: 1px solid $button-progress---border;
    margin-right: $button-progress---padding;
    box-shadow:
      inset 0 0 0 ($button-progress__radio---size / 2) #ffffff,
      inset 0 0 0 ($button-progress__radio---size / 2) $button-progress__radio--selected---color;

    &--selected {
      border-color: $button-progress__radio--selected---color;
      box-shadow:
        inset 0 0 0 3px #ffffff,
        inset 0 0 0 ($button-progress__radio---size / 2) $button-progress__radio--selected---color;
    }
  }

  &__content {
    line-height: 16px;
    flex: 1;
  }
}
</style>
