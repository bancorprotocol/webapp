<template>
  <div class="mt-3">
    <token-input-field
      :label="$t('input')"
      :token="reserveOne"
      v-model="amount1"
      @input="tokenOneChanged"
      :balance="balance1"
      :error-msg="token1Error"
    />

    <div class="text-center my-3">
      <font-awesome-icon icon="plus" class="text-primary font-size-16" />
    </div>

    <token-input-field
      :label="$t('input')"
      :token="reserveTwo"
      v-model="amount2"
      @input="tokenTwoChanged"
      class="mb-3"
      :balance="balance2"
      :error-msg="token2Error"
    />

    <rate-share-block
      :items="shareBlockItems"
      :label="$t('prices_pool_share')"
    />

    <main-button
      @click="initAction"
      :label="$t('supply')"
      :active="true"
      :large="true"
      class="mt-3"
      :loading="rateLoading"
      :disabled="disableMainButton"
    />

    <modal-tx-action
      :title="$t('add_liquidity')"
      icon="plus"
      :tx-meta.sync="txMeta"
      redirect-on-success="Portfolio"
    >
      <gray-border-block>
        <label-content-split
          :label="$t('deposit')"
          :value="`${prettifyNumber(amount1)} ${reserveOne.symbol}`"
        />
        <label-content-split
          class="mt-1"
          :value="`${prettifyNumber(amount2)} ${reserveTwo.symbol}`"
        />
      </gray-border-block>

      <gray-border-block gray-bg="true" class="mt-3">
        <label-content-split
          v-for="item in advancedBlockItems"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </gray-border-block>
    </modal-tx-action>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { ViewAmount, ViewRelay } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import RateShareBlock from "@/components/common/RateShareBlock.vue";
import { compareString, formatNumber, formatPercent } from "@/api/helpers";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import { addNotification } from "@/components/compositions/notifications";

@Component({
  components: {
    GrayBorderBlock,
    ModalTxAction,
    RateShareBlock,
    ModalPoolAction,
    LabelContentSplit,
    TokenInputField,
    PoolLogos,
    MainButton
  }
})
export default class PoolActionsAddV1 extends BaseTxAction {
  @Prop() pool!: ViewRelay;

  amount1: string = "";
  amount2: string = "";

  singleUnitCosts: any[] = [];
  shareOfPool = 0;

  rateLoading = false;

  token1Error = "";
  token2Error = "";

  get disableMainButton() {
    return (
      this.token1Error !== "" ||
      this.token2Error !== "" ||
      !(this.amount1 && this.amount2)
    );
  }

