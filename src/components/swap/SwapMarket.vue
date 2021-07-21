<template>
  <div>
    <token-input-field
      :label="$t('from')"
      v-model="amount1"
      @input="updatePriceReturn"
      @select="selectFromToken"
      :token="token1"
      :balance="balance1"
      :error-msg="errorToken1"
      :tokens="tokens"
      :usd-value="usd1"
    />

    <div class="text-center my-3">
      <font-awesome-icon
        icon="exchange-alt"
        rotation="90"
        @click="invertSelection"
        :class="rateLoading ? 'inactive' : 'active'"
      />
    </div>

    <token-input-field
      :label="$t('to_estimated')"
      v-model="amount2"
      @input="sanitizeAmount()"
      @select="selectToToken"
      :token="token2"
      :balance="balance2"
      :dropdown="true"
      :disabled="false"
      :tokens="tokens"
      :usd-value="usd2"
    />

    <div class="my-3">
      <div class="mb-3">
        <label-content-split
          :label="advancedOpen ? $t('slippage_tolerance') : ''"
        >
          <span
            @click="advancedOpen = !advancedOpen"
            class="font-size-12 font-w500 cursor"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ $t("advanced_settings") }}
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
        :label="$t('rate')"
        :value="rate"
        :loading="rateLoading"
        class="mb-2"
      >
        <span @click="inverseRate = !inverseRate" class="cursor">
          {{ rate }} <font-awesome-icon icon="retweet" class="text-muted" />
        </span>
      </label-content-split>
      <label-content-split
        :label="$t('price_impact')"
        :tooltip="$t('market_price_diff')"
        :is-alert="overSlippageLimit"
        :value="priceImpact"
      />
    </div>
    <label-content-split v-if="fee !== null" :label="$t('fee')" :value="fee" />

    <main-button
      :label="swapButtonLabel"
      @click="initSwap"
      :error="errorButton"
      :active="true"
      :large="true"
      :loading="rateLoading"
      :disabled="disableButton"
    />

    <modal-tx-action
      :title="$t('confirm_token_swap')"
      icon="exchange-alt"
      :tx-meta.sync="txMeta"
      @onHide="onHide"
    >
      <gray-border-block>
        <label-content-split
          :label="$t('modal.limit_order.sell')"
          :value="`${prettifyNumber(amount1)} ${token1.symbol}`"
          class="mb-2"
        />
        <label-content-split
          :label="$t('modal.limit_order.receive')"
          :value="`${prettifyNumber(amount2)} ${token2.symbol}`"
        />
      </gray-border-block>

      <p
        class="font-size-12 my-3 text-left pl-3"
        :class="darkMode ? 'text-muted-dark' : 'text-muted'"
      >
        {{
          $t("output_estimated", {
            amount: numeral(slippageTolerance).format("0.0[0]%")
          })
        }}
      </p>

      <gray-border-block gray-bg="true">
        <label-content-split
          :label="$t('modal.limit_order.rate')"
          :value="rate"
          class="mb-2"
        />
        <label-content-split :label="$t('price_impact')" :value="priceImpact" />
      </gray-border-block>

      <div class="my-3 text-center">
        <a
          v-if="isVbnt"
          href="https://blog.bancor.network/using-bancor-vortex-46974a1c14f9"
          target="_blank"
          class="font-size-12"
          :class="darkMode ? 'text-muted-dark' : 'text-muted'"
        >
          <u>{{ $t("vbnt_read_more") }}</u>
        </a>
      </div>
    </modal-tx-action>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import MainButton from "@/components/common/Button.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import { ViewAmount, ViewToken } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import numeral from "numeral";
import SlippageTolerance from "@/components/common/SlippageTolerance.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import BigNumber from "bignumber.js";
import BaseTxAction from "@/components/BaseTxAction.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import { addNotification } from "@/components/compositions/notifications";
import { wethTokenContractAddress } from "@/store/modules/swap/ethBancor";
import { compareString } from "@/api/helpers";
import wait from "waait";
import { ConversionEvents, sendConversionEvent } from "@/gtm";
import { EthNetworks } from "@/api/web3";

@Component({
  components: {
    GrayBorderBlock,
    ModalTxAction,
    SlippageTolerance,
    LabelContentSplit,
    TokenInputField,
    MultiInputField,
    MainButton
  }
})
export default class SwapAction extends BaseTxAction {
  amount1 = "";
  amount2 = "";

