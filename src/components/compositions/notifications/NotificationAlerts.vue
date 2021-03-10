<template>
  <div
    class="position-fixed p-4"
    :style="`${position}: 0; z-index: 999; max-width: 500px; width: 100%`"
  >
    <notification-details
      v-for="notification in alertQueue"
      :key="`alerts-${notification.id}`"
      :notification="notification"
      :is-alert="true"
      class="mb-3"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  alertQueue,
  addNotification,
  ENotificationStatus
} from "@/components/compositions/notifications/index";
import NotificationDetails from "@/components/compositions/notifications/NotificationDetails.vue";

export default defineComponent({
  props: { position: { type: String, default: "right" } },
  components: { NotificationDetails },
  setup() {
    return {
      alertQueue,
      addNotification,
      ENotificationStatus
    };
  }
});
</script>
