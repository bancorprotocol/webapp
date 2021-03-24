<template>
  <modal-base v-model="show" size="sm" @onHide="onHide">
    <div
      v-if="limitOrder"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <div class="d-flex justify-content-center mb-3">
        <div
          class="d-flex justify-content-center align-items-center bg-danger rounded-circle"
          style="width: 60px; height: 60px"
        >
          <font-awesome-icon icon="times" class="text-white" size="2x" />
        </div>
      </div>

      <div class="font-size-20 font-w600 mb-2">Cancel Transaction</div>

      <p
        class="font-size-14 mb-3 text-center"
        :class="darkMode ? 'text-muted-dark' : 'text-muted'"
      >
        You are canceling a limit order
      </p>
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

      <b-btn
        @click="initCancel"
        class="mt-2 rounded py-2 btn-block"
        variant="primary"
      >
        Confirm
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

  get rate() {
    if (!this.limitOrder) return;
    const fromSymbol = this.limitOrder.from.symbol;
    const toSymbol = this.limitOrder.to.symbol;
    const rate =
      Number(this.limitOrder.to.amount) / Number(this.limitOrder.from.amount);

    return `1 ${fromSymbol} = ${this.prettifyNumber(rate)} ${toSymbol}`;
  }

  async initCancel() {
    if (!this.limitOrder) return console.error("Item to cancel not found");
    try {
      await vxm.ethBancor.cancelOrder(this.limitOrder.id);
      addNotification({
        title: "Cancel Limit Order",
        description: "Limit Order canceled successfully.",
        status: ENotificationStatus.success
      });
    } catch (e) {
      console.error("failed to cancel limit order", e);
      addNotification({
        title: "Cancel Order",
        description: e,
        status: ENotificationStatus.error,
        showSeconds: 15
      });
    } finally {
      this.show = false;
    }
  }
}
</script>