  token1: ViewToken = vxm.bancor.tokens[0];
  token2: ViewToken = vxm.bancor.tokens[1];

  slippage: number | null | undefined = null;
  fee: string | null = null;

  errorToken1 = "";

  rateLoading = false;
  userSettedRate = false;
  initialRate = "";
  limitRate = "";
  numeral = numeral;

  advancedOpen = false;

  get orders() {
    return vxm.ethBancor.limitOrders;
  }

  get tokens() {
    return vxm.bancor.tokens.filter(
      token =>
        token.tradeSupported &&
        !compareString(token.id, wethTokenContractAddress)
    );
  }

  get isVbnt() {
    const symbol1 = this.token1.symbol.toLowerCase();
    const symbol2 = this.token2.symbol.toLowerCase();
    return symbol1 === "vbnt" || symbol2 === "vbnt";
  }

  get priceImpact() {
    const baseFormat = "0.0000%";
    if (this.slippage !== null && this.slippage !== undefined) {
      const formatted = numeral(this.slippage).format("0.0000%");
      return formatted !== "NaN%" ? formatted : baseFormat;
    } else {
      return baseFormat;
    }
  }

  get slippageTolerance() {
    return vxm.bancor.slippageTolerance;
  }

  get errorButton() {
    return this.slippage && this.slippage > 0.1;
  }

  inverseRate = true;

  get rate() {
    let rate = "";
    if (this.inverseRate) {
      if (this.amount1 && this.amount2)
        rate = this.prettifyNumber(Number(this.amount2) / Number(this.amount1));
      else {
        rate = this.prettifyNumber(Number(this.initialRate));
      }
      return (
        "1 " + this.token1.symbol + " = " + rate + " " + this.token2.symbol
      );
    } else {
      if (this.amount1 && this.amount2)
        rate = this.prettifyNumber(Number(this.amount1) / Number(this.amount2));
      else rate = this.prettifyNumber(1 / Number(this.initialRate));
      return (
        "1 " + this.token2.symbol + " = " + rate + " " + this.token1.symbol
      );
    }
  }

  get disableButton() {
    if (!this.currentUser && this.amount1) return false;
    else if (
      this.amount1 &&
      this.amount2 &&
      !new BigNumber(this.amount1).isZero() &&
      !new BigNumber(this.amount2).isZero() &&
      !this.errorToken1
    )
      return false;
    else return true;
  }

