<template>
  <div>
    <b-dropdown
      id="dropdown-menu"
      right
      :variant="darkMode ? 'outline-dark' : 'outline-light'"
      size="sm"
      toggle-class="block-rounded"
      :menu-class="darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'"
      no-caret
    >
      <template #button-content>
        <font-awesome-icon
          v-if="pendingQueue.length === 0"
          icon="bell"
          fixed-width
        />
        <font-awesome-icon v-else icon="circle-notch" spin fixed-width />
      </template>

      <b-dropdown-text
        :variant="darkMode ? 'dark' : 'light'"
        style="width: 400px; max-height: 80vh"
        class="overflow-auto"
      >
        <NotificationHistory />
      </b-dropdown-text>
    </b-dropdown>

    <NotificationAlerts />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import {
  addNotification,
  ENotificationStatus,
  history,
  loadLocalHistory,
  pendingQueue
} from "@/components/compositions/notifications/index";
import { vxm } from "@/store";
import NotificationAlerts from "@/components/compositions/notifications/NotificationAlerts.vue";
import NotificationHistory from "@/components/compositions/notifications/NotificationHistory.vue";

export default defineComponent({
  props: { position: { type: String, default: "right" } },
  components: { NotificationHistory, NotificationAlerts },
  setup() {
    loadLocalHistory();

    const darkMode = computed(() => vxm.general.darkMode);

    return {
      history,
      pendingQueue,
      addNotification,
      ENotificationStatus,
      darkMode
    };
  }
});
</script>
