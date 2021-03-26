<template>
  <modal-base v-model="show" size="sm">
    <div class="text-center" :class="darkMode ? 'text-dark' : 'text-light'">
      <div class="d-flex justify-content-center mb-3">
        <div
          class="d-flex justify-content-center align-items-center bg-danger rounded-circle"
          style="width: 60px; height: 60px"
        >
          <font-awesome-icon icon="times" class="text-white" size="2x" />
        </div>
      </div>

      <div class="font-size-20 font-w600 mb-2">{{ title }}</div>

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
              timer: "?????"
            })
          }}
        </p>
      </div>

      <b-btn
        @click="initCancel"
        class="mt-2 rounded py-2 btn-block"
        variant="primary"
        :disabled="txBusy"
      >
        <font-awesome-icon v-if="txBusy" icon="circle-notch" spin />
        <span v-else>{{ $t("button.confirm") }}</span>
      </b-btn>
    </div>
  </modal-base>
</template>
<script lang="ts">
import { Component, Emit, Prop, VModel } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import MainButton from "@/components/common/Button.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { ViewLimitOrder } from "@/store/modules/swap/ethBancor";
import { vxm } from "@/store";
import {
  addNotification,
  ENotificationStatus
} from "@/components/compositions/notifications";

@Component({
  components: { LabelContentSplit, GrayBorderBlock, ModalBase, MainButton }
})
export default class ModalCancelOrder extends BaseComponent {
  @VModel() show!: boolean;
  @Prop() limitOrder!: ViewLimitOrder | null;

  txBusy = false;

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

  get rate() {
    if (!this.limitOrder) return "";
    const fromSymbol = this.limitOrder.from.symbol;
    const toSymbol = this.limitOrder.to.symbol;
    const rate =
      Number(this.limitOrder.to.amount) / Number(this.limitOrder.from.amount);

    return `1 ${fromSymbol} = ${this.prettifyNumber(rate)} ${toSymbol}`;
  }

  async initCancel() {
    this.txBusy = true;
    if (this.limitOrder) await this.cancelById();
    else await this.cancelAll();
    this.txBusy = false;
  }

  async cancelById() {
    if (!this.limitOrder) return;
    try {
      const { txId } = await vxm.ethBancor.cancelOrders([this.limitOrder.id]);
      addNotification({
        txHash: txId,
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
      this.show = false;
    }
  }

  async cancelAll() {
    const allOrderIds = vxm.ethBancor.limitOrders.map(x => x.id);
    try {
      const { txId } = await vxm.ethBancor.cancelOrders(allOrderIds);
      addNotification({
        txHash: txId,
        title: this.$tc("notifications.add.cancel_all_orders.title"),
        description: this.$tc(
          "notifications.add.cancel_all_orders.description"
        ),
        status: ENotificationStatus.success
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
      this.show = false;
    }
  }
}
</script>
