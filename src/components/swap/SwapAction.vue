<template>
  <div>
    <token-input-field
      label="From"
      :amount.sync="amount1"
      @update:amount="updatePriceReturn"
      :token="token1"
      :balance="balance1"
      :dropdown="true"
      name="token1"
      v-on:open-swap-modal="openModal"
      :error-msg="errorToken1"
    />
    <modal-swap-select name="token1" />

    <div class="text-center my-3">
      <font-awesome-icon
        icon="exchange-alt"
        rotation="90"
        @click="invertSelection"
        class="text-primary font-size-16 cursor"
      />
    </div>

    <token-input-field
      label="To (Estimated)"
      :amount.sync="amount2"
      @update:amount="sanitizeAmount"
      :token="token2"
      :balance="balance2"
      :dropdown="true"
      name="token2"
      v-on:open-swap-modal="openModal"
      :disabled="false"
    />
    <modal-swap-select name="token2" />

    <div class="my-3">
      <label-content-split label="Rate" :value="rate" class="mb-2" />

      <label-content-split
        label="Price Impact"
        :value="
          slippage !== null && slippage !== undefined
            ? numeral(this.slippage).format('0.0000%')
            : '0.00%'
        "
      />
      <label-content-split v-if="fee !== null" label="Fee" :value="fee" />
    </div>

    <main-button
      @click.native="initConvert()"
      label="Continue"
      :active="true"
      :large="true"
      :loading="rateLoading"
      :disabled="disableButton"
    />

    <modal-swap-action
      :token1="token1"
      :token2="token2"
      :amount1="amount1"
      :amount2="amount2"
      :advanced-block-items="advancedBlockItems"
    />
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import MainButton from "@/components/common/Button.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import { ViewReserve, ViewToken } from "@/types/bancor";
import ModalSwapSelect from "@/components/swap/ModalSwapSelect.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { compareString, findOrThrow } from "@/api/helpers";
import ModalSwapAction from "@/components/swap/ModalSwapAction.vue";
import numeral from "numeral"

@Component({
  components: {
    ModalSwapAction,
    LabelContentSplit,
    ModalSwapSelect,
    TokenInputField,
    MainButton
  }
})
export default class SwapAction extends Vue {
  amount1 = "";
  amount2 = "";

  token1: ViewToken = vxm.bancor.tokens[0];
  token2: ViewToken = vxm.bancor.tokens[1];

  slippage: number | null | undefined = null;
  fee: string | null = null;

  errorToken1 = "";
  errorToken2 = "";

  rateLoading = false
  initialRate = ""
  numeral = numeral;

  get rate() {
    if (this.amount1 && this.amount2) return "1 " + this.token1.symbol + " = " + (parseFloat(this.amount2) / parseFloat(this.amount1)) + " " + this.token2.symbol
    else return "1 " + this.token1.symbol + " = " + this.initialRate + " " + this.token2.symbol
  }

  get disableButton() {
    if (!this.isAuthenticated) return false
    else if (this.amount1 && this.amount2 && !this.errorToken1 && !this.errorToken2) return false
    else return true
  }

  get advancedBlockItems() {
    return [
      {
        label: "Rate",
        value: "1 " + this.token1.symbol + " = " + (parseFloat(this.amount2) / parseFloat(this.amount1)) + " " + this.token2.symbol
      },
      // {
      //   label: "Minimum Received",
      //   value: "??.??"
      // },
      {
        label: "Price Impact",
        value: this.slippage !== null && this.slippage !== undefined ? numeral(this.slippage).format('0.0000%') : '0.00%'
      },
      // {
      //   label: "Liquidity Provider Fee",
      //   value: "??.??"
      // }
    ];
  }

  openModal(name: string) {
    this.$bvModal.show(name);
  }

  sanitizeAmount(amount: string) {
    this.setDefault()
  }

  invertSelection() {
    this.$router.push({
      name: "Swap",
      query: {
        from: this.token2.id,
        to: this.token1.id
      }
    })
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  async initConvert() {
    if (this.isAuthenticated) this.$bvModal.show("modal-swap-action");
    //@ts-ignore
    else await this.promptAuth();
  }

  async updatePriceReturn(amount: string) {
    if (!amount || amount === "0") {
      this.setDefault();
      return;
    }
    try {
      this.rateLoading = true
      const reward = await vxm.bancor.getReturn({
        from: {
          id: this.token1.id,
          amount: this.amount1
        },
        toId: this.token2.id
      });
      if (reward.slippage) {
        this.slippage = reward.slippage;
      }
      if (reward.fee) {
        this.fee = reward.fee;
      }
      this.amount2 = reward.amount;
      this.errorToken1 = this.balance1 < amount ? "Token balance is currently insufficient" : "";
      this.errorToken2 = "";
    } catch (e) {
      this.errorToken1 = e.message;
      this.errorToken2 = "";
    } finally {
      this.rateLoading = false
    }
  }

  setDefault() {
    this.amount1 = "";
    this.amount2 = "";
    this.fee = this.slippage = null;
    this.errorToken2 = "";
    this.errorToken1 = "";
  }

  async updatePriceCost(amount: string) {
    if (!amount || amount === "0") {
      this.setDefault();
      return;
    }
    try {
      this.rateLoading = true
      const reward = await vxm.bancor.getCost({
        to: {
          id: this.token2.id,
          amount: this.amount2
        },
        fromId: this.token1.id
      });
      if (reward.slippage) {
        this.slippage = reward.slippage;
      }
      if (reward.fee) {
        this.fee = reward.fee;
      }
      this.amount1 = reward.amount;
      this.errorToken1 = this.balance1 < this.amount1 ? "Token balance is currently insufficient" : "";
      this.errorToken2 = "";
    } catch (e) {
      this.errorToken1 = "";
      this.errorToken2 = e.message;
    } finally {
      this.rateLoading = false
    }
  }
  get balance1() {
    return vxm.bancor.token(this.token1.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.token2.id).balance ?? "0";
  }

  // async loadBalances() {
  //   this.balance1 = vxm.bancor.token(this.token1.id).balance;
  //   this.balance2 = vxm.bancor.token(this.token2.id).balance;
  // }

  get darkMode() {
    return vxm.general.darkMode;
  }

  @Watch("$route.query")
  async onTokenChange(query: any) {
    try {
      this.token1 = await vxm.bancor.token(query.from);
    } catch (e) {
      this.token1 = vxm.bancor.tokens[0];
    }
    try {
      this.token2 = await vxm.bancor.token(query.to);
    } catch (e) {
      this.token2 = vxm.bancor.tokens[1];
    }
    await this.updatePriceReturn(this.amount1);
    //await this.loadBalances();
  }

  async created() {
    if (this.$route.query.to && this.$route.query.from)
      await this.onTokenChange(this.$route.query);
    else {
      const defaultQuery = {
        from: vxm.bancor.tokens[0].id,
        to: vxm.bancor.tokens[1].id
      }
      if (this.$route.query.from) defaultQuery.from = this.$route.query.from
      if (this.$route.query.to) defaultQuery.to = this.$route.query.to
      await this.$router.push({name: "Swap", query: defaultQuery})
    }

    this.rateLoading = true
    try {
      const reward = await vxm.bancor.getReturn({
        from: {
          id: this.token1.id,
          amount: "1"
        },
        toId: this.token2.id
      });
      this.initialRate = reward.amount
    } catch (e) {
      // n
    }
    this.rateLoading = false;

    //await this.loadBalances();
  }
}
</script>

<style scoped lang="scss"></style>
