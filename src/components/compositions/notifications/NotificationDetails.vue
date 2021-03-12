<template>
  <div
    @mouseenter="mouseHover = true"
    @mouseleave="mouseHover = false"
    class="font-w400 cursor"
    @click="openUrl"
    :class="[darkMode ? 'text-dark' : 'text-light', isAlert ? 'py-2 px-3' : '']"
  >
    <div class="d-flex justify-content-start align-items-center">
      <div class="mr-2">
        <font-awesome-icon
          v-if="!mouseHover"
          :class="`text-${statusIcon.class}`"
          :icon="statusIcon.icon"
          :spin="notification.status === 'pending'"
          fixed-width
        />
        <font-awesome-icon
          v-else
          icon="external-link-alt"
          class="text-primary"
          fixed-width
        />
      </div>
      <div class="flex-fill font-w600 font-size-12">
        <div v-if="notification.txHash && mouseHover">View on Etherscan</div>
        <div v-else>
          {{ title }}
          <span
            v-if="!notification.showSeconds"
            class="font-size-12 font-w500 text-muted-light ml-2"
          >
            {{ timeAgo }}
          </span>
        </div>
      </div>
      <div
        @click="remove(notification.id)"
        class="cursor"
        :class="mouseHover ? 'text-danger' : 'text-muted-light'"
      >
        <font-awesome-icon :icon="['fal', 'times']" />
      </div>
    </div>
    <div class="my-1 ml-4 pl-1 font-size-12">
      {{ notification.description }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "@vue/composition-api";
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
import dayjs from "dayjs";
import { openNewTab } from "@/api/helpers";

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

    const title = computed(() => {
      if (notificationData.txHash) {
        switch (notificationData.status) {
          case ENotificationStatus.error:
            return "Transaction Failed";
          case ENotificationStatus.success:
            return "Transaction Successful";
          case ENotificationStatus.pending:
            return "Transaction in Process";
          case ENotificationStatus.warning:
            return "Transaction Warning";
          default:
            return "Transaction Information";
        }
      } else {
        return notificationData.title;
      }
    });

    const timeAgo = computed(() => dayjs(notificationData.timestamp).fromNow());

    const mouseHover = ref(false);

    const isRopsten = computed(
      () => vxm.ethBancor.currentNetwork === EthNetworks.Ropsten
    );
    const getEtherscanUrl = computed(
      () =>
        `https://${isRopsten ? "ropsten." : ""}etherscan.io/tx/${
          notificationData.txHash
        }`
    );

    const openUrl = () => {
      openNewTab(getEtherscanUrl.value);
    };

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
      title,
      timeAgo,
      mouseHover,
      history,
      clearAllNotifications,
      notificationData,
      interval,
      getEtherscanUrl,
      remove,
      statusIcon,
      hideAlert,
      openUrl
    };
  }
});
</script>
