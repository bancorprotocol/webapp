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

    <div
      class="w-100 mt-1 font-size-14"
      @click="clickAlert"
      :class="darkMode ? 'alert-warning-dark' : 'alert-warning-light'"
    >
      <span class="font-w500">
        This pools runs on an older version of Bancor.
        <a @click.prevent="clickAlert" href="#">Click here</a> to stake
        liquidity in the new v2.1 {{ poolLabel }} pool.
      </span>
    </div>

    <label-content-split label="Select a Token" class="my-3">
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
      v-model="amount"
      @input="loadPrices(amount)"
      :balance="balance"
      class="mb-3"
      :error-msg="balanceError"
    />

    <rate-share-block :items="shareBlockItems" label="Prices and Pool Share" />

    <main-button
      :label="supplyButtonLabel"
      @click="initAction"
      :active="true"
      :large="true"
      class="mt-3"
      :disabled="!amount || balanceError !== ''"
      :loading="rateLoading"
    />
    <modal-pool-action
      v-model="modal"
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
import TokenInputField from "@/components/common/TokenInputField.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import RateShareBlock from "@/components/common/RateShareBlock.vue";
import { compareString, formatNumber, formatPercent } from "@/api/helpers";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";

@Component({
  components: {
    AlertBlock,
    RateShareBlock,
    ModalPoolAction,
    LabelContentSplit,
    ModalPoolSelect,
    TokenInputField,
    PoolLogos,
    MainButton
  }
})
export default class PoolActionsAddV2 extends Vue {
  @Prop() pool!: ViewRelay;

  selectedToken: ViewReserve = this.pool.reserves[0];
  amount: string = "";
  amountSmartToken: string = "??.????";
  modal = false;
  poolSelectModal = false;

  rateLoading = false;
  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  errorMsg = "";

  select(id: string) {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: "add",
        account: id
      }
    });
  }

  poolLogosClick() {
    this.poolSelectModal = true;
  }

  get pools() {
    return vxm.bancor.relays.filter(x => x.v2);
  }

  get supplyButtonLabel() {
    if (this.amount === "") return "Enter an amount";
    else return "Supply";
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  async initAction() {
    if (this.isAuthenticated) this.modal = true;
    //@ts-ignore
    else await this.promptAuth();
  }

  get balanceError() {
    const balanceError = Number(this.balance) < Number(this.amount);
    console.log(
      this.balance,
      "was balance",
      this.amount,
      "was amount",
      balanceError,
      "was balance error"
    );
    if (!this.isAuthenticated) return "";
    else if (this.amount === "") return "";
    else if (this.errorMsg !== "") return this.errorMsg;
    else if (balanceError) return "Insufficient balance";
    else return "";
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
          title: formatPercent(this.shareOfPool),
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

  get isLinkPool() {
    const selectedPool = this.pool;
    return selectedPool.reserves.some(reserve =>
      compareString(reserve.symbol, "LINK")
    );
  }

  get poolLabel() {
    return this.isLinkPool ? "LINK" : "REN";
  }

  clickAlert() {
    const poolDestinationId = this.isLinkPool
      ? "0x04D0231162b4784b706908c787CE32bD075db9b7"
      : "0x6b181C478b315bE3f9E99c57CE926436c32e17a7";
    this.$router.push({
      name: "AddProtectionSingle",
      params: { id: poolDestinationId }
    });
  }

  async loadPrices(amount: string) {
    if (amount === ".") return;
    this.errorMsg = "";
    try {
      const results = await vxm.bancor.calculateOpposingDeposit({
        id: this.pool.id,
        reserves: [
          { id: this.selectedToken.id, amount: amount ? amount : "0" }
        ],
        changedReserveId: this.selectedToken.id
      });
      if (amount !== "0" && amount !== "")
        this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);
    } catch (e) {
      this.errorMsg = e.message;
    }
  }

  get advancedBlockItems() {
    return [
      {
        label: this.selectedToken.symbol + " Deposit",
        value: Number(this.amount)
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
        value: formatPercent(this.shareOfPool)
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
