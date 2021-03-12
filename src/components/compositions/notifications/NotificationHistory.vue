<template>
  <div class="px-2">
    <div class="d-flex justify-content-between font-w600 text-right text-light">
      <span>Notifications</span>
      <span
        @click="clearAllNotifications()"
        class="cursor text-muted-light font-size-12"
      >
        clear
      </span>
    </div>
    <div v-if="history.length">
      <div v-for="notification in history" :key="`history-${notification.id}`">
        <hr class="my-3" />
        <notification-details
          :notification="notification"
          style="width: 100%"
        />
      </div>
    </div>
    <div
      v-else
      class="text-center text-muted-light font-w400 font-size-12 mt-3"
    >
      Nothing here yet.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  clearAllNotifications,
  history,
  pendingQueue,
  addNotification
} from "@/components/compositions/notifications/index";
import NotificationDetails from "@/components/compositions/notifications/NotificationDetails.vue";

export default defineComponent({
  components: { NotificationDetails },

  setup() {
    return {
      history,
      pendingQueue,
      clearAllNotifications,
      addNotification
    };
  }
});
</script>
