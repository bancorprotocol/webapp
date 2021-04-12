<template>
  <div>
    <b-btn
      v-if="orders.length > 0"
      @click="cancelAll()"
      :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
      size="sm"
    >
      Cancel All
    </b-btn>

    <modal-tx-action
      :title="title"
      icon="times"
      icon-variant="danger"
      :tx-meta="txMeta"
    >
      <p
        class="font-size-14 mb-3 text-center"
        :class="darkMode ? 'text-muted-dark' : 'text-muted'"
      >
        {{ description }}
      </p>

      <div v-if="limitOrder">
        <gray-border-block gray-bg="true">
          <label-content-split
            :label="$t('modal.limit_order.sell')"
            :value="`${prettifyNumber(limitOrder.from.amount)} ${
              limitOrder.from.symbol
            }`"
            class="mb-2"
          />
          <label-content-split
            :label="$t('modal.limit_order.receive')"
            :value="`${prettifyNumber(limitOrder.to.amount)} ${
              limitOrder.to.symbol
            }`"
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
              timer: durationTimer
            })
          }}
        </p>
      </div>
    </modal-tx-action>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import { ViewLimitOrder } from "@/store/modules/swap/ethBancor";
import {
  addNotification,
  ENotificationStatus
} from "@/components/compositions/notifications";
import { durationTimer } from "@/api/helpers";
import dayjs from "dayjs";

@Component({
  components: {
    GrayBorderBlock,
    PercentageSlider,
    LabelContentSplit,
    ModalTxAction
  }
})
export default class CancelLimitOrder extends BaseTxAction {
  limitOrder: ViewLimitOrder | null = null;

  get title() {
    return this.limitOrder
      ? this.$t("modal.cancel_order.title")
      : this.$t("modal.cancel_all_orders.title");
  }

  get description() {
    return this.limitOrder
      ? this.$t("modal.cancel_order.description")
      : this.$t("modal.cancel_all_orders.description");
  }

  get durationTimer() {
    if (!this.limitOrder) return "n/a";
    const expiryTime = dayjs.unix(this.limitOrder.expiryTime);
    const duration = dayjs.duration(expiryTime.diff(dayjs()));
    return durationTimer(duration);
  }

  get rate() {
    if (!this.limitOrder) return "";
    const fromSymbol = this.limitOrder.from.symbol;
    const toSymbol = this.limitOrder.to.symbol;
    const rate =
      Number(this.limitOrder.to.amount) / Number(this.limitOrder.from.amount);

    return `1 ${fromSymbol} = ${this.prettifyNumber(rate)} ${toSymbol}`;
  }

  async cancelById(limitOrder: ViewLimitOrder) {
    if (!limitOrder) return;
    this.limitOrder = limitOrder;
    this.openModal();

    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;

    try {
      if (!this.limitOrder) return;
      this.txMeta.success = await vxm.ethBancor.cancelOrders({
        orderIds: [this.limitOrder.id],
        onPrompt: this.onPrompt
      });
      addNotification({
        txHash: this.txMeta.success!.txId,
        title: this.$tc("notifications.add.cancel_order.title"),
        description: this.$tc("notifications.add.cancel_order.description"),
        status: ENotificationStatus.success
      });
    } catch (e) {
      console.error("failed to cancel limit order", e);
      addNotification({
        title: this.$tc("notifications.add.cancel_order.title"),
        description: this.$tc(
          "notifications.add.cancel_order.description_error"
        ),
        status: ENotificationStatus.error,
        showSeconds: 15
      });
    } finally {
      this.txMeta.showTxModal = false;
      this.txMeta.txBusy = false;
    }
  }

  get orders() {
    return vxm.ethBancor.limitOrders;
  }

  async cancelAll() {
    this.limitOrder = null;
    this.openModal();

    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;

    const orderIds = this.orders.map(x => x.id);
    try {
      this.txMeta.success = await vxm.ethBancor.cancelOrders({
        orderIds,
        onPrompt: this.onPrompt
      });
      addNotification({
        txHash: this.txMeta.success!.txId,
        title: this.$tc("notifications.add.cancel_all_orders.title"),
        description: this.$tc("notifications.add.cancel_all_orders.description")
      });
    } catch (e) {
      console.error("failed to cancel limit order", e);
      addNotification({
        title: this.$tc("notifications.add.cancel_all_orders.title"),
        description: this.$tc(
          "notifications.add.cancel_all_orders.description_error"
        ),
        status: ENotificationStatus.error,
        showSeconds: 15
      });
    } finally {
      this.txMeta.showTxModal = false;
      this.txMeta.txBusy = false;
    }
  }
}
</script>
