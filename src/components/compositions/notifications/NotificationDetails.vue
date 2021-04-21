<template>
  <div
    @mouseenter="changeHover(true)"
    @mouseleave="changeHover(false)"
    class="font-w400"
    :class="[
      { cursor: notification.txHash },
      darkMode ? 'text-dark' : 'text-light',
      isAlert ? 'py-2 px-3' : ''
    ]"
  >
    <div class="d-flex justify-content-start">
      <div @click="openUrl" class="pr-2">
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
          :class="darkMode ? 'text-dark' : 'text-primary'"
          fixed-width
        />
      </div>
      <div @click="openUrl" class="flex-fill font-size-12">
        <div class="font-w600 pt-1">
          <div v-if="notification.txHash && mouseHover">View on Etherscan</div>
          <div v-else>
            {{ title }}
            <span
              v-if="!notification.showSeconds"
              class="font-size-12 font-w400 text-muted-light ml-1"
            >
              {{ timeAgo }}
            </span>
          </div>
        </div>
        <div class="my-1">
          {{ notification.description }}
        </div>
      </div>
      <div
        @click.stop="remove(notification.id)"
        class="cursor"
        :class="mouseHover ? 'text-danger' : 'text-muted-light'"
      >
        <font-awesome-icon :icon="['fal', 'times']" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref
} from "@vue/composition-api";
import {
  clearAllNotifications,
  ENotificationStatus,
  hideAlert,
  history,
  INotificationView,
  removeNotification,
  updatePendingTx
} from "@/components/compositions/notifications/index";
import { vxm } from "@/store";
import { generateEtherscanTxLink } from "@/api/helpers";
import { EthNetworks } from "@/api/web3";
import dayjs from "dayjs";

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
  setup(props) {
    const title = computed(() => {
      return props.notification.title;
    });

    const timeAgo = computed(() =>
      dayjs(props.notification.timestamp).fromNow()
    );

    const mouseHover = ref(false);

    const isRopsten = computed(
      () => vxm.ethBancor.currentNetwork === EthNetworks.Ropsten
    );

    const openUrl = () => {
      if (!props.notification.txHash) return;
      window.open(
        generateEtherscanTxLink(props.notification.txHash, isRopsten.value),
        "_blank"
      );
    };

    const remove = (id: number) => {
      if (props.isAlert) hideAlert(id);
      else removeNotification(id);
    };

    const changeHover = (state: boolean) => {
      if (!props.notification.txHash) return;
      mouseHover.value = state;
    };

    let interval: any;

    if (props.notification.status === ENotificationStatus.pending) {
      interval = setInterval(async () => {
        if (props.notification.status !== ENotificationStatus.pending) {
          return clearInterval(interval);
        }
        const txHash = props.notification.txHash;
        if (txHash) await updatePendingTx(props.notification);
      }, 2000);
    }

    const statusIcon = computed<{ icon: string; class: string }>(() => {
      switch (props.notification.status) {
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

    const darkMode = computed(() => vxm.general.darkMode);

    onMounted(() => {
      setTimeout(() => {
        hideAlert(props.notification.id);
      }, (props.notification.showSeconds || 0) * 1000);
    });

    onUnmounted(() => {
      if (interval) clearInterval(interval);
    });

    return {
      title,
      timeAgo,
      mouseHover,
      history,
      clearAllNotifications,
      remove,
      statusIcon,
      hideAlert,
      openUrl,
      darkMode,
      changeHover
    };
  }
});
</script>
