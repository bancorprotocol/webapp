<template>
  <div class="mt-3">
    <token-input-field
      label="Input"
      :token="reserveOne"
      v-model="amount1"
      @input="tokenOneChanged"
      :balance="balance1"
      :error-msg="token1Error"
    />
    <div class="text-center my-3">
      <font-awesome-icon icon="plus" class="text-primary font-size-16" />
    </div>
    <token-input-field
      label="Input"
      :token="reserveTwo"
      v-model="amount2"
      @input="tokenTwoChanged"
      class="mb-3"
      :balance="balance2"
      :error-msg="token2Error"
    />
    <rate-share-block :items="shareBlockItems" label="Prices and Pool Share" />
    <main-button
      @click="initAction"
      label="Supply"
      :active="true"
      :large="true"
      class="mt-3"
      :loading="rateLoading"
      :disabled="disableMainButton"
    />
    <modal-pool-action
      v-model="modal"
      :amounts-array="[smartTokenAmount, amount1, amount2]"
      :advanced-block-items="advancedBlockItems"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store/";
import {
  LiquidityModule,
  OpposingLiquid,
  ViewRelay,
  ViewReserve,
  ViewAmount
} from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import { namespace } from "vuex-class";
import RateShareBlock from "@/components/common/RateShareBlock.vue";
import { compareString, formatNumber, formatPercent } from "../../api/helpers";

const bancor = namespace("bancor");

@Component({
  components: {
    RateShareBlock,
    ModalPoolAction,
    LabelContentSplit,
    TokenInputField,
    PoolLogos,
    MainButton
  }
})
export default class PoolActionsAddV1 extends Vue {
  @bancor.Action
  calculateOpposingDeposit!: LiquidityModule["calculateOpposingDeposit"];
  @bancor.Action
  calculateOpposingWithdraw!: LiquidityModule["calculateOpposingWithdraw"];

  @Prop() pool!: ViewRelay;

  smartTokenAmount: string = "??.??????";
  amount1: string = "";
  amount2: string = "";
  modal = false;

  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  rateLoading = false;

  token1Error = "";
  token2Error = "";

  get disableMainButton() {
    return this.token1Error !== '' || this.token2Error !== '' || !(this.amount1 && this.amount2)
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  async initAction() {
    if (this.isAuthenticated) this.modal = true;
    //@ts-ignore
    else await this.promptAuth();
  }

  get balance1() {
    return vxm.bancor.token(this.reserveOne.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.reserveTwo.id).balance ?? "0";
  }

  get share() {
    return formatPercent(this.shareOfPool)
  }

  get shareBlockItems() {
    if (this.shareOfPool > 0) {
      return [
        ...this.singleUnitCosts,
        {
          id: "poolShare",
          title: this.share,
          label: "Share of Pool"
        }
      ];
    } else {
      return [
        ...this.singleUnitCosts,
        {
          id: "poolShare",
          label: "Share of Pool",
          title: "0%"
        }
      ];
    }
  }

  get advancedBlockItems() {
    return [
      {
        label: this.reserveOne.symbol + " Deposit",
        value: this.amount1
      },
      {
        label: this.reserveTwo.symbol + " Deposit",
        value: this.amount2
      },
      {
        label: "Rates",
        value:
          this.singleUnitCosts.length > 1
            ? `${this.singleUnitCosts[0].title} ${this.singleUnitCosts[0].label}`
            : "0"
      },
      {
        label: "",
        value:
          this.singleUnitCosts.length > 1
            ? `${this.singleUnitCosts[1].title} ${this.singleUnitCosts[1].label}`
            : "0"
      },
      {
        label: "Share of Pool",
        value: this.share
      }
    ];
  }

  get reserveOne() {
    return this.pool.reserves[0];
  }

  get reserveTwo() {
    return this.pool.reserves[1];
  }

  setDefault() {
    this.shareOfPool = 0;
    this.amount2 = "";
    this.amount1 = "";
    this.token1Error = "";
    this.token2Error = "";
  }

  async tokenOneChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === '.') {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingDeposit({
        id: this.pool.id,
        reserves: [{ id: this.reserveOne.id, amount: tokenAmount }, { id: this.reserveTwo.id, amount: this.amount2 }],
        changedReserveId: this.reserveOne.id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amount2 = results.opposingAmount;
      }

      const raiseToken1InsufficientBalance = Number(this.balance1) < Number(tokenAmount);
      console.log(this.balance1, 'is token1 balance', tokenAmount, 'is token amount', raiseToken1InsufficientBalance, 'is error flag');
      this.token1Error = raiseToken1InsufficientBalance ? "Insufficient balance" : "";

      const raiseToken2InsufficientBalance = Number(this.balance2) < Number(this.amount2);
      console.log(this.balance2, 'is token2 balance', this.amount2, 'is already set amount2', raiseToken2InsufficientBalance, 'is error flag');

      this.token2Error =
        raiseToken2InsufficientBalance ? "Insufficient balance" : "";

      this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);
    } catch (e) {
        this.token1Error = e.message;
        this.token2Error = "";
    }
    this.rateLoading = false;
  }

  setSingleUnitCosts(units: ViewAmount[]) {
    const items = units.map(unit => {
      const token = this.pool.reserves.find(reserve =>
        compareString(unit.id, reserve.id)
      )!;
      const opposingToken = this.pool.reserves.find(
        reserve => !compareString(unit.id, reserve.id)
      )!;
      return {
        id: token.id,
        title: formatNumber(Number(unit.amount)),
        label: `${opposingToken.symbol} per ${token.symbol}`
      };
    });
    this.singleUnitCosts = items;
  }

  async tokenTwoChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === '.') {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingDeposit({
        id: this.pool.id,
        reserves: [{ id: this.reserveTwo.id, amount: tokenAmount }, { id: this.reserveOne.id, amount: this.amount1 }],
        changedReserveId: this.reserveTwo.id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amount1 = results.opposingAmount;
      }
      this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);
    } catch (e) {
        this.token1Error = "";
        this.token2Error = e.message;
    }
    this.rateLoading = false;
  }

  async initialLoadPrices() {
    const results = await this.calculateOpposingDeposit({
      id: this.pool.id,
      reserves: [{ id: this.reserveOne.id, amount: this.amount1 }, { id: this.reserveTwo.id, amount: this.amount2 }],
      changedReserveId: this.reserveOne.id
    });
    this.setSingleUnitCosts(results.singleUnitCosts);
  }

  created() {
    this.initialLoadPrices();
  }
}
</script>

<style lang="scss">
.custom-control-inline {
  margin-right: 0 !important;
  margin-left: 1rem !important;
}
.custom-control-label {
  display: inline-flex !important;
  align-items: center !important;
}
</style>
