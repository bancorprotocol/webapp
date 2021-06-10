<template>
  <modal-base v-model="txMetaData.showTxModal" size="sm" @onHide="close">
    <div
      v-if="showSlotContent"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <div class="d-flex justify-content-center mb-3">
        <div
          class="d-flex justify-content-center align-items-center rounded-circle"
          :class="`bg-${iconVariant}`"
          style="width: 60px; height: 60px"
        >
          <font-awesome-icon
            v-if="iconName"
            :icon="iconName"
            class="text-white"
            size="2x"
          />
        </div>
      </div>

      <div class="font-size-20 font-w600 mb-3">
        {{ titleMsg }}
      </div>

      <slot v-if="noPrompt"></slot>

      <slot
        v-if="
          txMetaData.prompt &&
          txMetaData.prompt.questions[0].label === 'confirm'
        "
      />
      <div
        v-else-if="
          txMetaData.prompt && txMetaData.prompt.questions.length === 2
        "
        class="font-size-14"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Before you can proceed, you need to<br />
        approve your token spending amount.
      </div>

      <div v-if="txMetaData.prompt" class="d-block mt-3">
        <div v-for="question in txMetaData.prompt.questions" :key="question.id">
          <b-btn
            v-if="question.label === 'unlimited'"
            @click="selectedPromptReceiver(question.id)"
            class="mt-2 rounded py-2 btn-block"
            variant="primary"
          >
            Unlimited Approval
          </b-btn>
          <div
            v-if="question.label === 'limited'"
            class="font-size-12 mt-3"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            <div>Want to approve before each transaction?</div>
            <span
              @click="selectedPromptReceiver(question.id)"
              class="font-w500 cursor"
            >
              <u>Limited Approval</u>
            </span>
          </div>
          <b-btn
            v-if="question.label === 'confirm'"
            @click="selectedPromptReceiver(question.id)"
            class="mt-2 rounded py-2 btn-block"
            variant="primary"
          >
            Confirm
          </b-btn>
        </div>
      </div>
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
  @Prop({ default: "primary" }) iconVariant!: string;
  @Prop({ required: false }) redirectOnSuccess?: string;
  @Prop({ default: false }) noPrompt?: boolean;

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

  get showApprovalOptions() {
    return (
      this.txMetaData.prompt && this.txMetaData.prompt.questions.length === 2
    );
  }

  get titleMsg() {
    return this.showApprovalOptions ? "Approve Token" : this.title;
  }

  get iconName() {
    return this.showApprovalOptions ? "unlock" : this.icon;
  }

  selectedPromptReceiver(id: string) {
    this.txMetaData.txBusy = true;
    selectedPromptReceiver$.next(id);
  }

  resetTxMeta() {
    this.txMetaData.showTxModal = false;
    this.txMetaData.txBusy = false;
    this.txMetaData.success = null;
    this.txMetaData.txError = "";
    this.txMetaData.sections = [];
    this.txMetaData.stepIndex = 0;
    this.txMetaData.prompt = null;
  }

  @Emit("onHide")
  onHideCallBack() {
    return (
      this.txMetaData.stepIndex <= 1 &&
      !this.txMetaData.txError &&
      !this.txMetaData.success
    );
  }

  async close() {
    if (this.txMetaData.txBusy) return;
    if (this.redirectOnSuccess && this.txMetaData.success) {
      await this.$router.replace({ name: this.redirectOnSuccess });
    }
    this.onHideCallBack();

    this.resetTxMeta();
  }
}
</script>
