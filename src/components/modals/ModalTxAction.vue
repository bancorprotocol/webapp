<template>
  <modal-base :title="title" v-model="txMeta.showTxModal" @input="close">
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
import { i18n } from "@/i18n";

@Component({
  components: { ActionModalStatus, ModalBase }
})
export default class ModalTxAction extends Vue {
  @Prop() txMeta!: ITxMeta;
  @Prop({ default: `${i18n.t("staking_protecting")}:` }) title!: string;

  get currentStatus() {
    if (this.txMeta.sections.length)
      return this.txMeta.sections[this.txMeta.stepIndex].description;
    else return null;
  }

  @Emit("close")
  close() {}
}
</script>
