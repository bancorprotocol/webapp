<template>
  <div class="notification">
    <div class="d-flex justify-content-start">
      <div>
        <font-awesome-icon
          class="mx-2"
          :class="`text-${statusIcon.class}`"
          :icon="statusIcon.icon"
          :spin="notification.status === 'pending'"
          fixed-width
        />
      </div>
      <div class="flex-fill font-w600">
        {{ notification.title }}-{{ notification.id }}
      </div>
      <div @click="removeNotification(notification.id)">x</div>
    </div>
    <div>
      {{ notification.description }}
    </div>
    <div v-if="notification.txHash">
      <a :href="getEtherscanUrl" target="_blank">View on Etherscan</a>
    </div>
    <hr />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/composition-api";
import {
  clearAllNotifications,
  ENotificationStatus,
  history,
  INotificationView,
  removeNotification,
  updatePendingTx,
  hideAlert
} from "@/components/compositions/notifications/index";
import { vxm } from "@/store";
import { EthNetworks } from "@/api/web3";

export default defineComponent({
  props: {
    notification: {
      type: Object as PropType<INotificationView>,
      required: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.hideAlert(this.notification.id);
    }, (this.notificationData.showSeconds || 0) * 1000);
  },
  destroyed() {
    if (this.interval) clearInterval(this.interval);
  },
  setup(props) {
    const notificationData = props.notification as INotificationView;
    const isRopsten = computed(
      () => vxm.ethBancor.currentNetwork === EthNetworks.Ropsten
    );
    const getEtherscanUrl = computed(
      () =>
        `https://${isRopsten ? "ropsten." : ""}etherscan.io/tx/${
          notificationData.txHash
        }`
    );

    let interval: any;

    if (notificationData.status === ENotificationStatus.pending) {
      interval = setInterval(async () => {
        if (notificationData.status !== ENotificationStatus.pending) {
          return clearInterval(interval);
        }
        const txHash = notificationData.txHash;
        if (txHash) await updatePendingTx(notificationData);
      }, 2000);
    }

    const statusIcon = computed<{ icon: string; class: string }>(() => {
      switch (notificationData.status) {
        case ENotificationStatus.success:
          return {
            class: "success",
            icon: "check"
          };
        case ENotificationStatus.error:
          return {
            class: "danger",
            icon: "times"
          };
        case ENotificationStatus.warning:
          return {
            class: "warning",
            icon: "exclamation-circle"
          };
        case ENotificationStatus.pending:
          return {
            class: "secondary",
            icon: "circle-notch"
          };
        default:
          return {
            class: "info",
            icon: "info"
          };
      }
    });

    return {
      history,
      clearAllNotifications,
      notificationData,
      interval,
      getEtherscanUrl,
      removeNotification,
      statusIcon,
      hideAlert
    };
  }
});
</script>
<style scoped></style>
