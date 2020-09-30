<template>
  <div>
    <label-content-split label="Selected Pool" class="my-3">
      <pool-logos @click="poolLogosClick" :pool="pool" :dropdown="true" />
      <modal-pool-select
        v-model="poolSelectModal"
        :pools="pools"
        @select="select"
      />
    </label-content-split>

    <percentage-slider
      label="AMOUNT"
      class="mt-3"
      v-model="percentage"
      @input="percentageUpdate"
      :show-buttons="true"
      :buttons-dirty="percentageDirty"
    />

    <div v-if="!detailMode">
      <div class="text-center my-3">
        <font-awesome-icon
          icon="long-arrow-alt-down"
          class="text-primary font-size-16"
        />
      </div>

      <div
        class="block-content d-flex justify-content-between align-items-center font-size-14 font-w600 pt-2"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        <span> {{ smartTokenAmount }} <span>(~??.??)</span> </span>
        <div class="d-flex align-items-center">
          <img
            :src="pool.reserves[0].logo"
            class="img-avatar img-avatar20"
            alt="Token Logo"
          />
          <span class="ml-2">{{ pool.reserves[0].symbol }}</span>
        </div>
      </div>

      <div
        class="block-content d-flex justify-content-between align-items-center font-size-14 font-w600 py-2"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        <span> {{ smartTokenAmount }} <span>(~$??.??)</span></span>
        <div class="d-flex align-items-center">
          <img
            :src="pool.reserves[1].logo"
            class="img-avatar img-avatar20"
            alt="Token Logo"
          />
          <span class="ml-2">{{ pool.reserves[1].symbol }}</span>
        </div>
      </div>
    </div>

    <div v-else>
      <token-input-field
        label="Input"
        v-model="amountSmartToken"
        @input="tokenInputChanged"
        :pool="pool"
        class="mt-4"
      />

      <div class="text-center my-3">
        <font-awesome-icon
          icon="long-arrow-alt-down"
          class="text-primary font-size-16"
        />
      </div>

      <token-input-field
        label="Output"
        :token="reserveOne"
        v-model="amount1"
        @input="tokenOneChanged"
        :balance="balance1"
        :error-msg="token1Error"
        class="ml-2"
      />

      <div class="text-center my-3">
        <font-awesome-icon 
          icon="plus" 
          class="text-primary font-size-16"
        />
      </div>

      <token-input-field
        label="Output"
        :token="reserveTwo"
        v-model="amount2"
        @input="tokenTwoChanged"
        class="ml-2 mb-3"
        :balance="balance2"
        :error-msg="token2Error"
      />
    </div>

    <div class="row">
      <div class="col-6">
        <main-button
          label="Approve"
          :active="true"
          :large="true"
          class="mt-3"
          :loading="rateLoading"
          :disabled="disableApproveButton"
        />
      </div>
      <div class="col-6">
        <main-button
          label="Remove"
          :active="true"
          :large="true"
          class="mt-3"
          :loading="rateLoading"
          :disabled="disableRemoveButton"
        />
      </div>
    </div>

    <modal-pool-action
      v-model="modal"
      :selected-token="selectedToken"
      :amounts-array="[amountSmartToken, amount]"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { 
  ViewRelay, 
  ViewAmount,
  ViewReserve
} from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import BigNumber from "bignumber.js";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import { compareString, formatNumber, formatPercent } from "../../api/helpers";

interface PoolTokenUI {
  disabled: boolean;
  balance: string;
  id: string;
  symbol: string;
  logo: string[];
}

@Component({
  components: {
    ModalPoolAction,
    LabelContentSplit,
    TokenInputField,
    PoolLogos,
    MainButton,
    PercentageSlider
  }
})
export default class PoolActionsRemoveV1 extends Vue {
  
  @Prop() pool!: ViewRelay;

  errorMsg = ""

  smartTokenAmount: string = "??.??????";
  amount1: string = "";
  amount2: string = "";
  amount: string = "";
  modal = false;

  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  rateLoading = false;

  token1Error = "";
  token2Error = "";

  poolSelectModal = false;

  percentage: string = "50";
  exitFee = 0;
  percentageDirty: boolean = false;

  selectedToken: string = "";

  amountSmartToken = "";

  poolTokens: PoolTokenUI[] = [];
  insufficientBalance: boolean = false;

  poolLogosClick() {
    this.poolSelectModal = true;
  }

  select(id: string) {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: "add",
        account: id
      }
    });
  }

  percentageUpdate(percent: string) {
    this.insufficientBalance = false;
    this.percentageDirty = true;
    const decPercent = Number(percent) / 100;
    if (decPercent === 1)
      this.amountSmartToken = this.selectedPoolToken.balance;

    const BN = BigNumber.clone({ DECIMAL_PLACES: 18, EXPONENTIAL_AT: 256 });
    const poolTokenAmount = new BN(this.selectedPoolToken.balance)
      .times(decPercent)
      .toString();

    this.amountSmartToken = poolTokenAmount;
  }

  get selectedPoolToken() {
    const selectedToken = this.poolTokens.find(
      token => token.id == this.selectedToken
    );
    return selectedToken!;
  }

  get pools() {
    return vxm.bancor.relays.filter(x => x.v2)
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get detailMode() {
    return vxm.general.detailMode;
  }

  get disableApproveButton() {
    return (
      this.token1Error !== "" ||
      this.token2Error !== "" 
    );
  }

  get disableRemoveButton() {
    return (
      this.token1Error !== "" ||
      this.token2Error !== "" ||
      !(this.amount1 && this.amount2)
    );
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  get balance1() {
    return vxm.bancor.token(this.reserveOne.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.reserveTwo.id).balance ?? "0";
  }

  get reserveOne() {
    return this.pool.reserves[0];
  }

  get reserveTwo() {
    return this.pool.reserves[1];
  }

  async tokenInputChanged(tokenAmount: string) {

  }
}
</script>

<style lang="scss">
</style>
