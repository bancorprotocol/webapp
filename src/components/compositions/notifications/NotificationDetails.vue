<template>
  <div
    class="notification py-2 px-3 font-w400"
    :class="darkMode ? 'text-dark' : 'text-light'"
  >
    <div class="d-flex justify-content-start align-items-center">
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
        {{ notification.title }}
      </div>
      <div class="font-size-12 font-w500 text-muted-light mr-3">5 min</div>
      <div @click="remove(notification.id)">
        <font-awesome-icon icon="times" />
      </div>
    </div>
    <div class="my-2">
      {{ notification.description }}
    </div>
    <div v-if="notification.txHash">
      <a :href="getEtherscanUrl" target="_blank">View on Etherscan</a>
    </div>
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
    },
    isAlert: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    darkMode() {
      return vxm.general.darkMode;
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

    const remove = (id: number) => {
      if (props.isAlert) hideAlert(id);
      else removeNotification(id);
    };

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
      remove,
      statusIcon,
      hideAlert
    };
  }
});
</script>
<style scoped>
.notification {
  background: #ffffff;
  box-shadow: 0px 2px 19px rgba(82, 105, 141, 0.12),
    0px 2px 22px rgba(15, 89, 209, 0.12);
  border-radius: 8px;
}
</style>
