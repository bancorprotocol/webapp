<template>
  <div class="mt-3">
    <alert-block :title="`${$t('add_liquidity_pool')}:`" class="my-3">
      <ol class="m-0 pl-3">
        <li>
          <a
            href="https://blog.bancor.network/how-to-stake-liquidity-earn-fees-on-bancor-bff8369274a1"
            target="_blank"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ `${$t("make_money_liquidity")}?` }}
          </a>
        </li>
        <li>
          <a
            href="https://blog.bancor.network/beginners-guide-to-getting-rekt-by-impermanent-loss-7c9510cb2f22"
            target="_blank"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ `${$t("impermanent_loss")}?` }}
          </a>
        </li>
        <li>
          <a
            href="https://bankless.substack.com/p/how-to-protect-yourself-from-impermanent"
            target="_blank"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ `${$t("protect_impermanent_loss")}?` }}
          </a>
        </li>
      </ol>
    </alert-block>

    <label-content-split :label="$t('stake_pool')" class="my-3">
      <pool-logos
        :pool="pool"
        :dropdown="true"
        :cursor="true"
        @click="openPoolSelectModal"
      />
      <modal-pool-select
        @select="selectPool"
        v-model="poolSelectModal"
        :pools="pools"
      />
    </label-content-split>

    <token-input-field
      :label="$t('stake_amount')"
      :token="token"
      v-model="amount"
      :disabled="focusedReserveIsDisabled"
      @input="amountChanged"
      :balance="balance"
      :error-msg="inputError"
      :tokens="tokens"
      @select="toggleReserveIndex"
    />

    <alert-block
      v-if="!isWhitelisted"
      variant="warning"
      :msg="whitelistWarning.msg"
      class="mt-3 mb-3"
    />

    <gray-border-block v-else-if="outputs.length" :gray-bg="true" class="my-3">
      <div>
        {{ outputs }}
        <label-content-split
          v-for="(output, index) in outputs"
          :key="output.id"
          :label="index === 0 ? $t('value_receive') : ''"
          :value="`${prettifyNumber(output.amount)} ${output.symbol}`"
        />
      </div>
    </gray-border-block>

    <alert-block
      v-if="focusedReserveIsDisabled"
      variant="error"
      :msg="
        bothReservesAreDisabled
          ? $t('pool_not_accepting')
          : $t(`available_reserve_only`, { symbol: opposingTokenSymbol })
      "
      class="mt-3 mb-3"
    />
    <gray-border-block
      :gray-bg="true"
      class="my-3"
      v-if="!focusedReserveIsDisabled"
    >
      <label-content-split
        :label="$t('space_available')"
        :loading="loading"
        :tooltip="`${$t('for_more_information')} `"
        :href-text="$t('click_here')"
        href="https://docs.bancor.network/faqs#why-is-there-no-space-available-for-my-tokens-in-certain-pools"
      >
        <a
          id="notify"
          v-if="
            spaceLTOne &&
            !opposingReserveIsDisabled &&
            !focusedReserveIsDisabled
          "
          :href="notificationURL"
          target="_blank"
          class="mr-1"
        >
          <font-awesome-icon
            icon="bell"
            class="font-size-20 align-bottom"
            style="width: 20px"
            :class="darkMode ? 'icon-primary-dark' : 'icon-primary-light'"
          />
        </a>
        <b-popover target="notify" triggers="hover" placement="top">
          {{ $t("notify_space_available") }}
        </b-popover>
        <span @click="setAmount(maxStakeAmount)" class="cursor">
          {{ `${prettifyNumber(maxStakeAmount)} ${maxStakeSymbol}` }}
        </span>
      </label-content-split>
      <label-content-split
        v-if="
          amountToMakeSpace &&
          !opposingReserveIsDisabled &&
          !focusedReserveIsDisabled
        "
        class="mt-2"
        :label="$t('bnt_open_space')"
        :loading="loading"
      >
        <span @click="setAmount(amountToMakeSpace, 0)" class="cursor">{{
          `${prettifyNumber(amountToMakeSpace)} ${bnt.symbol}`
        }}</span>
      </label-content-split>
    </gray-border-block>

    <price-deviation-error
      v-if="!bothReservesAreDisabled"
      v-model="priceDeviationTooHigh"
      :pool-id="pool.id"
      :token-contract="token.contract"
      class="mb-3"
      ref="priceDeviationError"
    />

    <main-button
      :label="actionButtonLabel"
      @click="initStake"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
    />

    <modal-tx-action
      title="Confirm Stake & Protect"
      icon="coins"
      :tx-meta.sync="txMeta"
      redirect-on-success="Portfolio"
    >
      <gray-border-block>
        <span
          class="font-size-12"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          You are staking and protecting
        </span>
        <div
          class="font-w500 font-size-14"
          v-text="`${prettifyNumber(amount)} ${token.symbol}`"
        />
      </gray-border-block>
    </modal-tx-action>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { ViewAmountDetail, ViewRelay } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { compareString, findOrThrow, formatUnixTime } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import dayjs from "@/utils/dayjs";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import Vue from "vue";
