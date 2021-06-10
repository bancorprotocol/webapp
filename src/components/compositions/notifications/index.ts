import { computed, ref, watch } from "@vue/composition-api";
import { web3 } from "@/api/web3";

const maxLimit = 100;
const defaultShowSeconds = 7;

export enum ENotificationStatus {
  success = "success",
  info = "info",
  warning = "warning",
  error = "error",
  pending = "pending"
}

export interface INotificationView {
  id: number;
  status: ENotificationStatus;
  title: string;
  description: string;
  txHash?: string;
  timestamp: Date;
  showSeconds?: number;
  alertOnly?: boolean;
}
export interface IAddNotification {
  title: string;
  description: string;
  status?: ENotificationStatus;
  txHash?: string;
  showSeconds?: number;
  alertOnly?: boolean;
}

export const history = ref<INotificationView[]>([]);

export const alertQueue = computed(() =>
  history.value.filter(n => n.showSeconds).reverse()
);

export const pendingQueue = computed(() =>
  history.value.filter(n => n.status === ENotificationStatus.pending)
);

export const addNotification = (payload: IAddNotification): void => {
  const {
    title,
    description,
    status,
    txHash,
    showSeconds,
    alertOnly
  } = payload;

  const notification: INotificationView = {
    id: Date.now(),
    status: status ?? ENotificationStatus.info,
    title,
    description,
    txHash,
    showSeconds: showSeconds ?? defaultShowSeconds,
    alertOnly,
    timestamp: new Date()
  };

  if (txHash) notification.status = ENotificationStatus.pending;

  history.value.unshift(notification);

  if (history.value.length > maxLimit) history.value.pop();
};

export const removeNotification = (id: number): void => {
  const index = history.value.map(n => n.id).indexOf(id);

  if (index >= 0) history.value.splice(index, 1);
  else console.error("Error: Remove Notification - ID not found.");
};

export const hideAlert = (id: number): void => {
  const index = history.value.map(n => n.id).indexOf(id);

  if (index >= 0) {
    if (history.value[index].alertOnly) history.value.splice(index, 1);
    else history.value[index].showSeconds = undefined;
  } else console.error("Error: Hide Alert - ID not found.");
};

export const clearAllNotifications = (): void => {
  history.value = [];
};

export const getTxStatus = async (hash: string): Promise<boolean | null> => {
  try {
    console.count("txStatus");
    console.log("attempting hash", hash);
    const tx = await web3.eth.getTransactionReceipt(hash);
    if (tx) return tx.status;
    else return null;
  } catch (e) {
    console.error(`web3 failed: getTransactionReceipt(${hash})`, e);
    throw e;
  }
};

export const updatePendingTx = async (
  notification: INotificationView
): Promise<void> => {
  try {
    const status = await getTxStatus(notification.txHash!);
    if (status === null) return;

    // set status if not null
    if (status) notification.status = ENotificationStatus.success;
    else notification.status = ENotificationStatus.error;

    // find history index
    const index = history.value.map(n => n.txHash).indexOf(notification.txHash);

    // Stop here if not found
    if (index < 0)
      return console.error("Notification Error: Tx Hash not found");

    // update history and show alert again
    history.value[index].status = notification.status;
    history.value[index].showSeconds = defaultShowSeconds;
  } catch (e) {
    console.error("Notification Error: updatePendingTx", e);
    throw e;
  }
};

export const loadLocalHistory = () => {
  const raw = localStorage.getItem("notification_history");
  if (!raw) return;
  const restored = JSON.parse(raw);
  if (restored.length) history.value = restored;
};

watch(
  history,
  (history: INotificationView[]) => {
    localStorage.setItem("notification_history", JSON.stringify(history));
  },
  { deep: true }
);
