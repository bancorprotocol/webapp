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

    <modal-base
      :title="$t('you_create_Pool')"
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
              :label="`${item.token.symbol} ${$t('ratio')}`"
              :value="`${item.percentage}%`"
            />
            <label-content-split
              :label="$t('fee')"
              :value="`${stepTwoProps.poolFee}%`"
            />
            <label-content-split
              :label="$t('pool_name')"
              :value="stepTwoProps.poolName"
            />
            <label-content-split
              :label="$t('token_symbol')"
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
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ContentBlock from "@/components/common/ContentBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import CreateV1Step1 from "@/components/pool/create/CreateV1Step1.vue";
import CreateV1Step2 from "@/components/pool/create/CreateV1Step2.vue";
import MainButton from "@/components/common/Button.vue";
import { Step, TxResponse, ViewToken } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BancorCheckbox from "@/components/common/BancorCheckbox.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import { compareString } from "@/api/helpers";
import AlertBlock from "@/components/common/AlertBlock.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import AdvancedBlockItem from "@/components/common/AdvancedBlockItem.vue";
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";

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
    ContentBlock,
    CreateV1Step1,
    CreateV1Step2,
    MainButton
  }
})
export default class CreateHomeNew extends BaseComponent {
  version: 1 | 2 = 1;
  step = 1;
  modal = false;

  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

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

  get modalConfirmButton() {
    return this.error
      ? i18n.t("try_again")
      : this.success
      ? i18n.t("close")
      : this.txBusy
      ? `${i18n.t("processing")}...`
      : i18n.t("confirm");
  }

  get stepsConfirmError() {
    if (this.selectedTokens.length <= 1) return false;
    else if (this.step === 1 && this.errorStep1) return false;
    else if (this.step === 2 && this.errorStep2) return false;
    else return true;
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
    return this.totalPercentage > 100 ? i18n.t("max_reserve") : "";
  }

  get totalPercentage() {
    return this.stepOneProps.reduce(
      (sum, item) => (item.token ? sum + parseInt(item.percentage) : sum),
      0
    );
  }

  get currentStatus() {
    if (this.sections.length) {
      return this.sections[this.stepIndex].description;
    }
    return undefined;
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

    const existingPool = relays.find(relay =>
      suggestion.every(reserve => {
        const matchingReserve = relay.reserves.find(r =>
          compareString(reserve.tokenId, r.id)
        );
        return (
          matchingReserve &&
          Number(matchingReserve.reserveWeight) ==
            Number(reserve.decReserveWeight)
        );
      })
    );
    return !!existingPool;
  }

  async createPool() {
    if (this.success) {
      this.modal = false;
      const poolId = this.newPoolId;
      this.$router.push({
        name: "PoolAction",
        params: {
          poolAction: "add",
          account: poolId
        }
      });
      this.setDefault();
      return;
    }

    if (this.error) {
      this.setDefault();
      return;
    }

    this.setDefault();

    const tokens = this.tokenIdArray;

    this.txBusy = true;

    const percentFee = this.stepTwoProps.poolFee;
    const decFee = new BigNumber(percentFee).div(100).toString();

    try {
      const success = await vxm.ethBancor.createV1Pool({
        onUpdate: this.onUpdate,
        reserves: tokens,
        poolName: this.stepTwoProps.poolName,
        poolSymbol: this.stepTwoProps.poolSymbol,
        decimals: this.stepTwoProps.poolDecimals,
        decFee
      });
      this.success = success;
      this.newPoolId = success.poolId;
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

  async nextStep() {
    if (!this.currentUser) {
      //@ts-ignore
      await this.promptAuth();
      return;
    }
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
    this.newPoolId = "";
  }
}
</script>

<style scoped lang="scss"></style>
