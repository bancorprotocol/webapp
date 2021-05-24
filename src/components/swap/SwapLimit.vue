<template>
  <div>
    <token-input-field
      id="amount1"
      :label="$t('from')"
      v-model="amount1"
      @input="amount1CalcField()"
      @select="selectFromToken"
      :blur-func="() => setlastChangedField(1, amount1)"
      :token="token1"
      :balance="balance1"
      :error-msg="errorToken1"
      :tokens="tokensFrom"
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
      id="amount2"
      :label="$t('to_estimated')"
      v-model="amount2"
      @input="amount2CalcField()"
      @select="selectToToken"
      :blur-func="() => setlastChangedField(2, amount2)"
      :token="token2"
      :balance="balance2"
      :dropdown="true"
      :disabled="false"
      :tokens="tokensTo"
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
        <div class="d-flex align-items-center mb-3">
          <multi-input-field
            id="limit"
            @input="rateCalcField()"
            :prepend="`1 ${token1.symbol} =`"
            :blur-func="() => setlastChangedField(3, limitRate)"
            class="w-100"
            v-model="limitRate"
            :placeholder="`${prettifyNumber(initialRate)} ${token2.symbol}`"
            :format="true"
            :append-slot="true"
            height="48"
          >
            <div class="d-flex align-items-center" style="padding-right: 6px">
              <img
                class="img-avatar img-avatar32 border-colouring bg-white"
                :src="token2.logo"
                alt="Token Logo"
              />
              <span
                class="font-size-14 font-w600 pl-2"
                :class="darkMode ? 'text-dark' : 'text-light'"
              >
                {{ token2.symbol }}
              </span>
            </div>
          </multi-input-field>
        </div>
        <div class="d-flex justify-content-between my-3">
          <div v-for="(x, index) in percentages" :key="x" style="width: 80px">
            <b-btn
              @click="setPercentage(index)"
              :variant="
                !custom && selectedPercentage === index
                  ? 'primary'
                  : darkMode
                  ? 'outline-gray-dark'
                  : 'outline-gray'
              "
              size="xs"
              block
            >
              +{{ x }}%
            </b-btn>
          </div>
          <div class="d-flex align-items-center">
            <multi-input-field
              id="custom"
              v-model="custom"
              class="mr-1"
              :active="custom"
              @input="setCustomPercentage"
              style="width: 80px"
              :center-text="true"
              :placeholder="$t('custom')"
              :padding="false"
              height="24"
              :format="true"
            />
            <div
              class="font-w400 font-size-12"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              %
            </div>
          </div>
          <b-popover
            target="custom"
            triggers="hover"
            placement="right"
            class="font-size-12 font-w400"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ $t("rate_swap_tokens") }}
          </b-popover>
        </div>
        <alert-block
          class="mb-2"
          v-if="rateAlert !== ''"
          :variant="rateVariant"
          :msg="rateAlert"
        />
        <label-content-split :label="$t('expires_in')">
          <b-dropdown
            :variant="darkMode ? 'outline-dark' : 'outline-light-alt'"
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

    <p
      class="font-size-10 font-w500 mt-2 mb-0 text-center"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      {{ $t("powered_by_keeper_dao") }}
    </p>

    <modal-duration-select
      :initial-duration="selectedDuration"
      v-model="modalSelectDuration"
      @confirm="changeDuration"
    />

    <modal-tx-action
      :title="modalTitle"
      :icon="modalIcon"
      :tx-meta.sync="txMeta"
    >
      <div v-if="!isDepositingWeth">
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
          class="font-size-10 font-w500 mt-2 mb-0 text-left pl-3"
          :class="darkMode ? 'text-muted-dark' : 'text-muted'"
        >
          {{ $t("modal.limit_order.info_text2") }}
        </p>

        <p
          class="font-size-12 mb-3 mt-2 text-left pl-3"
          :class="darkMode ? 'text-muted-dark' : 'text-muted'"
        >
          {{
            $t("modal.limit_order.info_text", {
              timer: durationTimer
            })
          }}
        </p>
      </div>
      <div v-else>
        <p
          class="font-size-14 mb-4 text-center"
          :class="darkMode ? 'text-muted-dark' : 'text-muted'"
        >
          {{ $t("modal.deposit_weth.info_text") }}
        </p>

        <gray-border-block>
          {{ prettifyNumber(amount1) }} WETH
        </gray-border-block>

        <p
          class="font-size-12 font-w400 mt-3 mb-0 text-left px-3"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("modal.withdraw_weth.info") }}
        </p>
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
import dayjs from "@/utils/dayjs";
import {
  compareString,
  durationTimer,
  formatDuration,
  calculatePercentageChange
} from "@/api/helpers";
import ModalDurationSelect from "@/components/modals/ModalSelects/ModalDurationSelect.vue";
import BaseTxAction from "@/components/BaseTxAction.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import {
  addNotification,
  ENotificationStatus
} from "@/components/compositions/notifications";
import { ethReserveAddress } from "@/api/eth/ethAbis";
import { wethTokenContractAddress } from "@/store/modules/swap/ethBancor";

