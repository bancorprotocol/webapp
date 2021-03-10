<template>
  <div>
    <b-btn
      size="sm"
      :variant="darkMode ? 'outline-dark' : 'outline-light'"
      v-b-toggle.sidebar-notifications
    >
      <font-awesome-icon
        v-if="pendingQueue.length === 0"
        icon="bell-on"
        fixed-width
      />
      <font-awesome-icon v-else icon="circle-notch" spin fixed-width />
    </b-btn>

    <b-sidebar
      id="sidebar-notifications"
      shadow
      right
      title="Notification Center"
      bg-variant="white"
      text-variant="light"
      backdrop-variant="transparent"
      width="400px"
      backdrop
    >
      <NotificationHistory />
    </b-sidebar>

    <NotificationAlerts />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  addNotification,
  ENotificationStatus,
  history,
  loadLocalHistory,
  pendingQueue
} from "@/components/compositions/notifications/index";
import { vxm } from "@/store";
import NotificationAlerts from "@/components/compositions/notifications/NotificationAlerts.vue";
import NotificationHistory from "@/components/compositions/notifications/NotificationHistory.vue";

export default defineComponent({
  props: { position: { type: String, default: "right" } },
  components: { NotificationHistory, NotificationAlerts },
  computed: {
    darkMode() {
      return vxm.general.darkMode;
    }
  },
  setup() {
    loadLocalHistory();
    return {
      history,
      pendingQueue,
      addNotification,
      ENotificationStatus
    };
  }
});
</script>
