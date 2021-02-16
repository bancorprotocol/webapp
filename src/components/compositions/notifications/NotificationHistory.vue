<template>
  <div>
    <b-btn @click="clearAllNotifications()">clear</b-btn>

    <notification-details
      v-for="notification in history"
      :key="notification.id"
      :notification="notification"
      class="bg-danger mb-2"
      style="width: 100%"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  clearAllNotifications,
  history,
  pendingQueue
} from "@/components/compositions/notifications/index";
import NotificationDetails from "@/components/compositions/notifications/NotificationDetails.vue";

export default defineComponent({
  components: { NotificationDetails },

  setup() {
    return {
      history,
      pendingQueue,
      clearAllNotifications
    };
  }
});
</script>
