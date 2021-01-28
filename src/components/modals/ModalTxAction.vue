<template>
  <modal-base
    title="You are staking and protecting:"
    v-model="txMeta.showTxModal"
    @input="close"
  >
    <action-modal-status
      :error="txMeta.txError"
      :success="txMeta.success"
      :step-description="currentStatus"
    />
  </modal-base>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import ModalBase from "@/components/modals/ModalBase.vue";
import { ITxMeta } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";

@Component({
  components: { ActionModalStatus, ModalBase }
})
export default class ModalTxAction extends Vue {
  @Prop() txMeta!: ITxMeta;
  @Prop({ default: "Processing Transaction" }) title!: string;

  get currentStatus() {
    if (this.txMeta.sections.length)
      return this.txMeta.sections[this.txMeta.stepIndex].description;
    else return null;
  }

  @Emit("close")
  close() {}
}
</script>