@Component({
  components: {
    GrayBorderBlock,
    ModalTxAction,
    SlippageTolerance,
    LabelContentSplit,
    TokenInputField,
    MultiInputField,
    MainButton,
    ModalDurationSelect,
    AlertBlock
  }
})
export default class SwapLimit extends BaseTxAction {
  amount1 = "";
  amount2 = "";

  percentages = [1, 3, 5];
  selectedPercentage = 1;
  custom = "";

  durationList: plugin.Duration[] = [
    dayjs.duration({ minutes: 10 }),
    dayjs.duration({ hours: 1 }),
    dayjs.duration({ hours: 3 }),
    dayjs.duration({ days: 1 }),
    dayjs.duration({ days: 7 }),
    dayjs.duration({ days: 30 })
  ];
  selectedDuration = this.durationList[4];

  token1: ViewToken = vxm.bancor.tokens[0];
  token2: ViewToken = vxm.bancor.tokens[1];

  slippage: number | null | undefined = null;
  fee: string | null = null;

  errorToken1 = "";
  rateAlert = "";
  rateVariant = "";

  rateLoading = false;
  changedFields = [3];
  initialRate = "";
  limitRate = "";
  numeral = numeral;

  modalSelectDuration = false;

  get tokensFrom() {
    return vxm.bancor.tokens.filter(
      token => token.limitOrderAvailable || token.id === ethReserveAddress
    );
  }

  get tokensTo() {
    return vxm.bancor.tokens.filter(
      token => token.tradeSupported && token.limitOrderAvailable
    );
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
    return (
      "1 " +
      this.token1.symbol +
      " = " +
      this.prettifyNumber(this.initialRate) +
      " " +
      this.token2.symbol
    );
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
    else return i18n.t("swap");
  }

  get durationTimer() {
    return durationTimer(this.selectedDuration);
  }

  get modalTitle() {
    if (this.isDepositingWeth) return "Confirm WETH deposit";
    else return this.$t("modal.limit_order.title");
  }

  get modalIcon() {
    if (this.isDepositingWeth) return "arrow-to-bottom";
    else return "file-alt";
  }

  setPercentage(index: number) {
    this.selectedPercentage = index;
    this.custom = "";
    this.changeLimitRateByPercentage();
  }

