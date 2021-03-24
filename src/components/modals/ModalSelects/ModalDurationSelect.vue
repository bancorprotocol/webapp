<template>
  <modal-base :title="title" v-model="show" size="sm">
    <b-row class="d-flex justify-content-center">
      <b-col cols="12" class="text-center">
        <font-awesome-icon icon="clock" class="text-primary" size="3x" />
        <div
          :class="darkMode ? 'text-dark' : 'text-light'"
          class="font-size-20 font-w600"
        >
          {{ $t("custom_time") }}
        </div>
        <div
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          class="font-size-12 font-w400"
        >
          {{ $t("set_up_time") }}
        </div>
        <div>
          <b-dropdown
            boundary="viewport"
            :variant="darkMode ? 'outline-dark' : 'outline-light'"
            toggle-class="block-rounded"
            :menu-class="
              darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
            "
            cols="6"
            class="mt-3"
            style="width: 160px"
          >
            <template
              #button-content
              style="width: 160px"
              class="d-flex justify-content-between"
            >
              {{ `${$t("days")} ${selectedDays.asDays()}` }}
            </template>

            <b-dropdown-item
              v-for="item in 7"
              :key="item"
              @click="changeDays(item)"
              :variant="darkMode ? 'dark' : 'light'"
            >
              <div class="d-flex justify-content-between">
                {{ `${item} ${$t("days")}` }}
                <font-awesome-icon
                  v-if="selectedDays.days() === item"
                  icon="check"
                  class="mr-2 menu-icon"
                />
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div>
          <b-dropdown
            boundary="viewport"
            :variant="darkMode ? 'outline-dark' : 'outline-light'"
            toggle-class="block-rounded"
            :menu-class="
              darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
            "
            cols="6"
            class="mt-3"
            style="width: 160px"
          >
            <template #button-content>
              {{ `${$t("hours")} ${selectedHours.asHours()}` }}
            </template>

            <b-dropdown-item
              v-for="item in 24"
              :key="item"
              @click="changeHours(item)"
              :variant="darkMode ? 'dark' : 'light'"
            >
              <div class="d-flex justify-content-between">
                {{ `${item} ${$t("hours")}` }}
                <font-awesome-icon
                  v-if="selectedHours.hours() === item"
                  icon="check"
                  class="mr-2 menu-icon"
                />
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div>
          <b-dropdown
            boundary="viewport"
            :variant="darkMode ? 'outline-dark' : 'outline-light'"
            toggle-class="block-rounded"
            :menu-class="
              darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
            "
            cols="6"
            class="mt-3"
            style="width: 160px"
          >
            <template #button-content>
              {{ `${$t("minutes")} ${selectedMinutes.asMinutes()}` }}
            </template>

            <b-dropdown-item
              v-for="item in 60"
              :key="item"
              @click="changeMinutes(item)"
              :variant="darkMode ? 'dark' : 'light'"
            >
              <div class="d-flex justify-content-between">
                {{ `${item} ${$t("minutes")}` }}
                <font-awesome-icon
                  v-if="selectedMinutes.minutes() === item"
                  icon="check"
                  class="mr-2 menu-icon"
                />
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
      <b-col cols="12" class="mt-3">
        <main-button
          :label="$t('confirm')"
          :large="true"
          :active="true"
          @click="confirm()"
        />
      </b-col>
    </b-row>
  </modal-base>
</template>
<script lang="ts">
import { Component, Emit, Prop, VModel } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import MainButton from "@/components/common/Button.vue";
import dayjs from "@/utils/dayjs";
@Component({
  components: { ModalBase, MainButton }
})
export default class ModalDurationSelect extends BaseComponent {
  @VModel() show!: boolean;
  @Prop({ type: String, default: "" }) title!: string;
  selectedDays = dayjs.duration({ days: 1 });
  selectedHours = dayjs.duration({ hours: 1 });
  selectedMinutes = dayjs.duration({ minutes: 1 });
  changeDays(days: number) {
    this.selectedDays = dayjs.duration({ days });
  }
  changeHours(hours: number) {
    this.selectedHours = dayjs.duration({ hours });
  }
  changeMinutes(minutes: number) {
    this.selectedMinutes = dayjs.duration({ minutes });
  }
  @Emit("confirm")
  confirm() {
    this.show = false;
    return dayjs.duration({
      days: this.selectedDays.asDays(),
      hours: this.selectedHours.asHours(),
      minutes: this.selectedMinutes.asMinutes()
    });
  }
}
</script>

<style scoped lang="scss">
.modal-dialog-scrollable .modal-content {
  overflow: initial;
}
.modal-dialog-scrollable .modal-body {
  position: static;
}
</style>
