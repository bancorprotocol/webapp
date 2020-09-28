<template>
  <div>
    <content-block :shadow="true" class="mb-4">
      <template slot="header">
        <pool-actions-header title="Add Liquidity Protection" @back="back" />
      </template>

      <div class="mt-3">
        <label-content-split label="Selected Pool">
          <pool-logos :pool="pool" :dropdown="false" :cursor="false" />
        </label-content-split>

        <alert-block
          variant="warning"
          title="Important warning before you add an insurance."
          msg="By adding pool token insurance you ensure ... placeholder text."
          class="my-3"
        />

        <label-content-split label="Exposure">
          <b-form-group
            class="m-0"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            <b-form-radio-group
              id="radio-group"
              v-model="selectedToken"
              name="radio-component"
            >
              <b-form-radio
                v-for="reserve in pool.reserves"
                :name="reserve.symbol"
                :value="reserve"
                :key="reserve.id"
              >
                <div class="d-flex align-items-center">
                  <img
                    class="img-avatar img-avatar20 mr-1"
                    :src="reserve.logo"
                    alt="Token Logo"
                  />
                  <span class="font-w600 font-size-14">{{
                    reserve.symbol
                  }}</span>
                </div>
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </label-content-split>

        <token-input-field
          label="Input"
          :token="selectedToken"
          v-model="amount"
          :balance="balance"
          class="my-3"
          :error-msg="balanceError"
        />

        <label-content-split
          label="Full Coverage Date"
          :value="fullCoverageDate"
        />

        <main-button
          @click="modal = true"
          label="Add Protection"
          :active="amount"
          class="mt-3"
          :large="true"
          :disabled="!amount"
        />
      </div>
    </content-block>

    <protectable-liquidity />

    <modal-base
      title="You are adding liquidity protection"
      v-model="modal"
      @input="setDefault"
    >
      <b-row v-if="!(txBusy || success || error)">
        <b-col cols="12" class="text-center mb-3">
          <span
            class="font-size-24 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            ????/????
          </span>
        </b-col>
        <b-col cols="12">
          <gray-border-block>
            <label-content-split label="???" value="????" />
            <label-content-split label="???" value="????" />
            <label-content-split label="???" value="????" />
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
import {Component, Vue, Watch} from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolActionsHeader from "@/components/pool/PoolActionsHeader.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import {Step, TxResponse, ViewRelay, ViewReserve} from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BancorCheckbox from "@/components/common/BancorCheckbox.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import AdvancedBlockItem from "@/components/common/AdvancedBlockItem.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import BigNumber from "bignumber.js";
import ProtectableLiquidity from "@/components/pool/protection/ProtectableLiquidity.vue";
import moment from 'moment'

@Component({
  components: {
    ProtectableLiquidity,
    PoolLogos,
    TokenInputField,
    AdvancedBlockItem,
    GrayBorderBlock,
    AlertBlock,
    ModalBase,
    BancorCheckbox,
    ActionModalStatus,
    LabelContentSplit,
    PoolActionsHeader,
    ContentBlock,
    MainButton
  }
})
export default class AddLiqProtection extends Vue {
  amount = "";

  selectedToken: ViewReserve | null = null;

  modal = false;

  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

  get fullCoverageDate() {
    const waitTime = moment.duration(vxm.ethBancor.liquidityProtectionSettings.maxDelay, 'seconds');
    return moment().add(waitTime).format("DD/MM/YY")
  }


  get pool(): ViewRelay {
    return vxm.bancor.relay(this.$route.params.id);
  }

  get balance() {
    if (this.selectedToken !== null)
      return vxm.bancor.token(this.selectedToken.id).balance ?? "0";
    else return "0";
  }

  get balanceError() {
    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance);
    if (amountNumber.gt(balanceNumber))
      return "Insufficient balance";
    else return "";
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

  get currentStatus() {
    if (this.sections.length) {
      return this.sections[this.stepIndex].description;
    }
    return undefined;
  }

  onUpdate(index: number, steps: any[]) {
    this.sections = steps;
    this.stepIndex = index;
  }

  back() {
    this.$router.push({ name: "LiqProtection" });
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = null;
  }

  @Watch('pool')
  onPoolChange() {
    this.selectedToken = this.pool.reserves[0];
    this.amount = "";
  }

  mounted() {
    this.selectedToken = this.pool.reserves[0]
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
