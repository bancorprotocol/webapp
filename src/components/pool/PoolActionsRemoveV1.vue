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
        <span> (??.??????) <span>(~??.??)</span> </span>
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
        <span> (??.??????) <span>(~$??.??)</span></span>
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
        v-model="amountToken1"
        @input="tokenOneChanged"
        :balance="balance1"
        :error-msg="token1Error"
        class="ml-3"
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
        v-model="amountToken2"
        @input="tokenTwoChanged"
        class="ml-3 mb-3"
        :balance="balance2"
        :error-msg="token2Error"
      />
    </div>

    <b-row>
      <b-col cols="6" class="pr-1">
        <main-button
          label="Approve"
          :active="true"
          :large="true"
          class="mt-3"
          :loading="rateLoading"
          :disabled="disableApproveButton"
        />
      </b-col>
      <b-col cols="6" class="pr-1">
        <main-button
          label="Remove"
          :active="true"
          :large="true"
          class="mt-3"
          :loading="rateLoading"
          :disabled="disableRemoveButton"
        />
      </b-col>
    </b-row>

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
  LiquidityModule,
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
import { namespace } from "vuex-class";

const bancor = namespace("bancor");

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
  @bancor.Action
  calculateOpposingWithdraw!: LiquidityModule["calculateOpposingWithdraw"];
  @bancor.Action
  getUserBalances!: LiquidityModule["getUserBalances"];
  
  @Prop() pool!: ViewRelay;

  errorMsg = ""

  amountToken1: string = "";
  amountToken2: string = "";
  modal = false;

  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  rateLoading = false;

  token1Error = "";
  token2Error = "";
  balance1 = "";
  balance2 = "";

  res: any = null;

  poolSelectModal = false;

  percentage: string = "50";
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
      !(this.amountToken1 && this.amountToken2)
    );
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  get reserveOne() {
    return this.pool.reserves[0];
  }

  get reserveTwo() {
    return this.pool.reserves[1];
  }

  setDefault() {
    this.amountToken1 = "";
    this.amountToken2 = "";
    this.token1Error = "";
    this.token2Error = "";
  }

  async tokenInputChanged(tokenAmount: string) {

  }

  async tokenOneChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === "0" || tokenAmount === ".") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingWithdraw({
        id: this.pool.id,
        reserves: [
          { id: this.pool.reserves[0].id, amount: tokenAmount },
          { id: this.pool.reserves[1].id, amount: this.amountToken2 }
        ],
        changedReserveId: this.pool.reserves[0].id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amountToken2 = results.opposingAmount;
      }
      this.token1Error =
        this.balance1 < tokenAmount ? "Insufficient balance" : "";
      this.token2Error =
        this.balance2 < this.amountToken2 ? "Insufficient balance" : "";
    } catch (e) {
      this.token1Error = e.message;
      this.token2Error = "";
    }
    this.rateLoading = false;
  }

  async tokenTwoChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === "0" || tokenAmount === ".") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingWithdraw({
        id: this.pool.id,
        reserves: [
          { id: this.pool.reserves[0].id, amount: this.amountToken1 },
          { id: this.pool.reserves[1].id, amount: tokenAmount }
        ],
        changedReserveId: this.pool.reserves[1].id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amountToken1 = results.opposingAmount;
      }
      this.token1Error =
        this.balance1 < this.amountToken1
          ? "Token balance is currently insufficient"
          : "";
      this.token2Error =
        this.balance2 < tokenAmount
          ? "Token balance is currently insufficient"
          : "";
    } catch (e) {
      this.token2Error = e.message;
      this.token1Error = "";
    }
    this.rateLoading = false;
  }

  async fetchBalances() {
    if (!this.isAuthenticated) return;
    const res = await this.getUserBalances(this.pool.id);
    if (this.pool.reserves[0].id === res.maxWithdrawals[0].id) {
      this.balance1 = res.maxWithdrawals[0].amount;
      this.balance2 = res.maxWithdrawals[1].amount;
    } else {
      this.balance1 = res.maxWithdrawals[1].amount;
      this.balance2 = res.maxWithdrawals[0].amount;
    }
    this.res = res.maxWithdrawals;
  }

  created () {
    this.fetchBalances();
  }
}
</script>

<style lang="scss">
</style>
