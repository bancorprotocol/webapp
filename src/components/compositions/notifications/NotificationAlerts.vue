<template>
  <div
    class="position-fixed m-4"
    :style="`${position}: 0; z-index: 999; max-width: 400px; width: 100%`"
  >
    <transition-group tag="div" name="alerts" appear>
      <div
        v-for="notification in alertQueue"
        :key="`alerts-${notification.id}`"
        class="notification mb-3 w-100"
      >
        <notification-details :notification="notification" :is-alert="true" />
      </div>
    </transition-group>
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

<style>
.notification {
  background: #ffffff;
  box-shadow: 0 2px 19px rgba(82, 105, 141, 0.12),
    0 2px 22px rgba(15, 89, 209, 0.12);
  border-radius: 10px;
}

.alerts-enter {
  opacity: 0;
  transform: translateY(40px);
}
.alerts-enter-active {
  transition: all 1.3s ease;
}
.alerts-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.alerts-leave-active {
  transition: all 1.3s ease;
  position: absolute; /* for move transition after item leaves */
}
.alerts-move {
  transition: all 1s ease;
}
</style>
