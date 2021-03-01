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

  onUpdate(index: number, steps: Step[]) {
    this.txMeta.sections = steps;
    this.txMeta.stepIndex = index;
  }

  setTxDefault() {
    this.txMeta = {
      showTxModal: false,
      txBusy: false,
      success: null,
      txError: "",
      sections: [],
      stepIndex: 0,
      prompt: null
    };
  }

  async onPrompt(prompt: Prompt) {
    this.txMeta.prompt = prompt;
  }
}
</script>
