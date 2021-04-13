<template>
  <div>
    <content-block
      :shadow="true"
      :title="$t('create_Pool')"
      :back-button="true"
      @back="back"
      class="mb-3"
    >
      <div class="mt-3">
        <create-v1-step1 v-if="step === 1" v-model="stepOneProps" />
        <create-v1-step2 v-else v-model="stepTwoProps" />

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

    <modal-tx-action
      :title="$t('create_Pool')"
      icon="plus"
      :tx-meta.sync="txMeta"
      redirect-on-success="Portfolio"
    >
      .
    </modal-tx-action>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ContentBlock from "@/components/common/ContentBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import CreateV1Step1 from "@/components/pool/create/CreateV1Step1.vue";
import CreateV1Step2 from "@/components/pool/create/CreateV1Step2.vue";
import MainButton from "@/components/common/Button.vue";
import { ViewToken } from "@/types/bancor";
import { compareString } from "@/api/helpers";
import AlertBlock from "@/components/common/AlertBlock.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import BigNumber from "bignumber.js";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";

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
    ModalTxAction,
    GrayBorderBlock,
    AlertBlock,
    LabelContentSplit,
    ContentBlock,
    CreateV1Step1,
    CreateV1Step2,
    MainButton
  }
})
export default class CreateHomeNew extends BaseTxAction {
  version: 1 | 2 = 1;
  step = 1;
  newPoolId = "";
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
    poolFee: "0.2"
  };

  get stepsConfirmButton() {
    return this.step === 1 ? i18n.t("continue") : i18n.t("create_Pool");
  }

  get stepsConfirmError() {
    if (this.selectedTokens.length <= 1) return false;
    else if (this.step === 1 && this.errorStep1) return false;
    else return !(this.step === 2 && this.errorStep2);
  }

  get errorStep1() {
    // TMP fix
    if (this.stepOneProps.length > 2) return `${i18n.t("curr_two_tokens")}.`;
    if (
      this.stepOneProps[0].percentage !== "50" ||
      this.stepOneProps[1].percentage !== "50"
    )
      return i18n.t("curr_fifty_fifty");

    const fee = parseFloat(this.stepTwoProps.poolFee);
    if (fee > 5 || fee < 0) return i18n.t("fee_zero_five");
    // TMP fix end

    if (this.existingPoolWarning) return this.existingPoolWarning;
    else if (this.percentageWarning) return this.percentageWarning;
    else return "";
  }

  get errorStep2() {
    return !(
      this.stepTwoProps.poolName &&
      this.stepTwoProps.poolSymbol &&
      this.stepTwoProps.poolFee &&
      this.stepTwoProps.poolDecimals
    );
  }

  get percentageWarning() {
    return this.totalPercentage > 100 ? i18n.t("max_reserve") : "";
  }

  get totalPercentage() {
    return this.stepOneProps.reduce(
      (sum, item) => (item.token ? sum + parseInt(item.percentage) : sum),
      0
    );
  }

  get existingPoolWarning() {
    return this.existingPool ? i18n.t("pool_exists") : "";
  }

  get selectedTokens() {
    return this.stepOneProps.filter((p: CreateStep1) => p.token !== null);
  }

  get tokenIdArray() {
    return this.selectedTokens.map(item => {
      const tokenId = item.token!.id;
      const decReserveWeight = (parseFloat(item.percentage) / 100).toString();
      return { decReserveWeight, tokenId };
    });
  }

  get existingPool(): boolean {
    if (this.stepOneProps.length <= 1) return false;
    const suggestion = this.tokenIdArray;
    const draftedTokens = this.stepOneProps.length;
    if (suggestion.length !== draftedTokens) return false;
    const relays = vxm.ethBancor.relays.filter(relay => !relay.v2);

    const existingPool = relays.some(relay =>
      suggestion.every(reserve => {
        const matchingReserve = relay.reserves.find(r =>
          compareString(reserve.tokenId, r.id)
        );
        return matchingReserve;
      })
    );
    return existingPool;
  }

  async createPool() {
    this.openModal();

    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;

    const tokens = this.tokenIdArray;
    const percentFee = this.stepTwoProps.poolFee;
    const decFee = new BigNumber(percentFee).div(100).toString();

    try {
      const success = await vxm.ethBancor.createV1Pool({
        onUpdate: this.onUpdate,
        reserves: tokens,
        poolName: this.stepTwoProps.poolName,
        poolSymbol: this.stepTwoProps.poolSymbol,
        decimals: this.stepTwoProps.poolDecimals,
        decFee,
        onPrompt: this.onPrompt
      });
      this.txMeta.success = success;
      this.newPoolId = success.poolId;
    } catch (e) {
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  back() {
    const atStart = this.step == 1;
    if (atStart) {
      this.$router.push({ name: "Data" });
    } else {
      this.prevStep();
    }
  }

  async nextStep() {
    if (!this.currentUser) {
      //@ts-ignore
      await this.promptAuth();
      return;
    }
    this.stepOneProps = this.stepOneProps.filter(
      (p: CreateStep1) => p.token !== null
    );
    if (this.step === 2) await this.createPool();
    else this.step++;
  }

  prevStep() {
    this.step--;
  }
}
</script>

<style scoped lang="scss"></style>
