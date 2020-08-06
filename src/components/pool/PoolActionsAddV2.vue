<template>
  <div>
    <label-content-split label="Pool" class="my-4">
      <pool-logos
        @click.native="$bvModal.show('modal-join-pool')"
        :pool="pool"
        :dropdown="true"
      />
    </label-content-split>

    <label-content-split label="Select a Token" class="mb-3">
      <b-form-group class="m-0" :class="darkMode ? 'text-dark' : 'text-light'">
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
              <span class="font-w600 font-size-14">{{ reserve.symbol }}</span>
            </div>
          </b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </label-content-split>

    <token-input-field
      label="Input"
      :token="selectedToken"
      :amount.sync="amount"
      @update:amount="loadPrices(amount)"
      :balance="balance"
      class="mb-3"
      :error-msg="balanceError"
    />

    <rate-share-block :items="shareBlockItems" label="Prices and Pool Share" />

    <main-button
      @click.native="initAction"
      label="Supply"
      :active="true"
      :large="true"
      class="mt-3"
      :disabled="!amount || balanceError !== ''"
      :loading="rateLoading"
    />
    <modal-pool-action
      :selected-token="selectedToken"
      :amounts-array="[amountSmartToken, amount]"
      :advanced-block-items="advancedBlockItems"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import {
  LiquidityModule,
  ViewAmount,
  ViewRelay,
  ViewReserve
} from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import TokenInputField from "@/components/common-v2/TokenInputField.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common-v2/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import RateShareBlock from "@/components/common-v2/RateShareBlock.vue";
import { compareString, formatNumber } from "@/api/helpers";
import { namespace } from "vuex-class";
import numeral from "numeral";

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
export default class PoolActionsAddV2 extends Vue {
  @bancor.Action
  calculateOpposingDeposit!: LiquidityModule["calculateOpposingDeposit"];

  @Prop() pool!: ViewRelay;

  selectedToken: ViewReserve = this.pool.reserves[0];
  amount: string = "";
  amountSmartToken: string = "??.????";

  rateLoading = false;
  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  errorMsg = ""

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  async initAction() {
    if (this.isAuthenticated) this.$bvModal.show("modal-pool-action");
    //@ts-ignore
    else await this.promptAuth();
  }

  get balanceError() {
    if (!this.isAuthenticated) return ""
    else if (this.amount === "") return ""
    else if (this.errorMsg !== "") return this.errorMsg
    else if (this.balance < this.amount) return "Insufficient balance"
    else return ""
  }

  get balance() {
    return vxm.bancor.token(this.selectedToken.id).balance ?? "0";
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

  async loadPrices(amount: string) {
    this.errorMsg = ""
    try {
      const results = await this.calculateOpposingDeposit({
        id: this.pool.id,
        reserve: { id: this.selectedToken.id, amount: amount ? amount : "0" }
      });
      if (amount !== "0" && amount !== "") this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);
    } catch (e) {
      this.errorMsg = e.message
    }
  }

  get advancedBlockItems() {
    return [
      {
        label: this.selectedToken.symbol + " Deposit",
        value: this.amount
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
        value: `${formatNumber(this.shareOfPool)}%`
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  async loadData() {
    // this.balance = vxm.bancor.token(this.selectedToken.id).balance;
    await this.loadPrices("0");
  }

  @Watch("pool")
  async updateSelection(pool: ViewRelay) {
    if (pool.reserves[0] === this.selectedToken) return;
    this.selectedToken = pool.reserves[0];
    await this.loadData();
  }

  @Watch("selectedToken")
  async onTokenChange() {
    await this.loadData();
  }

  async created() {
    await this.loadData();
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
