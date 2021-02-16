<template>
  <div
    class="position-fixed p-4"
    :style="`${position}: 0; z-index: 999; max-width: 600px; width: 100%`"
  >
    <notification-details
      v-for="notification in alertQueue"
      :key="notification.id"
      :notification="notification"
      class="mb-2"
      style="width: 100%"
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
