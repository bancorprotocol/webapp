<template>
  <div>
    <token-input-field
      :label="$t('from')"
      v-model="amount1"
      @input="amount1CalcField()"
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
      @input="amount2CalcField()"
      @select="selectToToken"
      :token="token2"
      :balance="balance2"
      :dropdown="true"
      :disabled="false"
      :tokens="tokens"
      :usd-value="usd2"
    />

    <div class="my-3">
      <div>
        <label-content-split
          :label="$t('rate')"
          :value="`${$t('current_rate')}: ${rate}`"
          :loading="rateLoading"
          class="mb-2"
        />
        <multi-input-field
          @input="rateCalcField()"
          class="mb-3"
          v-model="limitRate"
          :placeholder="rate"
          :append="$t('defined_rate')"
          height="48"
        />
        <label-content-split :label="$t('expires_in')">
          <b-dropdown
            :variant="darkMode ? 'outline-dark' : 'outline-light'"
            toggle-class="block-rounded"
            :menu-class="
              darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
            "
          >
            <template #button-content>
              {{ formatDuration(selectedDuration) }}
            </template>

            <b-dropdown-item
              v-for="item in durationList"
              :key="item.asSeconds()"
              @click="changeDuration(item)"
              :variant="darkMode ? 'dark' : 'light'"
            >
              <div class="d-flex justify-content-between">
                {{ formatDuration(item) }}
                <font-awesome-icon
                  v-if="selectedDuration === item"
                  icon="check"
                  class="mr-2 menu-icon"
                />
              </div>
            </b-dropdown-item>
            <b-dropdown-item
              @click="openDurationModal()"
              :variant="darkMode ? 'dark' : 'light'"
            >
              {{ $t("custom") }}
            </b-dropdown-item>
          </b-dropdown>
        </label-content-split>
      </div>
      <label-content-split
        v-if="fee !== null"
        :label="$t('fee')"
        :value="fee"
      />
    </div>

    <main-button
      :label="swapButtonLabel"
      @click="initSwap"
      :active="true"
      :large="true"
      :loading="rateLoading"
      :disabled="disableButton"
    />
    <modal-duration-select
      :initial-duration="selectedDuration"
      v-model="modalSelectDuration"
      @confirm="changeDuration"
    />

    <modal-tx-action
      :title="$t('modal.limit_order.title')"
      icon="file-alt"
      :tx-meta.sync="txMeta"
    >
      <p
        class="font-size-14 mb-4 text-center"
        :class="darkMode ? 'text-muted-dark' : 'text-muted'"
      >
        {{ $t("modal.limit_order.sub_title") }}
      </p>
      <gray-border-block gray-bg="true">
        <label-content-split
          :label="$t('modal.limit_order.sell')"
          :value="`${prettifyNumber(amount1)} ${token1.symbol}`"
          class="mb-2"
        />
        <label-content-split
          :label="$t('modal.limit_order.receive')"
          :value="`${prettifyNumber(amount2)} ${token2.symbol}`"
          class="mb-2"
        />
        <label-content-split
          :label="$t('modal.limit_order.rate')"
          :value="rate"
        />
      </gray-border-block>

      <p
        class="font-size-12 my-3 text-left pl-3"
        :class="darkMode ? 'text-muted-dark' : 'text-muted'"
      >
        {{
          $t("modal.limit_order.info_text", {
            timer: "?????"
          })
        }}
      </p>
    </modal-tx-action>
  </div>
</template>

<script lang="ts">
import { Watch, Component } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import { getTokenList, TokenList } from "@/api/eth/keeperDaoApi";
import MainButton from "@/components/common/Button.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import { ViewToken } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import numeral from "numeral";
import SlippageTolerance from "@/components/common/SlippageTolerance.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import BigNumber from "bignumber.js";
import dayjs from "@/utils/dayjs";
import { formatDuration } from "@/api/helpers";
import ModalDurationSelect from "@/components/modals/ModalSelects/ModalDurationSelect.vue";
import BaseTxAction from "@/components/BaseTxAction.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import { addNotification } from "@/components/compositions/notifications";

@Component({
  components: {
    GrayBorderBlock,
    ModalTxAction,
    SlippageTolerance,
    LabelContentSplit,
    TokenInputField,
    MultiInputField,
    MainButton,
    ModalDurationSelect
  }
})
export default class SwapLimit extends BaseTxAction {
  amount1 = "";
  amount2 = "";

