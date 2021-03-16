<template>
  <modal-base v-model="show">
    <h1>Place Holder</h1>
  </modal-base>
</template>

<script lang="ts">
import { Component, VModel } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import ModalBase from "@/components/modals/ModalBase.vue";

@Component({
  components: {
    ModalBase
  }
})
export default class ModalProtectedFilters extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;

  onHide() {
    this.show = false;
  }
}
</script>

<style lang="scss"></style>