  async initAction() {
    this.openModal();

    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;

    try {
      this.txMeta.success = await vxm.bancor.addLiquidity({
        id: this.pool.id,
        reserves: [
          {
            id: this.reserveOne.id,
            amount: this.amount1
          },
          {
            id: this.reserveTwo.id,
            amount: this.amount2
          }
        ],
        onUpdate: this.onUpdate,
        onPrompt: this.onPrompt
      });
      this.txMeta.showTxModal = false;
      addNotification({
        title: this.$tc("notifications.add.add_liquidity.title"),
        description: this.$tc(
          "notifications.add.add_liquidity.description",
          0,
          {
            amount1: this.prettifyNumber(this.amount1),
            symbol1: this.reserveOne.symbol,
            amount2: this.prettifyNumber(this.amount2),
            symbol2: this.reserveTwo.symbol,
            pool: this.pool.name
          }
        ),
        txHash: this.txMeta.success!.txId
      });
    } catch (e) {
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  get balance1() {
    return vxm.bancor.token(this.reserveOne.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.reserveTwo.id).balance ?? "0";
  }

  get share() {
    return formatPercent(this.shareOfPool);
  }

  get shareBlockItems() {
    if (this.shareOfPool > 0) {
      return [
        ...this.singleUnitCosts,
        {
          id: "poolShare",
          title: this.share,
          label: i18n.t("share_of_pool")
        }
      ];
    } else {
      return [
        ...this.singleUnitCosts,
        {
          id: "poolShare",
          label: i18n.t("share_of_pool"),
          title: "0%"
        }
      ];
    }
  }

  get advancedBlockItems() {
    return [
      {
        label: i18n.t("rates"),
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
        label: i18n.t("share_of_pool"),
        value: this.share
      }
    ];
  }

  get reserveOne() {
    return this.pool.reserves[0];
  }

  get reserveTwo() {
    return this.pool.reserves[1];
  }

  setDefault() {
    this.shareOfPool = 0;
    this.amount2 = "";
    this.amount1 = "";
    this.token1Error = "";
    this.token2Error = "";
  }

  async tokenOneChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === ".") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await vxm.bancor.calculateOpposingDeposit({
        id: this.pool.id,
        reserves: [
          { id: this.reserveOne.id, amount: tokenAmount },
          { id: this.reserveTwo.id, amount: this.amount2 }
        ],
        changedReserveId: this.reserveOne.id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amount2 = results.opposingAmount;
      }

      const raiseToken1InsufficientBalance =
        Number(this.balance1) < Number(tokenAmount);
      this.token1Error = raiseToken1InsufficientBalance
        ? i18n.tc("insufficient_balance")
        : "";

      const raiseToken2InsufficientBalance =
        Number(this.balance2) < Number(this.amount2);
      this.token2Error = raiseToken2InsufficientBalance
        ? i18n.tc("insufficient_balance")
        : "";

      this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);
    } catch (e) {
      this.token1Error = e.message;
      this.token2Error = "";
    }
    this.rateLoading = false;
  }

  setSingleUnitCosts(units: ViewAmount[]) {
    this.singleUnitCosts = units.map(unit => {
      const token = this.pool.reserves.find(reserve =>
        compareString(unit.id, reserve.id)
      )!;
      const opposingToken = this.pool.reserves.find(
        reserve => !compareString(unit.id, reserve.id)
      )!;
      return {
        id: token.id,
        title: formatNumber(Number(unit.amount)),
        label: `${opposingToken.symbol} ${i18n.t("per")} ${token.symbol}`
      };
    });
  }

  async tokenTwoChanged(tokenAmount: string) {
    if (!tokenAmount || tokenAmount === ".") {
      this.setDefault();
      return;
    }
    this.rateLoading = true;
    try {
      const results = await vxm.bancor.calculateOpposingDeposit({
        id: this.pool.id,
        reserves: [
          { id: this.reserveTwo.id, amount: tokenAmount },
          { id: this.reserveOne.id, amount: this.amount1 }
        ],
        changedReserveId: this.reserveTwo.id
      });
      if (typeof results.opposingAmount !== "undefined") {
        this.amount1 = results.opposingAmount;
      }
      this.shareOfPool = results.shareOfPool;
      this.setSingleUnitCosts(results.singleUnitCosts);

      const raiseToken1InsufficientBalance =
        Number(this.balance1) < Number(this.amount1);
      this.token1Error = raiseToken1InsufficientBalance
        ? i18n.tc("insufficient_balance")
        : "";

      const raiseToken2InsufficientBalance =
        Number(this.balance2) < Number(tokenAmount);
      this.token2Error = raiseToken2InsufficientBalance
        ? i18n.tc("insufficient_balance")
        : "";
    } catch (e) {
      this.token1Error = "";
      this.token2Error = e.message;
    }
    this.rateLoading = false;
  }

  async initialLoadPrices() {
    const results = await vxm.bancor.calculateOpposingDeposit({
      id: this.pool.id,
      reserves: [
        { id: this.reserveOne.id, amount: this.amount1 },
        { id: this.reserveTwo.id, amount: this.amount2 }
      ],
      changedReserveId: this.reserveOne.id
    });
    this.setSingleUnitCosts(results.singleUnitCosts);
  }

  created() {
    this.initialLoadPrices();
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
