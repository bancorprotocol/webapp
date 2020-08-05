<template>
  <div class="mt-3">
    <token-input-field
      label="Input"
      :token="pool.reserves[0]"
      :amount.sync="amount1"
      @update:amount="tokenOneChanged"
      :balance="balance1"
      :error-msg="token1Error"
    />
    <div class="text-center my-3">
      <font-awesome-icon icon="plus" class="text-primary font-size-16" />
    </div>
    <token-input-field
      label="Input"
      :token="pool.reserves[1]"
      :amount.sync="amount2"
      class="mb-3"
      @update:amount="tokenTwoChanged"
      :balance="balance2"
      :error-msg="token2Error"
    />
    <rate-share-block :items="shareBlockItems" label="Prices and Pool Share" />
    <main-button
      @click.native="initAction"
      label="Supply"
      :active="true"
      :large="true"
      class="mt-3"
      :loading="rateLoading"
      :disabled="
        token1Error !== '' || token2Error !== '' || !(amount1 && amount2)
      "
    />
    <modal-pool-action
      :amounts-array="[smartTokenAmount, amount1, amount2]"
      :advanced-block-items="advancedBlockItems"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import {
  LiquidityModule,
  OpposingLiquid,
  ViewRelay,
  ViewReserve,
  ViewAmount
} from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import TokenInputField from "@/components/common-v2/TokenInputField.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common-v2/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import { namespace } from "vuex-class";
import RateShareBlock from "@/components/common-v2/RateShareBlock.vue";
import numeral from "numeral";
import { compareString, formatNumber } from "../../api/helpers";

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

  // balanceToken1: string = "";
  // balanceToken2: string = "";

  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  rateLoading = false;

  token1Error = "";
  token2Error = "";

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  async initAction() {
    if (this.isAuthenticated) this.$bvModal.show("modal-pool-action");
    //@ts-ignore
    else await this.promptAuth();
  }

  get balance1() {
    return vxm.bancor.token(this.pool.reserves[0].id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.pool.reserves[1].id).balance ?? "0";
  }

  get share() {
    if (this.shareOfPool === 0) return "0";
    else {
      const share = this.shareOfPool;
      if (share < 0.00001) return "< 0.00001";
      else if (share < 1) return numeral(share).format("0.00000");
      else return numeral(share).format("0.00");
    }
  }

  get shareBlockItems() {
    if (this.shareOfPool > 0) {
      return [
        ...this.singleUnitCosts,
        {
          id: "poolShare",
          title: `${formatNumber(this.shareOfPool)}%`,
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
        label: this.pool.reserves[0].symbol + " Deposit",
        value: this.amount1
      },
      {
        label: this.pool.reserves[1].symbol + " Deposit",
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
        value: this.share + "%"
      }
    ];
  }

  setDefault() {
    this.shareOfPool = 0;
    this.amount2 = "";
    this.amount1 = "";
    this.token1Error = "";
    this.token2Error = "";
  }

  async tokenOneChanged(tokenAmount: string) {
    if (tokenAmount === "") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingDeposit({
        id: this.pool.id,
        reserve: { id: this.pool.reserves[0].id, amount: this.amount1 }
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amount2 = results.opposingAmount;
      }
      this.token1Error = this.balance1 < tokenAmount ? "Insufficient balance" : "";
      this.token2Error = this.balance2 < this.amount2 ? "Insufficient balance" : "";
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
    if (tokenAmount === "") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await this.calculateOpposingDeposit({
        id: this.pool.id,
        reserve: { id: this.pool.reserves[1].id, amount: this.amount2 }
      });
      console.log(results, "are the results");
      if (typeof results.opposingAmount !== "undefined") {
        this.amount1 = results.opposingAmount;
      }
      this.token1Error = this.balance1 < this.amount1 ? "Token balance is currently insufficient" : "";
      this.token2Error = this.balance2 < tokenAmount ? "Token balance is currently insufficient" : "";
      this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);
    } catch (e) {
      this.token1Error = "";
      this.token2Error = e.message;
    }
    this.rateLoading = false;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  async initialLoadPrices() {
    const results = await this.calculateOpposingDeposit({
      id: this.pool.id,
      reserve: { id: this.pool.reserves[1].id, amount: this.amount2 }
    });
    this.setSingleUnitCosts(results.singleUnitCosts);
  }

  // async loadBalances() {
  //   this.balanceToken1 = vxm.bancor.token(this.pool.reserves[0].id).balance;
  //   this.balanceToken2 = vxm.bancor.token(this.pool.reserves[1].id).balance;
  // }

  created() {
    this.initialLoadPrices();
    //this.loadBalances();
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
