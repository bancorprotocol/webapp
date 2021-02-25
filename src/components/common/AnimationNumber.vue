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
  @Prop({ default: false }) watch!: boolean;
  @Prop({ default: 0 }) startingValue!: number;
  @Prop() targetValue!: number;
  @Prop({ default: 3000 }) animationTime!: number; //ms
  @Prop({ default: 15000 }) intervalTime!: number; //ms
  @Prop() intervalFunction!: Function;

  interval: any = null;
  oldValue: number = -1;

  currentNumber: number = 0;

  created() {
    this.currentNumber = this.startingValue;
  }

  async mounted() {
    if (this.animateOnMount) this.tween(this.startingValue, this.targetValue);
    if (this.intervalFunction)
      this.interval = setInterval(async () => {
        this.oldValue = this.targetValue;
        await this.intervalFunction();
      }, this.intervalTime);
  }

  @Watch("targetValue")
  @Watch("animationTime")
  onValueChange() {
    if (this.watch) {
      this.tween(
        this.oldValue === -1 ? this.startingValue : this.oldValue,
        this.targetValue
      );
    }
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
    clearInterval(this.interval);
  }
}
</script>

<style lang="scss"></style>
