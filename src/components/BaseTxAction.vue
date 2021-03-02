<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import { ITxMeta, Prompt, Step } from "@/types/bancor";

@Component
export default class BaseTxAction extends BaseComponent {
  txMeta: ITxMeta = {
    showTxModal: false,
    txBusy: false,
    success: null,
    txError: "",
    sections: [],
    stepIndex: 0,
    prompt: null
  };

  openModal() {
    //@ts-ignore
    if (!this.currentUser) return this.promptAuth();

    this.txMeta.showTxModal = true;
  }

  onUpdate(index: number, steps: Step[]) {
    this.txMeta.sections = steps;
    this.txMeta.stepIndex = index;
  }

  onPrompt(prompt: Prompt) {
    this.txMeta.txBusy = false;
    this.txMeta.prompt = prompt;
  }
}
</script>
