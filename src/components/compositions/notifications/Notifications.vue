<template>
  <div>
    <b-dropdown
      id="dropdown-activity"
      right
      :variant="darkMode ? 'outline-dark' : 'outline-light'"
      size="sm"
      toggle-class="block-rounded"
      :menu-class="darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'"
      no-caret
    >
      <template #button-content>
        <font-awesome-icon icon="cog" fixed-width />
      </template>

      <b-dropdown-text
        style="width: 500px"
        :variant="darkMode ? 'dark' : 'light'"
      >
        <NotificationHistory />
      </b-dropdown-text>
    </b-dropdown>

    <NotificationAlerts />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import {
  alertQueue,
  addNotification,
  ENotificationStatus,
  loadLocalHistory
} from "@/components/compositions/notifications/index";
import NotificationHistory from "@/components/compositions/notifications/NotificationHistory.vue";
import { vxm } from "@/store";
import NotificationAlerts from "@/components/compositions/notifications/NotificationAlerts.vue";

export default defineComponent({
  props: { position: { type: String, default: "right" } },
  components: { NotificationHistory, NotificationAlerts },
  computed: {
    darkMode() {
      return vxm.general.darkMode;
    }
  },
  setup() {
    loadLocalHistory();
    return {
      alertQueue,
      addNotification,
      ENotificationStatus
    };
  }
});
</script>
