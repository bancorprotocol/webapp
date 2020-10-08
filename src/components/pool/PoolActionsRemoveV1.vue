<template>
  <div>
    <div v-if="!detailMode" class="text-center my-3">
      <font-awesome-icon
        icon="long-arrow-alt-down"
        class="text-primary font-size-16"
      />
    </div>

    <div
      v-if="!detailMode"
      class="block block-rounded block-bordered mb-4"
      :class="darkMode ? 'block-light-blue-dark' : 'block-light-blue-light'"
    >
      <div
        v-if="!detailMode"
        class="block-content d-flex justify-content-between align-items-center font-size-14 font-w600 pt-2"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        <span>?????.??????? <span>(~$??.??)</span></span>
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
        v-if="!detailMode"
        class="block-content d-flex justify-content-between align-items-center font-size-14 font-w600 py-2"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        <span>?????.??????? <span>(~$??.??)</span></span>
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
        v-if="!detailMode"
        label="Input"
        v-model="amountSmartToken"
        :pool="pool"
        class="mt-4"
      />

      <div v-if="!detailMode" class="text-center my-3">
        <font-awesome-icon
          icon="long-arrow-alt-down"
          class="text-primary font-size-16"
        />
      </div>
      <token-input-field
        label="Output"
        v-model="amountToken1"
        @input="tokenOneChanged"
        :token="pool.reserves[0]"
        class="my-3"
        :balance="balance1"
        :error-msg="token1Error"
      />

      <div class="text-center my-3">
        <font-awesome-icon icon="plus" class="text-primary font-size-16" />
      </div>
      <token-input-field
        label="Output"
        v-model="amountToken2"
        @input="tokenTwoChanged"
        :token="pool.reserves[1]"
        :balance="balance2"
        :error-msg="token2Error"
        class="mb-4"
      />
    </div>

    <!--    // missing data-->
    <label-content-split
      v-if="false"
      label="Price"
      :value="
        `1 ${pool.reserves[1].symbol} = ${rate} ${pool.reserves[0].symbol}`
      "
      class="my-3"
    />

    <main-button
      @click="initAction"
      label="Remove"
      :active="true"
      :large="true"
      class="mt-1"
      :disabled="
        token1Error !== '' ||
          token2Error !== '' ||
          !(amountToken1 && amountToken2)
      "
    />

    <modal-pool-action
      v-model="modal"
      :amounts-array="[amountSmartToken, amountToken1, amountToken2]"
      :advanced-block-items="advancedBlockItems"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";

@Component({
  components: {
    ModalPoolAction,
    LabelContentSplit,
    TokenInputField,
    PoolLogos,
    MainButton
  }
})
export default class PoolActionsRemoveV1 extends Vue {
  @Prop() pool!: ViewRelay;

  detailMode = false;

  rateLoading = false;

  // selectedToken: ViewReserve = this.pool.reserves[0];
  percentage: string = "50";
  rate = "??????.?????";

  amountSmartToken = "";
  amountToken1 = "";
  amountToken2 = "";

  token1Error = "";
  token2Error = "";
  balance1 = "";
  balance2 = "";
  modal = false;

  res: any = null;

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  async initAction() {
    if (this.isAuthenticated) this.modal = true;
    //@ts-ignore
    else await this.promptAuth();
  }

  get advancedBlockItems() {
    return [
      // {
      //   label: "UNI Burned",
      //   value: "????"
      // },
      // {
      //   label: "Price",
      //   value: "????"
      // },
      // {
      //   label: "",
      //   value: "??.??"
      // }
    ];
  }

  setDefault() {
    this.amountToken1 = "";
    this.amountToken2 = "";
    this.token1Error = "";
    this.token2Error = "";
  }

  async tokenOneChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === "0" || tokenAmount === ".") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await vxm.bancor.calculateOpposingWithdraw({
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
      const results = await vxm.bancor.calculateOpposingWithdraw({
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

  get darkMode() {
    return vxm.general.darkMode;
  }

  @Watch("isAuthenticated")
  async onAuthChange(auth: boolean) {
    await this.fetchBalances();
  }

  async fetchBalances() {
    if (!this.isAuthenticated) return;
    const res = await vxm.bancor.getUserBalances(this.pool.id);
    if (this.pool.reserves[0].id === res.maxWithdrawals[0].id) {
      this.balance1 = res.maxWithdrawals[0].amount;
      this.balance2 = res.maxWithdrawals[1].amount;
    } else {
      this.balance1 = res.maxWithdrawals[1].amount;
      this.balance2 = res.maxWithdrawals[0].amount;
    }
    this.res = res.maxWithdrawals;
  }

  created() {
    this.fetchBalances();
  }
  // @Watch("pool")
  // async updateSelection(pool: ViewRelay) {
  //   if (pool.reserves[0] === this.selectedToken) return;
  //   this.selectedToken = pool.reserves[0];
  // }
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
