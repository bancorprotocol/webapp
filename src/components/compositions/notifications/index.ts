import { computed, ref } from "@vue/composition-api";
import { web3 } from "@/api/web3";

export enum ENotificationStatus {
  error = "error",
  success = "success",
  info = "info",
  pending = "pending",
  loading = "loading"
}

export interface INotificationView {
  id: number;
  status: ENotificationStatus;
  title: string;
  description: string;
  txHash?: string;
  timestamp: Date;
}

export const history = ref<INotificationView[]>([]);
export const alertQueue = ref<INotificationView[]>([]);
export const pendingQueue = computed(() =>
  history.value.filter(n => n.status === ENotificationStatus.pending)
);

export const addNotification = async (
  title: string,
  description: string,
  status: ENotificationStatus = ENotificationStatus.info,
  txHash?: string,
  showToast: boolean = true
) => {
  const notification: INotificationView = {
    id: history.value.length,
    status,
    title,
    description,
    txHash,
    timestamp: new Date()
  };

  if (showToast) addToQueue(notification);

  if (txHash) {
    notification.status = ENotificationStatus.pending;
  }

  history.value.unshift(notification);
};

export const addToQueue = (notification: INotificationView) => {
  alertQueue.value.push(notification);
  setTimeout(() => {
    alertQueue.value.shift();
  }, 5000);
};

export const clearAllNotifications = () => {
  history.value = [];
  alertQueue.value = [];
};

export const getTxStatus = async (hash: string) => {
  try {
    const tx = await web3.eth.getTransactionReceipt(hash);
    if (tx) return tx.status;
    else return null;
  } catch (e) {
    console.error(" - web3 failed: getTransactionReceipt - ", e);
    throw e;
  }
};

export const updatePendingTx = async (notification: INotificationView) => {
  const status = await getTxStatus(notification.txHash!);

  if (status !== null) {
    // set status
    if (status) notification.status = ENotificationStatus.success;
    else notification.status = ENotificationStatus.error;

    // update history
    const historyIndex = history.value
      .map(n => {
        return n.txHash;
      })
      .indexOf(notification.txHash);
    history.value[historyIndex] = notification;
  }
};
