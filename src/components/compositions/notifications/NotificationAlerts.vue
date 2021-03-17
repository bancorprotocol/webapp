<template>
  <div
    class="position-fixed p-4"
    :style="`${position}: 0; z-index: 999; max-width: 400px; width: 100%`"
  >
    <transition name="fade">
      <div
        v-for="notification in alertQueue"
        :key="`alerts-${notification.id}`"
        class="notification mb-3"
      >
        <notification-details :notification="notification" :is-alert="true" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  addNotification,
  alertQueue,
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

<style scoped>
.notification {
  background: #ffffff;
  box-shadow: 0 2px 19px rgba(82, 105, 141, 0.12),
    0 2px 22px rgba(15, 89, 209, 0.12);
  border-radius: 10px;
}
</style>
