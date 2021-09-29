<template>
  <modal-base :title="title" v-model="show" size="sm">
    <b-row class="d-flex justify-content-center">
      <b-col cols="12" class="text-center">
        <font-awesome-icon
          :icon="['far', 'clock']"
          class="icon-primary"
          size="3x"
        />
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
            :variant="darkMode ? 'outline-dark' : 'outline-light-alt'"
            toggle-class="block-rounded"
            :menu-class="
              darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
            "
            cols="6"
            class="mt-3 limited-dropdown"
            style="width: 160px"
          >
            <template
              #button-content
              style="width: 160px"
              class="d-flex justify-content-between"
            >
              {{ $tc("days", selectedDays.asDays()) }}
            </template>

            <b-dropdown-item
              v-for="item in maxDays + 1"
              :key="item"
              @click="changeDays(item - 1)"
              :variant="darkMode ? 'dark' : 'light'"
            >
              <div class="d-flex justify-content-between">
                {{ $tc("days", item - 1) }}
                <font-awesome-icon
                  v-if="selectedDays.days() === item - 1"
                  icon="check"
                  class="mr-2 menu-icon"
                />
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div>
          <b-dropdown
            :variant="darkMode ? 'outline-dark' : 'outline-light-alt'"
            toggle-class="block-rounded"
            :menu-class="
              darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
            "
            cols="6"
            class="mt-3 limited-dropdown"
            style="width: 160px"
          >
            <template #button-content>
              {{ $tc("hours", selectedHours.asHours()) }}
            </template>

            <b-dropdown-item
              v-for="item in 24"
              :key="item"
              @click="changeHours(item - 1)"
              :variant="darkMode ? 'dark' : 'light'"
            >
              <div class="d-flex justify-content-between">
                {{ $tc("hours", item - 1) }}
                <font-awesome-icon
                  v-if="selectedHours.hours() === item - 1"
                  icon="check"
                  class="mr-2 menu-icon"
                />
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div>
          <b-dropdown
            :variant="darkMode ? 'outline-dark' : 'outline-light-alt'"
            toggle-class="block-rounded"
            :menu-class="
              darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
            "
            class="mt-3 limited-dropdown"
            cols="6"
            style="width: 160px"
          >
            <template #button-content>
              {{ $tc("minutes", selectedMinutes.asMinutes()) }}
            </template>

            <b-dropdown-item
              v-for="item in 60"
              :key="item"
              @click="changeMinutes(item - 1)"
              :variant="darkMode ? 'dark' : 'light'"
            >
              <div class="d-flex justify-content-between">
                {{ $tc("minutes", item - 1) }}
                <font-awesome-icon
                  v-if="selectedMinutes.minutes() === item - 1"
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
  @Prop() initialDuration!: plugin.Duration;
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ default: 30 }) maxDays!: number;

  selectedDays = dayjs.duration({ days: this.initialDuration.days() });
  selectedHours = dayjs.duration({ hours: this.initialDuration.hours() });
  selectedMinutes = dayjs.duration({
    minutes: this.initialDuration.minutes()
  });

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
    const days: number = this.selectedDays.asDays();
    const hours: number = this.selectedHours.asHours();
    const minutes: number = this.selectedMinutes.asMinutes();
    if (days === 0 && hours === 0 && minutes === 0) return this.initialDuration;

    return dayjs.duration({
      days: days,
      hours: days === this.maxDays ? 0 : hours,
      minutes: days === this.maxDays ? 0 : minutes
    });
  }
}
</script>

<style lang="scss"></style>