  durationList: plugin.Duration[] = [
    dayjs.duration({ minutes: 10 }),
    dayjs.duration({ hours: 1 }),
    dayjs.duration({ hours: 3 }),
    dayjs.duration({ days: 1 }),
    dayjs.duration({ days: 7 })
  ];
  selectedDuration = this.durationList[4];
  keeperDaoList: TokenList | null = null;

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

  modalSelectDuration = false;

  get tokens() {
    return vxm.bancor.tokens.filter(token => token.tradeSupported);
  }

  get priceImpact() {
    return this.slippage !== null && this.slippage !== undefined
      ? numeral(this.slippage).format("0.0000%")
      : "0.0000%";
  }

  get slippageTolerance() {
    return vxm.bancor.slippageTolerance;
  }

  get rate() {
    const rate = this.prettifyNumber(1 / Number(this.initialRate));
    return this.inverseRate
      ? "1 " + this.token2.symbol + " = " + rate + " " + this.token1.symbol
      : "1 " + this.token1.symbol + " = " + rate + " " + this.token2.symbol;
  }

  inverseRate = false;

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
    else return i18n.t("swap");
  }

  formatDuration(duration: plugin.Duration) {
    return formatDuration(duration);
  }

  changeDuration(duration: plugin.Duration) {
    this.selectedDuration = duration;
  }

  openDurationModal() {
    this.modalSelectDuration = true;
  }

  selectFromToken(id: string) {
    let to = this.$route.query.to;

    if (id === to) {
      this.invertSelection();
      return;
    }

    this.$router.replace({
      name: "SwapLimit",
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
      name: "SwapLimit",
      query: {
        from: from,
        to: id
      }
    });
  }

  invertSelection() {
    this.$router.replace({
      name: "SwapLimit",
      query: {
        from: this.token2.id,
        to: this.token1.id
      }
    });
  }

  async initSwap() {
    this.openModal();
    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;
    try {
      const success = await vxm.ethBancor.createOrder({
        from: {
          id: this.token1.id,
          amount: this.amount1
        },
        to: {
          id: this.token2.id,
          amount: this.amount2
        },
        expiryDuration: this.selectedDuration.asSeconds(),
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
        txHash: this.txMeta.success?.txId
      });
      this.setDefault();
    } catch (e) {
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
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
      this.errorToken1 = raiseError ? i18n.tc("insufficient_token") : "";
    } catch (e) {
      this.errorToken1 = e.message;
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

  calcAmount1() {
    this.amount1 = new BigNumber(this.amount2)
      .div(new BigNumber(this.limitRate))
      .toString();
  }
  calcAmount2() {
    this.amount2 = new BigNumber(this.amount1)
      .times(new BigNumber(this.limitRate))
      .toString();
  }
  calcLimitRate() {
    this.limitRate = new BigNumber(this.amount2)
      .div(new BigNumber(this.amount1))
      .toString();
  }

  amount1CalcField() {
    if (this.amount1) {
      if (this.amount2) {
        if (this.userSettedRate) this.calcAmount2();
        else this.calcLimitRate();
      } else if (this.limitRate) this.calcAmount2();
    }
    this.checkError();
  }

  amount2CalcField() {
    if (this.amount2) {
      if (this.amount1)
        if (this.userSettedRate) this.calcAmount1();
        else this.calcLimitRate();
      else if (this.limitRate) this.calcAmount1();
    }
    this.checkError();
  }

  rateCalcField() {
    if (this.limitRate) {
      this.userSettedRate = true;
      if (this.amount1 && this.amount2) {
        this.amount1 = "";
        this.amount2 = "";
      } else if (this.amount1) this.calcAmount2();
      else if (this.amount2) this.calcAmount1();
    } else this.userSettedRate = false;
    this.checkError();
  }

  async calculateRate() {
    this.rateLoading = true;
    try {
      const rate = await vxm.bancor.getReturn({
        from: {
          id: this.token1.id,
          amount: "1"
        },
        toId: this.token2.id
      });
      this.initialRate = rate.amount;
    } catch (e) {
      console.error(e);
    }
    this.rateLoading = false;
  }

  checkError() {
    this.errorToken1 =
      this.amount1 && new BigNumber(this.balance1).isLessThan(this.amount1)
        ? i18n.tc("insufficient_token")
        : "";
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

  async mounted() {
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
      await this.$router.replace({ name: "SwapLimit", query: defaultQuery });
    }
    [this.keeperDaoList] = await Promise.all([
      getTokenList(),
      this.calculateRate()
    ]);
  }
}
</script>

<style scoped lang="scss">
.inactive {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
  color: #0f59d1;
  font-size: 1rem;
}

.active {
  cursor: pointer;
  color: #0f59d1;
  font-size: 1rem;
}
</style>
