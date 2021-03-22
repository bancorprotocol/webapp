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
        :class="darkMode ? 'notification-dark' : 'notification-light'"
      >
        <notification-details :notification="notification" :is-alert="true" />
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import {
  addNotification,
  alertQueue,
  ENotificationStatus
} from "@/components/compositions/notifications/index";
import NotificationDetails from "@/components/compositions/notifications/NotificationDetails.vue";
import { vxm } from "@/store";

export default defineComponent({
  props: { position: { type: String, default: "right" } },
  components: { NotificationDetails },
  setup() {
    const darkMode = computed(() => vxm.general.darkMode);

    return {
      alertQueue,
      addNotification,
      ENotificationStatus,
      darkMode
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../../../assets/_scss/custom/variables";

.notification-light {
  background: #ffffff;
  box-shadow: 0 2px 19px rgba(82, 105, 141, 0.12),
    0 2px 22px rgba(15, 89, 209, 0.12);
  border-radius: 10px;
}
.notification-dark {
  background: $text-color-light;
  box-shadow: 0 2px 19px rgba(82, 105, 141, 0.12),
    0 2px 22px rgba(15, 89, 209, 0.12);
  border-radius: 10px;
}

.alerts-enter {
  opacity: 0;
  transform: translateY(35px);
}
.alerts-enter-active {
  transition: all 1s ease;
}
.alerts-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.alerts-leave-active {
  transition: all 1s ease;
  position: absolute; /* for move transition after item leaves */
}
.alerts-move {
  transition: all 1.3s ease;
}
</style>
