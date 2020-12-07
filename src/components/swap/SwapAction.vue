<template>
  <div>
    <token-input-field
      label="From"
      v-model="amount1"
      @input="updatePriceReturn"
      @select="selectFromToken"
      :token="token1"
      :balance="balance1"
      :error-msg="errorToken1"
      :tokens="tokens"
    />

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
      v-model="amount2"
      @input="sanitizeAmount"
      @select="selectToToken"
      :token="token2"
      :balance="balance2"
      :dropdown="true"
      :disabled="false"
      :tokens="tokens"
    />

    <div class="my-3">
      <div class="mb-3">
        <label-content-split :label="advancedOpen ? 'Slippage Tolerance' : ''">
          <span
            @click="advancedOpen = !advancedOpen"
            class="text-primary font-size-12 font-w500 cursor"
          >
            Advanced settings
            <font-awesome-icon
              :icon="advancedOpen ? 'caret-up' : 'caret-down'"
            />
          </span>
        </label-content-split>
        <b-collapse id="advanced-swap" v-model="advancedOpen">
          <slippage-tolerance />
        </b-collapse>
      </div>

      <label-content-split
        label="Rate"
        :value="rate"
        :loading="rateLoading"
        class="mb-2"
      />
      <label-content-split
        label="Price Impact"
        :isAlert="overSlippageLimit"
        :value="
          slippage !== null && slippage !== undefined
            ? numeral(this.slippage).format('0.0000%')
            : '0.0000%'
        "
      />
      <label-content-split v-if="fee !== null" label="Fee" :value="fee" />
    </div>

    <main-button
      :label="swapButtonLabel"
      @click="initConvert"
      :active="true"
      :large="true"
      :loading="rateLoading"
      :disabled="disableButton"
    />

    <modal-swap-action
      v-model="modal"
      :token1="token1"
      :token2="token2"
      :amount1="amount1"
      :amount2="amount2"
      :advanced-block-items="advancedBlockItems"
    />
  </div>
</template>

<script lang="ts">
import { Watch, Component } from "vue-property-decorator";
import { vxm } from "@/store";
import MainButton from "@/components/common/Button.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import { ViewToken } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalSwapAction from "@/components/swap/ModalSwapAction.vue";
import numeral from "numeral";
import { formatNumber } from "@/api/helpers";
import SlippageTolerance from "@/components/common/SlippageTolerance.vue";
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    SlippageTolerance,
    ModalSwapAction,
    LabelContentSplit,
    TokenInputField,
    MainButton
  }
})
export default class SwapAction extends BaseComponent {
  amount1 = "";
  amount2 = "";

  token1: ViewToken = vxm.bancor.tokens[0];
  token2: ViewToken = vxm.bancor.tokens[1];

  slippage: number | null | undefined = null;
  fee: string | null = null;

  errorToken1 = "";
  errorToken2 = "";

  rateLoading = false;
  initialRate = "";
  numeral = numeral;

  modal = false;
  advancedOpen = false;

  get tokens() {
    return vxm.bancor.tokens;
  }

  get rate() {
    let rate = "";
    if (this.amount1 && this.amount2)
      rate = formatNumber(
        parseFloat(this.amount2) / parseFloat(this.amount1),
        9
      );
    else rate = formatNumber(parseFloat(this.initialRate), 9);
    return "1 " + this.token1.symbol + " = " + rate + " " + this.token2.symbol;
  }

  get disableButton() {
    if (!this.currentUser && this.amount1) return false;
    else if (
      this.amount1 &&
      this.amount2 &&
      !this.errorToken1 &&
      !this.errorToken2
    )
      return false;
    else return true;
  }

  get swapButtonLabel() {
    if (!this.amount1) return "Enter an Amount";
    else return "Swap";
  }

  get advancedBlockItems() {
    return [
      {
        label: "Rate",
        value:
          "1 " +
          this.token1.symbol +
          " = " +
          parseFloat(this.amount2) / parseFloat(this.amount1) +
          " " +
          this.token2.symbol
      },
      // {
      //   label: "Minimum Received",
      //   value: "??.??"
      // },
      {
        label: "Price Impact",
        value:
          this.slippage !== null && this.slippage !== undefined
            ? numeral(this.slippage).format("0.0000%")
            : "0.00%"
      }
      // {
      //   label: "Liquidity Provider Fee",
      //   value: "??.??"
      // }
    ];
  }

  openModal(name: string) {
    this.$bvModal.show(name);
  }

  selectFromToken(id: string) {
    let to = this.$route.query.to;

    if (id === to) {
      this.invertSelection();
      return;
    }

    this.$router.replace({
      name: "Swap",
      query: {
        from: id,
        to: to
      }
    });
  }

  selectToToken(id: string) {
    let from = this.$route.query.from;

    if (id === from) {
      this.invertSelection();
      return;
    }

    this.$router.replace({
      name: "Swap",
      query: {
        from: from,
        to: id
      }
    });
  }

  sanitizeAmount() {
    this.setDefault();
  }

  invertSelection() {
    this.$router.replace({
      name: "Swap",
      query: {
        from: this.token2.id,
        to: this.token1.id
      }
    });
  }

  async initConvert() {
    if (this.currentUser) this.modal = true;
    //@ts-ignore
    else await this.promptAuth();
  }

  async updatePriceReturn(amount: string) {
    if (!amount || amount === "0" || amount === ".") {
      this.setDefault();
      return;
    }
    try {
      this.rateLoading = true;
      const reward = await vxm.bancor.getReturn({
        from: {
          id: this.token1.id,
          amount: this.amount1
        },
        toId: this.token2.id
      });
      if (reward.slippage) {
        this.slippage = reward.slippage;
      } else {
        this.slippage = 0;
      }
      if (reward.fee) {
        this.fee = reward.fee;
      }
      this.amount2 = reward.amount;
      const raiseError = new BigNumber(this.balance1).isLessThan(amount);
      this.errorToken1 = raiseError
        ? "Token balance is currently insufficient"
        : "";
      this.errorToken2 = "";
    } catch (e) {
      this.errorToken1 = e.message;
      this.errorToken2 = "";
    } finally {
      this.rateLoading = false;
    }
  }

  setDefault() {
    this.amount1 = "";
    this.amount2 = "";
    this.fee = this.slippage = null;
    this.errorToken2 = "";
    this.errorToken1 = "";
  }

  async calculateRate() {
    this.rateLoading = true;
    try {
      const reward = await vxm.bancor.getReturn({
        from: {
          id: this.token1.id,
          amount: "1"
        },
        toId: this.token2.id
      });
      this.initialRate = reward.amount;
    } catch (e) {
      console.log(e);
    }
    this.rateLoading = false;
  }

  get balance1() {
    return vxm.bancor.token(this.token1.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.token2.id).balance ?? "0";
  }

  get overSlippageLimit() {
    if(this.slippage !== null && this.slippage !== undefined && this.slippage >= 0.03) {
      return true;
    }    
    return false;
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
    await this.calculateRate();
  }

  async created() {
    if (this.$route.query.to && this.$route.query.from)
      await this.onTokenChange(this.$route.query);
    else {
      const defaultQuery = {
        from: vxm.bancor.tokens[1].id,
        to: vxm.bancor.tokens[0].id
      };
      // @ts-ignore
      if (this.$route.query.from) defaultQuery.from = this.$route.query.from;
      // @ts-ignore
      if (this.$route.query.to) defaultQuery.to = this.$route.query.to;
      await this.$router.replace({ name: "Swap", query: defaultQuery });
    }

    await this.calculateRate();
  }
}
</script>

<style scoped lang="scss"></style>
