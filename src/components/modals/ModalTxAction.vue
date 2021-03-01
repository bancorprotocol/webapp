<template>
  <modal-base v-model="txMetaData.showTxModal" size="sm" @input="close">
    <div
      v-if="showSlotContent"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <div class="d-flex justify-content-center mb-3">
        <div
          class="d-flex justify-content-center align-items-center bg-primary rounded-circle"
          style="width: 60px; height: 60px"
        >
          <font-awesome-icon
            v-if="icon"
            :icon="icon"
            class="text-white"
            size="2x"
          />
        </div>
      </div>

      <div class="font-size-20 font-w600 mb-4">
        {{ title }}
      </div>

      <slot />

      <div v-if="txMetaData.prompt" class="d-flex flex-column mt-2">
        <b-btn
          @click="selectedPromptReceiver(question.id)"
          v-for="question in txMetaData.prompt.questions"
          :key="question.id"
          class="mt-2 rounded py-2"
          variant="primary"
        >
          {{ question.label }}
        </b-btn>
      </div>
      <b-btn
        v-else
        @click="confirm"
        class="btn-block py-2 rounded mt-3"
        size="lg"
        variant="primary"
        >Confirm</b-btn
      >
    </div>
    <action-modal-status
      v-else
      :error="txMetaData.txError"
      :success="txMetaData.success"
      :step-description="currentStatus"
    />
  </modal-base>
</template>
<script lang="ts">
import { Component, Emit, Prop, PropSync } from "vue-property-decorator";
import ModalBase from "@/components/modals/ModalBase.vue";
import { ITxMeta } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { selectedPromptReceiver$ } from "@/api/observables";

@Component({
  components: { ActionModalStatus, ModalBase }
})
export default class ModalTxAction extends BaseComponent {
  @PropSync("txMeta") txMetaData!: ITxMeta;
  @Prop({ default: "" }) title!: string;
  @Prop({ required: false }) icon?: string;
  @Prop({ required: false }) redirectOnSuccess?: string;

  get currentStatus() {
    if (this.txMetaData.sections.length)
      return this.txMetaData.sections[this.txMetaData.stepIndex].description;
    else return null;
  }

  get showSlotContent() {
    return !(
      this.txMetaData.txBusy ||
      this.txMetaData.success ||
      this.txMetaData.txError
    );
  }

  selectedPromptReceiver(id: string) {
    this.txMetaData.txBusy = true;
    selectedPromptReceiver$.next(id);
  }

  @Emit("onConfirm")
  async confirm() {}

  @Emit("onClose")
  async close() {
    if (this.redirectOnSuccess && this.txMetaData.success) {
      await this.$router.replace({ name: this.redirectOnSuccess });
    }
    this.txMetaData = {
      showTxModal: false,
      txBusy: false,
      success: null,
      txError: "",
      sections: [],
      stepIndex: 0,
      prompt: null
    };
  }
}
</script>