  setCustomPercentage() {
    this.changeLimitRateByPercentage(this.custom ? true : false);
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

  invertSelection() {
    this.$router.replace({
      name: "Swap",
      query: {
        from: this.token2.id,
        to: this.token1.id
      }
    });
  }

  isDepositingWeth = false;

  async initSwap() {
    this.openModal();
    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;
    this.isDepositingWeth = false;

    const fromViewAmount = {
      id: this.token1.id,
      amount: this.amount1
    };

    try {
      const fromIsEth = ethReserveAddress === fromViewAmount.id;
      if (fromIsEth) {
        this.isDepositingWeth = true;
        const success = await vxm.ethBancor.depositWeth({
          decAmount: fromViewAmount.amount,
          onPrompt: this.onPrompt
        });
        this.isDepositingWeth = false;
      }

      const correctedFrom: ViewAmount = fromIsEth
        ? { id: wethTokenContractAddress, amount: fromViewAmount.amount }
        : fromViewAmount;

      await vxm.ethBancor.createOrder({
        from: correctedFrom,
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
        status: ENotificationStatus.success
      });
      this.setDefault();
    } catch (e) {
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
      this.isDepositingWeth = false;
    }
  }

  async updatePriceReturn(amount: string) {
    if (!amount || amount === "0" || amount === ".") {
      this.setDefault();
      return;
    }
    const fromId = compareString(this.token1.id, wethTokenContractAddress)
      ? ethReserveAddress
      : this.token1.id;
    try {
      this.rateLoading = true;
      const reward = await vxm.bancor.getReturn({
        from: {
          id: fromId,
          amount: this.amount1
        },
        toId: this.token2.id
      });

      if (reward.slippage) this.slippage = reward.slippage;
      else this.slippage = 0;
      if (reward.fee) this.fee = reward.fee;
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
    if (this.amount2 && this.limitRate)
      this.amount1 = new BigNumber(this.amount2)
        .div(new BigNumber(this.limitRate))
        .toString();
  }
  calcAmount2() {
    if (this.amount1 && this.limitRate)
      this.amount2 = new BigNumber(this.amount1)
        .times(new BigNumber(this.limitRate))
        .toString();
  }
  calcLimitRate() {
    if (this.amount1 && this.amount2) {
      this.limitRate = new BigNumber(this.amount2)
        .div(new BigNumber(this.amount1))
        .toString();
      this.changePercentageByLimitRate();
    }
  }

  amount1CalcField() {
    if (this.amount1 && this.changedFields.length !== 0) {
      const lastChangedField = this.getLastChangedField(1);
      if (lastChangedField === 3) this.calcAmount2();
      else if (lastChangedField === 2) this.calcLimitRate();
    }
    this.checkAlerts();
  }

  amount2CalcField() {
    if (this.amount2 && this.changedFields.length !== 0) {
      const lastChangedField = this.getLastChangedField(2);
      if (lastChangedField === 3) this.calcAmount1();
      else if (lastChangedField === 1) this.calcLimitRate();
    }
    this.checkAlerts();
  }

  rateCalcField() {
    if (this.limitRate && this.changedFields.length !== 0) {
      const lastChangedField = this.getLastChangedField(3);
      if (lastChangedField === 2) this.calcAmount1();
      else if (lastChangedField === 1) this.calcAmount2();
    }
    this.changePercentageByLimitRate();
  }

  setlastChangedField(field: number, txt: string) {
    this.changedFields = this.changedFields.filter(x => x !== field);
    if (txt) this.changedFields.push(field);
  }

  getLastChangedField(field: number) {
    let lastChangedField = this.changedFields[this.changedFields.length - 1];
    if (lastChangedField === field && this.changedFields.length > 1)
      lastChangedField = this.changedFields[this.changedFields.length - 2];
    return lastChangedField;
  }

  changeLimitRateByPercentage(custom: boolean = false) {
    const percentage = custom
      ? Number(this.custom) / 100
      : Number(this.percentages[this.selectedPercentage]) / 100;
    this.limitRate = (Number(this.initialRate) * (1 + percentage)).toString();
    this.setlastChangedField(3, this.limitRate);
    this.changePercentageByLimitRate();
    this.rateCalcField();
    this.checkAlerts();
  }

  changePercentageByLimitRate() {
    const percentage = calculatePercentageChange(
      Number(this.limitRate),
      Number(this.initialRate)
    );
    const index = this.percentages.indexOf(percentage);
    if (index === -1) this.custom = percentage.toString();
    else this.selectedPercentage = index;
    this.checkAlerts();
  }

  async calculateRate() {
    this.rateLoading = true;
    const fromId = compareString(this.token1.id, wethTokenContractAddress)
      ? ethReserveAddress
      : this.token1.id;
    try {
      const rate = await vxm.bancor.getReturn({
        from: {
          id: fromId,
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

  checkAlerts() {
    this.errorToken1 =
      this.amount1 && new BigNumber(this.balance1).isLessThan(this.amount1)
        ? i18n.tc("insufficient_token")
        : "";
    const initialRate = new BigNumber(this.initialRate);
    if (initialRate.isGreaterThan(this.limitRate)) {
      this.rateAlert = i18n.tc("rate_below_market");
      this.rateVariant = "error";
    } else if (initialRate.times(1.2).isLessThan(this.limitRate)) {
      this.rateAlert = i18n.tc("rate_above_market");
      this.rateVariant = "warning";
    } else this.rateAlert = "";
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
    this.changeLimitRateByPercentage();
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
      await this.$router.replace({ name: "Swap", query: defaultQuery });
    }
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
