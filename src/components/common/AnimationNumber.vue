<template>
  <div>
    {{ leadingText }} {{ prettifyNumber(currentNumber, usd) }}
    {{ trailingText }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import TWEEN from "@tweenjs/tween.js";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class AnimationNumber extends BaseComponent {
  @Prop({ default: "" }) trailingText!: string;
  @Prop({ default: "" }) leadingText!: string;
  @Prop({ default: false }) usd!: boolean;
  @Prop({ default: true }) animateOnMount!: boolean;
  @Prop({ default: 0 }) startingValue!: number;
  @Prop() targetValue!: number;
  @Prop({ default: 3000 }) animationTime!: number; //ms

  currentNumber: number = 0;

  created() {
    this.currentNumber = this.startingValue;
  }

  async mounted() {
    if (this.animateOnMount) this.tween(this.startingValue, this.targetValue);
  }

  @Watch("startingValue")
  @Watch("targetValue")
  @Watch("animationTime")
  onValueChange() {
    this.tween(this.startingValue, this.targetValue);
  }

  tween(startValue: number, endValue: number) {
    const vm = this;
    const animate = () => {
      if (TWEEN.update()) {
        requestAnimationFrame(animate);
      }
    };

    new TWEEN.Tween({ tweeningValue: startValue })
      .to({ tweeningValue: endValue }, this.animationTime)
      .onUpdate(obj => {
        vm.currentNumber = obj.tweeningValue;
      })
      .start();

    animate();
  }

  destroyed() {
    TWEEN.removeAll();
  }
}
</script>

<style lang="scss"></style>