  get swapButtonLabel() {
    if (!this.amount1) return i18n.t("enter_amount");
    else if (this.slippage) {
      if (0.05 < this.slippage && this.slippage < 0.1)
        return i18n.t("swap_slippage");
      else if (this.slippage > 0.1) return i18n.t("swap_high_slippage");
    }

    return i18n.t("swap");
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

  async initSwap() {
    const conversion = {
      conversion_type: "Market",
      conversion_approve: "Unlimited",
      conversion_blockchain: "ethereum",
      conversion_blockchain_network:
        vxm.ethBancor.currentNetwork === EthNetworks.Ropsten
          ? "Ropsten"
          : "MainNet",
      conversion_settings:
        this.slippageTolerance === 0.005 ? "Regular" : "Advanced",
      conversion_token_pair: this.token1.symbol + "/" + this.token2.symbol,
      conversion_from_token: this.token1.symbol,
      conversion_to_token: this.token2.symbol,
      conversion_from_amount: this.amount1,
      conversion_to_amount: this.amount2
    };
    sendConversionEvent(ConversionEvents.click, conversion);
    const notLoggedIn = this.openModal();
    if (!notLoggedIn)
      sendConversionEvent(ConversionEvents.receipt_req, conversion);

    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;
    try {
      const success = await vxm.bancor.convert({
        from: {
          id: this.token1.id,
          amount: this.amount1
        },
        to: {
          id: this.token2.id,
          amount: this.amount2
        },
        onUpdate: this.onUpdate,
        onPrompt: this.onPrompt
      });
      this.txMeta.showTxModal = false;
      addNotification({
        title: this.$tc("notifications.add.swap.title"),
        description: this.$tc("notifications.add.swap.description", 0, {
          amount1: this.prettifyNumber(this.amount1),
          symbol1: this.token1.symbol,
          amount2: this.prettifyNumber(this.amount2),
          symbol2: this.token2.symbol
        }),
        txHash: success.txId
      });
      this.setDefault();
    } catch (e) {
      if (e.message.includes("User denied"))
        sendConversionEvent(ConversionEvents.wallet_rej, conversion);
      else
        sendConversionEvent(ConversionEvents.fail, {
          conversion,
          error: e.message
        });

      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  onHide(state: boolean) {
    if (!state) return;
    console.log("GTM event");
    const conversion = {
      conversion_type: "Market",
      conversion_approve: "Unlimited",
      conversion_blockchain: "ethereum",
      conversion_blockchain_network:
        vxm.ethBancor.currentNetwork === EthNetworks.Ropsten
          ? "Ropsten"
          : "MainNet",
      conversion_settings:
        this.slippageTolerance === 0.005 ? "Regular" : "Advanced",
      conversion_token_pair: this.token1.symbol + "/" + this.token2.symbol,
      conversion_from_token: this.token1.symbol,
      conversion_to_token: this.token2.symbol,
      conversion_from_amount: this.amount1,
      conversion_to_amount: this.amount2
    };
    sendConversionEvent(ConversionEvents.receipt_rej, conversion);
  }

  lastReturn: { from: ViewAmount; to: ViewAmount } = {
    from: {
      id: "",
      amount: ""
    },
    to: {
      id: "",
      amount: ""
    }
  };

  isSmallerThanLastReturn() {}

  async onRateInput(rateInput: string) {
    console.log("rate input", rateInput);
  }

  async updatePriceReturn(amount: string) {
    if (!amount || amount === "0" || amount === ".") {
      this.setDefault();
      return;
    }
    try {
      this.rateLoading = true;

      const returnAmount = {
        from: {
          id: this.token1.id,
          amount: this.amount1
        },
        toId: this.token2.id
      };

      const reward = await vxm.bancor.getReturn(returnAmount);
      this.lastReturn = {
        ...returnAmount,
        to: {
          id: returnAmount.toId,
          amount: reward.amount
        }
      };
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
      this.errorToken1 = raiseError ? i18n.tc("insufficient_token") : "";
    } catch (e) {
      const translateResult = i18n.tc(e.message);
      this.errorToken1 = translateResult || e.message;
    } finally {
      this.rateLoading = false;
    }
  }

  setDefault() {
    this.amount1 = "";
    this.amount2 = "";
    this.fee = this.slippage = null;
    this.errorToken1 = "";
  }

  async calculateRate() {
    this.rateLoading = true;
    await wait(1000);
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
      console.error(e);
    }
    this.rateLoading = false;
  }

  get balance1() {
    return vxm.bancor.token(this.token1.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.token2.id).balance ?? "0";
  }

  get usd1() {
    const token1 = vxm.bancor.token(this.token1.id);
    if (token1.price && token1.balance)
      return new BigNumber(token1.price).times(token1.balance);

    return "0";
  }

  get usd2() {
    const token2 = vxm.bancor.token(this.token2.id);
    if (token2.price && token2.balance)
      return new BigNumber(token2.price).times(token2.balance);

    return "0";
  }

  get overSlippageLimit() {
    if (
      this.slippage !== null &&
      this.slippage !== undefined &&
      this.slippage >= 0.03
    ) {
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

  interval: any = null;

  async mounted() {
    this.token1 = vxm.bancor.tokens[0];
    this.token2 = vxm.bancor.tokens[1];
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

    this.interval = setInterval(async () => {
      await this.calculateRate();
      if (this.amount1) await this.updatePriceReturn(this.amount1);
    }, 15000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped lang="scss">
.inactive {
  pointer-events: none;
  cursor: default;
  color: #86b0f4;
  opacity: 0.6;
  font-size: 1rem;
}

.active {
  cursor: pointer;
  color: #86b0f4;
  font-size: 1rem;
}
</style>

function event_category(arg0: string, event_category: any, conversion: {
conversion_type: string; conversion_approve: string; conversion_blockchain:
string; conversion_blockchain_network: string; conversion_settings: string;
conversion_token_pair: string; conversion_from_token: string;
conversion_to_token: string; conversion_from_amount: string;
conversion_to_amount: string; }) { throw new Error("Function not implemented.");
}
