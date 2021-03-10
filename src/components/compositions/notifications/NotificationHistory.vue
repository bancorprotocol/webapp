<template>
  <div class="px-3">
    <div v-if="history.length">
      <div class="mb-3 font-w500 text-muted-light text-right">
        <span @click="clearAllNotifications()" class="cursor">clear</span>
      </div>
      <notification-details
        v-for="notification in history"
        :key="`history-${notification.id}`"
        :notification="notification"
        class="my-2"
        style="width: 100%"
      />
    </div>
    <div v-else class="text-center text-muted-light font-w500 mt-5">
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
