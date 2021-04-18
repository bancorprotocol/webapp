<template>
  <div class="d-flex justify-content-between align-items-center">
    <span class="font-size-sm">{{ label }}</span>
    <div>
      <b-button-group class="d-flex">
        <b-button
          class="shadow-none"
          size="sm"
          :variant="
            status ? 'outline-primary' + (status ? '-dark' : '') : 'primary'
          "
          style="width: 50%"
          @click="turnOff"
          >{{ $t("off") }}</b-button
        >
        <b-button
          class="shadow-none"
          size="sm"
          :variant="
            !status ? 'outline-primary' + (status ? '-dark' : '') : 'primary'
          "
          style="width: 50%"
          @click="turnOn"
          >{{ $t("on") }}</b-button
        >
      </b-button-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class MenuToggle extends Vue {
  @VModel() status!: boolean;

  @Prop({ default: "" }) label?: string;

  turnOn() {
    this.status = true;
  }

  turnOff() {
    this.status = false;
  }
}
</script>

<style scoped lang="scss"></style>
