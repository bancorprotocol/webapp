<template>
  <div>
    <content-block class="mb-3">
      <template slot="header">
        <pool-actions-header title="Create a Pool" @back="back" />
      </template>

      <div class="mt-3">
        <label-content-split v-if="step === 1" label="Pool Type">
          <b-badge variant="primary" size="sm" class="px-2">V1</b-badge>
        </label-content-split>

        <div v-if="version === 1">
          <create-v1-step1 v-if="step === 1" v-model="stepOneProps" />
          <create-v1-step2 v-else v-model="stepTwoProps" />
        </div>

        <div v-else>
          <create-v2-step1 v-if="step === 1" />
          <create-v2-step2 v-else />
        </div>

        <div
          v-if="existingPoolWarning"
          class="text-center font-size-12 font-w600 mt-3"
        >
          {{ existingPoolWarning }}
        </div>

        <main-button
          @click="nextStep"
          label="Continue"
          :active="true"
          class="mt-3"
          :large="true"
        />
      </div>
    </content-block>
    <modal-base title="Create Pool" v-model="modal">
      <div v-if="!(txBusy || success || error)" class="w-100">
        <b-col cols="12">Some info here ...</b-col>
        <b-col cols="12">
          <bancor-checkbox
            v-model="notUsState"
            label="I am not a US citizen or domiciliary"
          />
        </b-col>
      </div>
      <action-modal-status
        v-if="txBusy || error || success"
        :error="error"
        :success="success"
        :step-description="
          sections.length ? sections[stepIndex].description : undefined
        "
      />
      <main-button
        @click="createPool"
        class="mt-4"
        label="Create Pool"
        :active="true"
        :large="true"
        :disabled="txBusy"
      />
    </modal-base>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolActionsHeader from "@/components/pool/PoolActionsHeader.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import CreateV1Step1 from "@/components/pool/create/CreateV1Step1.vue";
import CreateV1Step2 from "@/components/pool/create/CreateV1Step2.vue";
import CreateV2Step1 from "@/components/pool/create/CreateV2Step1.vue";
import CreateV2Step2 from "@/components/pool/create/CreateV2Step2.vue";
import MainButton from "@/components/common/Button.vue";
import { Step, TxResponse, ViewModalToken, ViewToken } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BancorCheckbox from "@/components/common/BancorCheckbox.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import { compareString } from "@/api/helpers";

export interface CreateStep1 {
  token1: ViewToken;
  token2: ViewToken | null;
  percentage1: string;
  percentage2: string;
}

export interface CreateStep2 {
  poolName: string;
  poolSymbol: string;
  poolDecimals: number;
  poolFee: string;
}

@Component({
  components: {
    ModalBase,
    BancorCheckbox,
    ActionModalStatus,
    LabelContentSplit,
    PoolActionsHeader,
    ContentBlock,
    CreateV1Step1,
    CreateV1Step2,
    CreateV2Step1,
    CreateV2Step2,
    MainButton
  }
})
export default class CreateHomeNew extends Vue {
  version: 1 | 2 = 1;
  step = 1;
  modal = false;
  notUsState: boolean = false;

  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

  stepOneProps: CreateStep1 = {
    token1: vxm.bancor.token(vxm.bancor.newNetworkTokenChoices[0].id),
    token2: null,
    percentage1: "50",
    percentage2: "50"
  };

  stepTwoProps: CreateStep2 = {
    poolName: "",
    poolSymbol: "",
    poolDecimals: 18,
    poolFee: "0.02"
  };

  get existingPoolWarning() {
    return this.existingPool ? "A pool like this already exists" : "";
  }

  get existingPool() {
    if (this.stepOneProps.token2 === null) return false;
    const suggestion = [
      this.stepOneProps.token1.id,
      this.stepOneProps.token2.id
    ].map(tokenId => ({
      tokenId,
      decReserveWeight: "0.5"
    }));
    const relays = vxm.ethBancor.relays;
    const existingPooll = relays.find(relay =>
      relay.reserves.every(r =>
        suggestion.some(token => compareString(token.tokenId, r.id))
      )
    );
    if (existingPooll) {
      console.log(existingPooll, "is the existing pool");
      return true;
    } else {
      console.log("no pool found");
      return false;
    }
  }

  async createPool() {
    const tokens = [
      this.stepOneProps.token1.id,
      this.stepOneProps.token2!.id
    ].map(tokenId => ({ tokenId, decReserveWeight: "0.4" }));

    this.txBusy = true;
    this.error = "";

    try {
      const res = await vxm.ethBancor.createV1Pool({
        onUpdate: this.onUpdate,
        reserves: tokens,
        poolName: this.stepTwoProps.poolName,
        poolSymbol: this.stepTwoProps.poolSymbol,
        decimals: this.stepTwoProps.poolDecimals,
        decFee: this.stepTwoProps.poolFee
      });
      this.success = res;
    } catch (e) {
      this.error = e.message;
    } finally {
      this.txBusy = false;
    }
  }

  onUpdate(index: number, steps: any[]) {
    this.sections = steps;
    this.stepIndex = index;
  }

  back() {
    const atStart = this.step == 1;
    if (atStart) {
      this.$router.push({ name: "Pool" });
    } else {
      this.prevStep();
    }
  }

  nextStep() {
    if (this.step === 2) this.modal = true;
    else this.step++;
  }

  prevStep() {
    this.step--;
  }
}
</script>

<style scoped lang="scss"></style>
