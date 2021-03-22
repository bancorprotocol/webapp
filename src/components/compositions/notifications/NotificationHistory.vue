<template>
  <div class="px-2">
    <div
      class="d-flex justify-content-between font-w600 text-right text-light align-items-end"
    >
      <span :class="darkMode ? 'text-dark' : 'text-light'">
        {{ $t("notifications.title") }}
      </span>
      <span
        @click="clearAllNotifications()"
        class="cursor font-size-12"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        <u>{{ $t("notifications.buttons.clear") }}</u>
      </span>
    </div>

    <hr class="mt-2 mb-3" />

    <div v-if="history.length">
      <div
        v-for="(notification, index) in history"
        :key="`history-${notification.id}`"
      >
        <notification-details
          :notification="notification"
          style="width: 100%"
        />
        <hr v-if="index + 1 < history.length" class="my-3" />
      </div>
    </div>
    <div v-else class="text-center text-muted-light font-w400 font-size-14">
      {{ $t("notifications.nothing_here") }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import {
  addNotification,
  clearAllNotifications,
  history,
  pendingQueue
} from "@/components/compositions/notifications/index";
import NotificationDetails from "@/components/compositions/notifications/NotificationDetails.vue";
import { vxm } from "@/store";

export default defineComponent({
  components: { NotificationDetails },

  setup() {
    const darkMode = computed(() => vxm.general.darkMode);

    return {
      history,
      pendingQueue,
      clearAllNotifications,
      addNotification,
      darkMode
    };
  }
});
</script>
