<template>
  <div>
    <b-btn
      @click="addNotification('Test Title', 'Description goes here', 'success')"
      size="sm"
      class="mr-2"
    >
      All
    </b-btn>
    <div v-if="history.length">
      <div class="d-flex justify-content-between">
        <div>
          <b-btn @click="addNotification('Test Title')" size="sm" class="mr-2">
            default
          </b-btn>
          <b-btn
            @click="
              addNotification('Test Title', 'Description goes here', 'pending')
            "
            size="sm"
            class="mr-2"
          >
            pending
          </b-btn>
          <b-btn
            @click="
              addNotification('Test Title', 'Description goes here', 'success')
            "
            size="sm"
            class="mr-2"
          >
            success
          </b-btn>
          <b-btn
            @click="
              addNotification('Test Title', 'Description goes here', 'warning')
            "
            size="sm"
          >
            warning
          </b-btn>
          <b-btn
            @click="
              addNotification('Test Title', 'Description goes here', 'error')
            "
            size="sm"
          >
            error
          </b-btn>
        </div>

        <b-btn @click="clearAllNotifications()" size="sm">clear</b-btn>
      </div>
      <notification-details
        v-for="notification in history"
        :key="`history-${notification.id}`"
        :notification="notification"
        class="my-2"
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
