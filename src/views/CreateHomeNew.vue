<template>
  <div>
    <content-block :shadow="true" class="mb-3">
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

        <alert-block variant="error" :msg="errorStep1" class="mt-3" />

        <main-button
          @click="nextStep"
          :label="stepsConfirmButton"
          :active="stepsConfirmError"
          class="mt-3"
          :large="true"
          :disabled="!stepsConfirmError"
        />
      </div>
    </content-block>

    <modal-base
      title="You are creating a pool"
      v-model="modal"
      @input="setDefault"
    >
      <b-row v-if="!(txBusy || success || error)">
        <b-col cols="12" class="text-center mb-3">
          <span
            v-for="(item, index) in selectedTokens"
            :key="index"
            class="font-size-24 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            {{ item.token.symbol }}
            <span v-if="selectedTokens.length !== index + 1">/</span>
          </span>
        </b-col>
        <b-col cols="12">
          <gray-border-block>
            <label-content-split
              v-for="item in selectedTokens"
              :key="item.token.id"
              :label="item.token.symbol + ' Ratio'"
              :value="item.percentage + '%'"
            />
            <label-content-split label="Fee" :value="stepTwoProps.poolFee" />
            <label-content-split
              label="Pool Name"
              :value="stepTwoProps.poolName"
            />
            <label-content-split
              label="Token Symbol"
              :value="stepTwoProps.poolSymbol"
            />
          </gray-border-block>
        </b-col>
      </b-row>

      <action-modal-status
        v-else
        :error="error"
        :success="success"
        :step-description="currentStatus"
      />

      <main-button
        @click="createPool"
        class="mt-3"
        :label="modalConfirmButton"
        :active="true"
        :large="true"
        :disabled="txBusy"
      />
    </modal-base>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolActionsHeader from "@/components/pool/PoolActionsHeader.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import CreateV1Step1 from "@/components/pool/create/CreateV1Step1.vue";
import CreateV1Step2 from "@/components/pool/create/CreateV1Step2.vue";
import CreateV2Step1 from "@/components/pool/create/CreateV2Step1.vue";
import CreateV2Step2 from "@/components/pool/create/CreateV2Step2.vue";
import MainButton from "@/components/common/Button.vue";
import { Step, TxResponse, ViewToken } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BancorCheckbox from "@/components/common/BancorCheckbox.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import { compareString } from "@/api/helpers";
import AlertBlock from "@/components/common/AlertBlock.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import AdvancedBlockItem from "@/components/common/AdvancedBlockItem.vue";

export interface CreateStep1 {
  token: ViewToken | null;
  percentage: string;
}

export interface CreateStep2 {
  poolName: string;
  poolSymbol: string;
  poolDecimals: number;
  poolFee: string;
}

@Component({
  components: {
    AdvancedBlockItem,
    GrayBorderBlock,
    AlertBlock,
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

  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

  stepOneProps: CreateStep1[] = [
    {
      token: vxm.bancor.token(vxm.bancor.newNetworkTokenChoices[0].id),
      percentage: "50"
    },
    {
      token: null,
      percentage: "50"
    }
  ];

  stepTwoProps: CreateStep2 = {
    poolName: "",
    poolSymbol: "",
    poolDecimals: 18,
    poolFee: "0.02"
  };

  get stepsConfirmButton() {
    return this.step === 1 ? "Continue" : "Create a Pool";
  }

  get modalConfirmButton() {
    return this.error
      ? "Try Again"
      : this.success
      ? "Close"
      : this.txBusy
      ? "processing ..."
      : "Confirm";
  }

  get stepsConfirmError() {
    if (this.selectedTokens.length <= 1) return false;
    else if (this.step === 1 && this.errorStep1) return false;
    else if (this.step === 2 && this.errorStep2) return false;
    else return true;
  }

  get errorStep1() {
    if (this.existingPoolWarning) return this.existingPoolWarning;
    else if (this.percentageWarning) return this.percentageWarning;
    else return "";
  }

  get errorStep2() {
    if (
      this.stepTwoProps.poolName &&
      this.stepTwoProps.poolSymbol &&
      this.stepTwoProps.poolFee &&
      this.stepTwoProps.poolDecimals
    )
      return false;
    else return true;
  }

  get percentageWarning() {
    return this.totalPercentage > 100 ? "Maximum total reserve is 100%" : "";
  }

  get totalPercentage() {
    let sum = 0;
    for (const item of this.stepOneProps) {
      if (item.token) {
        sum += parseInt(item.percentage);
      }
    }
    return sum;
  }

  get currentStatus() {
    if (this.sections.length) {
      return this.sections[this.stepIndex].description;
    }
    return undefined;
  }

  get existingPoolWarning() {
    return this.existingPool ? "A pool like this already exists" : "";
  }

  get selectedTokens() {
    return this.stepOneProps.filter((p: CreateStep1) => p.token !== null);
  }

  get tokenIdArray() {
    const array = [];
    for (const item of this.selectedTokens) {
      const tokenId = item.token!.id;
      const decReserveWeight = (parseFloat(item.percentage) / 100).toString();
      array.push({ tokenId, decReserveWeight });
    }
    return array;
  }

  get existingPool() {
    if (this.stepOneProps.length <= 1) return false;
    const suggestion = this.tokenIdArray;

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
    if (this.success) {
      this.modal = false;
      this.setDefault();
      await this.$router.push({ name: "Pool" });
      return;
    }

    if (this.error) {
      this.setDefault();
      return;
    }

    this.setDefault();

    const tokens = this.tokenIdArray;

    this.txBusy = true;

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
    this.stepOneProps = this.stepOneProps.filter(
      (p: CreateStep1) => p.token !== null
    );
    if (this.step === 2) this.modal = true;
    else this.step++;
  }

  prevStep() {
    this.step--;
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = null;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
