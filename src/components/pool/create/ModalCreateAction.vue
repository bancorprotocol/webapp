<template>
  <modal-two v-model="modal" @input="setDefault" title="Create Pool">
    <b-row class="d-flex justify-content-center">
      <action-modal-status
        v-if="txBusy || error || success"
        :error="error"
        :success="success"
        :step-description="
          sections.length ? sections[stepIndex].description : undefined
        "
      />

      <b-col cols="12">
        <bancor-checkbox v-model="notUsState" label="Not a U.S. Citizen" />
        <main-button
          @click="initAction"
          :active="true"
          :label="confirmButton"
          :disabled="txBusy"
          :large="true"
        />
      </b-col>
    </b-row>
  </modal-two>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import {
  LiquidityModule,
  LiquidityParams,
  Step,
  ViewRelay,
  ViewReserve,
  ViewToken,
  TxResponse
} from "@/types/bancor";
import SelectPoolRow from "@/components/pool/SelectPoolRow.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import AdvancedBlockItem from "@/components/common/AdvancedBlockItem.vue";
import MainButton from "@/components/common/Button.vue";
import { namespace } from "vuex-class";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BancorCheckbox from "@/components/common/BancorCheckbox.vue";
import ModalTwo from "@/components/common/ModalTwo.vue";
import { VModel } from "@/api/helpers";

const bancor = namespace("bancor");

@Component({
  components: {
    BancorCheckbox,
    ActionModalStatus,
    AdvancedBlockItem,
    PoolLogos,
    SelectPoolRow,
    MainButton
  }
})
export default class ModalCreateAction extends Vue {
  @VModel({ type: Boolean }) modal!: boolean;
  @Prop() token1!: ViewToken;
  @Prop() token2!: ViewToken;
  @Prop() amount1!: string;
  @Prop() amount2!: string;

  fee = 0;
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

  notUsState: boolean = true;

  get confirmButton() {
    return this.error
      ? "Try Again"
      : this.success
      ? "Close"
      : this.txBusy
      ? "processing ..."
      : "Confirm";
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = "";
    this.notUsState = false;
    this.fee = 0;
  }

  get isCountryBanned() {
    return vxm.general.isCountryBanned;
  }

  async initAction() {
    if (this.success) {
      this.$bvModal.hide("modal-create-action");
      this.setDefault();
      return;
    }

    if (this.error) {
      this.setDefault();
      return;
    }

    if (!this.notUsState || this.isCountryBanned) {
      this.error =
        "This action through swap.bancor.network is not available in your country.";
      return;
    }

    this.setDefault();

    try {
      const fee = this.fee || 0;
      this.txBusy = true;

      const txResult = await vxm.bancor.createPool({
        reserves: [
          { id: this.token1.id, amount: this.amount1 },
          { id: this.token2.id, amount: this.amount2 }
        ],
        fee: fee / 100,
        onUpdate: this.onUpdate
      });
      this.success = txResult;
    } catch (e) {
      this.error = e.message;
    } finally {
      this.txBusy = false;
    }
  }

  onUpdate(stepIndex: number, steps: Step[]) {
    this.stepIndex = stepIndex;
    this.sections = steps;
  }
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
</style>