import PriceDeviationError from "@/components/common/PriceDeviationError.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import BaseTxAction from "@/components/BaseTxAction.vue";
import wait from "waait";
import { addNotification } from "@/components/compositions/notifications";

@Component({
  components: {
    PriceDeviationError,
    ModalPoolSelect,
    ModalTxAction,
    PoolLogos,
    AlertBlock,
    LabelContentSplit,
    GrayBorderBlock,
    TokenInputField,
    MainButton
  }
})
export default class AddProtectionSingle extends BaseTxAction {
  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }

  maxStakeAmount: string = "";
  maxStakeSymbol: string = "";
  amountToMakeSpace: string = "";
  priceDeviationTooHigh: boolean = false;

  loading: boolean = false;

  amount: string = "";

  poolSelectModal = false;

  preTxError = "";
  outputs: ViewAmountDetail[] = [];

  selectedTokenIndex = 1;

  private interval: any;

  @Watch("token")
  async onTokenChange() {
    await this.load();
    await this.loadRecentAverageRate();
  }

  toggleReserveIndex(x: string) {
    this.preTxError = "";
    this.selectedTokenIndex = this.pool.reserves.findIndex(
      reserve => reserve.id == x
    );
    this.amountChanged(this.amount);
  }

  get notificationURL() {
    return (
      "https://9000.hal.xyz/recipes/bancor-pool-liquidity-protocol?pool=" +
      this.pool.id +
      "&token=" +
      this.token.symbol +
      "&value=10000&currency=USD"
    );
  }

  get token() {
    return this.pool.reserves[this.selectedTokenIndex];
  }

  get bnt() {
    return this.pool.reserves[0];
  }

  get otherTkn() {
    return this.pool.reserves[1];
  }

  get opposingToken() {
    return this.pool.reserves.find(
      (reserve, index) => index !== this.selectedTokenIndex
    );
  }

  get opposingTokenSymbol() {
    return this.opposingToken ? this.opposingToken.symbol : "";
  }

  disabledReserves: string[] = [];

  get tokens() {
    return this.pool.reserves;
  }

  get focusedReserveIsDisabled() {
    return this.disabledReserves.some(reserveId =>
      compareString(reserveId, this.token.id)
    );
  }

  get bothReservesAreDisabled() {
    return this.disabledReserves.length > 1;
  }

  get opposingReserveIsDisabled() {
    return this.disabledReserves.some(reserveId =>
      compareString(reserveId, this.opposingToken ? this.opposingToken.id : "")
    );
  }

  get pools() {
    return vxm.bancor.relays.filter(x => x.whitelisted);
  }

  get isWhitelisted() {
    return this.pool.whitelisted;
  }

  get balance() {
    const poolBalance = vxm.ethBancor.tokenBalance(this.token.id);
    return poolBalance ? poolBalance.balance : "0";
  }

  get fullCoverageDate() {
    const maxDelayTime = vxm.ethBancor.liquidityProtectionSettings.maxDelay;
    const currentTime = dayjs().unix();
    return formatUnixTime(currentTime + maxDelayTime).date;
  }

  get actionButtonLabel() {
    if (!this.amount) return i18n.t("enter_amount");
    else if (this.priceDeviationTooHigh) return i18n.t("price_deviation_high");
    else return i18n.t("stake_protect");
  }

  get disableActionButton() {
    if (this.focusedReserveIsDisabled) return true;
    if (!this.amount) return true;
    else if (this.priceDeviationTooHigh) return true;
    else if (this.loading) return true;
    else return !!this.inputError;
  }

  get inputError() {
    if (this.amount == "") return "";
    if (this.preTxError) return this.preTxError;
    if (parseFloat(this.amount) === 0) return i18n.t("amount_not_zero");

    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance || 0);

    if (amountNumber.gt(balanceNumber)) return i18n.t("insufficient_balance");
    else return "";
  }

  get whitelistWarning() {
    const msg = i18n.t("pool_not_approved");
    const show = true;

    return { show, msg };
  }

  get spaceLTOne() {
    return Number(this.maxStakeAmount) < 1;
  }

  async initStake() {
    this.openModal();

    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;

    try {
      this.txMeta.success = await vxm.ethBancor.addProtection({
        poolId: this.pool.id,
        reserveAmount: {
          id: this.token.id,
          amount: this.amount
        },
        onUpdate: this.onUpdate,
        onPrompt: this.onPrompt
      });
      this.txMeta.showTxModal = false;
      addNotification({
        title: this.$tc("notifications.add.stake.title"),
        description: this.$tc("notifications.add.stake.description", 0, {
          amount: this.prettifyNumber(this.amount),
          symbol: this.token.symbol,
          pool: this.pool.name
        }),
        txHash: this.txMeta.success.txId
      });
    } catch (e) {
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  async amountChanged(tokenAmount: string) {
    const input = new BigNumber(tokenAmount);
    const inputIsNumber = !input.isNaN() && input.isGreaterThan(0);
    if (inputIsNumber) {
      const res = await vxm.ethBancor.calculateProtectionSingle({
        poolId: this.pool.id,
        reserveAmount: { id: this.token.id, amount: this.amount }
      });
      this.outputs = res.outputs;

      const errorMsg = this.opposingReserveIsDisabled
        ? i18n.tc("wait_until_space_opens", 0, {
            token: this.token.symbol
          })
        : i18n.tc("limit_reached", 0, {
            token: this.token.symbol,
            opposingToken: this.opposingToken!.symbol
          });

      if (res.error) {
        this.preTxError =
          res.error == "overMaxLimit"
            ? errorMsg
            : i18n.tc("insufficient_store_balance");
      } else {
        this.preTxError = "";
      }
    } else {
      this.outputs = [];
    }
  }

  openPoolSelectModal() {
    this.poolSelectModal = true;
  }

  async loadRecentAverageRate() {
    await (
      this.$refs.priceDeviationError as Vue & {
        loadRecentAverageRate: () => boolean;
      }
    ).loadRecentAverageRate();
  }

  async selectPool(id: string) {
    await this.$router.replace({
      name: "AddProtectionSingle",
      params: { id }
    });
  }

  async fetchAndSetMaxStakes(poolId: string) {
    this.amountToMakeSpace = "";

    const res = await vxm.ethBancor.getAvailableAndAmountToGetSpace({
      poolId
    });
    const availableSpace = res.availableSpace;

    const selectedToken = findOrThrow(
      availableSpace,
      space => compareString(space.token, this.token.symbol),
      "Failed finding focused token in available space"
    );
    this.maxStakeAmount = selectedToken.amount;
    this.maxStakeSymbol = selectedToken.token;

    if (res.amountToGetSpace) this.amountToMakeSpace = res.amountToGetSpace;
  }

  async fetchAndSetDisabledReserves(poolId: string) {
    this.disabledReserves = await vxm.ethBancor.fetchDisabledReserves(poolId);
  }

  async load() {
    if (this.loading) return;
    this.loading = true;
    try {
      await Promise.all([
        wait(1000),
        this.fetchAndSetMaxStakes(this.pool.id),
        this.fetchAndSetDisabledReserves(this.pool.id)
      ]);
    } catch (e) {
      console.error(e.message);
    } finally {
      this.loading = false;
    }
  }

  setAmount(amount: string, switchToken: number = -1) {
    if (switchToken != -1 && this.selectedTokenIndex != switchToken)
      this.selectedTokenIndex = switchToken;
    this.amount = parseFloat(amount) > 0 ? amount : "0";
  }

  async mounted() {
    await this.load();
    await this.loadRecentAverageRate();
    this.interval = setInterval(async () => {
      await this.load();
      await this.loadRecentAverageRate();
    }, 30000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped lang="scss"></style>
