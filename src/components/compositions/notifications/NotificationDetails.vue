<template>
  <pre :class="`bg-${notificationData.status}`">{{ notificationData }}</pre>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  clearAllNotifications,
  ENotificationStatus,
  history,
  INotificationView,
  updatePendingTx
} from "@/components/compositions/notifications/index";

export default defineComponent({
  props: {
    notification: {
      // type: Object as PropType<INotificationView>
      type: Object
    }
  },
  destroyed() {
    if (this.interval) clearInterval(this.interval);
  },
  setup(props) {
    const notificationData = props.notification as INotificationView;

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

    return {
      history,
      clearAllNotifications,
      notificationData,
      interval
    };
  }
});
</script>
