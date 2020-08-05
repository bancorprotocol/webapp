<template>
  <b-modal
    id="modal-tx"
    size="md"
    centered
    hide-header
    hide-footer
    :visible="value"
    :hide-header-close="busy"
    @close="onClose"
    @cancel="onCancel"
    @hide="onHide"
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
  >
    <b-row>
      <b-col class="d-flex justify-content-between">
        <h5 :class="darkMode ? 'text-body-dark' : 'text-body-light'">
          {{ title }}
        </h5>
        <font-awesome-icon
          icon="times"
          @click="onHide()"
          class="cursor"
          :class="darkMode ? 'text-body-dark' : 'text-body-light'"
        />
      </b-col>
    </b-row>
    <transition name="slide-fade" mode="out-in">
      <slot></slot>
    </transition>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { TokenPrice } from "@/types/bancor";

@Component
export default class ModalConvertToken extends Vue {
  @Prop() title!: string;
  @Prop() value!: boolean;
  @Prop() busy!: boolean;

  get darkMode() {
    return vxm.general.darkMode;
  }

  onClose(event: any) {
    event.preventDefault();
    this.$emit("input", false);
  }

  onCancel(event: any) {
    event.preventDefault();
    this.$emit("input", false);
  }

  onHide(event: any) {
    if (this.busy) {
      event.preventDefault();
    }
    this.$emit("input", false);
  }
}
</script>

<style scoped lang="scss">
.row {
  // min-height: 50vh;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
