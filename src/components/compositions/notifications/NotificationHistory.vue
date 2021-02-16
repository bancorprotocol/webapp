<template>
  <div>
    <div v-if="history.length">
      <div class="d-flex justify-content-between">
        <div>
          <b-btn size="sm" class="mr-2">All</b-btn>
          <b-btn size="sm" class="mr-2">pending</b-btn>
          <b-btn size="sm" class="mr-2">success</b-btn>
          <b-btn size="sm" class="mr-2">info</b-btn>
          <b-btn size="sm">error</b-btn>
        </div>

        <b-btn @click="clearAllNotifications()" size="sm">clear</b-btn>
      </div>
      <notification-details
        v-for="notification in history"
        :key="notification.id"
        :notification="notification"
        class="mb-2"
        style="width: 100%"
      />
    </div>
    <div v-else class="text-center text-muted-light">No Notifications yet</div>
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
