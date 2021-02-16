<template>
  <div
    class="position-fixed p-4"
    :style="`${position}: 0; z-index: 999; max-width: 600px; width: 100%`"
  >
    <b-btn
      @click="
        addNotification(
          'test Title',
          'Test Description',
          ENotificationStatus.error,
          '0x9cbfc11c87f74b5eec55da593de2fd4da2819434756ab174da73911fc69c5680'
        )
      "
      type="primary"
      >Add Notification</b-btn
    >
    <div
      v-for="alert in alertQueue"
      :key="alert.id"
      class="bg-danger mb-2"
      style="width: 100%"
    >
      <span>{{ alert.id }}</span
      >-
      <span>{{ alert.title }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  alertQueue,
  addNotification,
  ENotificationStatus
} from "@/components/compositions/notifications/index";

export default defineComponent({
  props: { position: { type: String, default: "right" } },
  setup() {
    return {
      alertQueue,
      addNotification,
      ENotificationStatus
    };
  }
});
</script>
