<template>
  <modal-base v-model="modal" :title="$t('all_positions')" size="sm">
    <div class="d-flex justify-content-between align-items-center mb-4 mt-2">
      <b-btn
        @click="setSelectedPosition(0)"
        :variant="selectedPosition === 0 ? 'primary' : ''"
        :class="
          selectedPosition !== 0
            ? darkMode
              ? 'btn-active-dark'
              : 'btn-active-light'
            : ''
        "
      >
        {{ $t("all_positions") }}
      </b-btn>
      <b-btn
        @click="setSelectedPosition(1)"
        :variant="selectedPosition === 1 ? 'primary' : ''"
        :class="
          selectedPosition !== 1
            ? darkMode
              ? 'btn-active-dark'
              : 'btn-active-light'
            : ''
        "
      >
        {{ $t("protected") }}
      </b-btn>
      <b-btn
        @click="setSelectedPosition(2)"
        :variant="selectedPosition === 2 ? 'primary' : ''"
        :class="
          selectedPosition !== 2
            ? darkMode
              ? 'btn-active-dark'
              : 'btn-active-light'
            : ''
        "
      >
        {{ $t("not_protected") }}
      </b-btn>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div
        :class="darkMode ? 'text-dark' : 'text-light'"
        class="font-size-16 font-w500"
      >
        {{ $t("date_range") }}
      </div>
      <div
        :class="darkMode ? 'date-range-picker-dark' : 'date-range-picker-light'"
      >
        <date-range-picker
          ref="picker"
          :auto-apply="true"
          :ranges="false"
          single-date-picker="range"
          opens="left"
          v-model="dateRange"
          @update="updateDateRange"
          :control-container-class="
            hasRange
              ? darkMode
                ? 'form-control-date date-range-dark-active'
                : 'form-control-date date-range-light-active'
              : darkMode
              ? 'form-control-date date-range-dark'
              : 'form-control-date date-range-light'
          "
        >
          <template #input="picker">
            <div class="font-size-14 font-w500">
              <div
                v-if="hasRange"
                class="d-flex justify-content-between align-items-center"
              >
                <div>
                  {{ formatDateRange(picker.startDate, picker.endDate) }}
                </div>
                <font-awesome-icon icon="times" @click.stop="clearDateRange" />
              </div>
              <div
                v-else
                class="d-flex justify-content-between align-items-center"
              >
                {{ $t("date_range") }}
                <font-awesome-icon icon="caret-down" />
              </div>
            </div>
          </template>
        </date-range-picker>
      </div>
    </div>
    <b-form-checkbox-group
      id="checkbox-group"
      style="height: 150px"
      v-model="poolFilters.selectedIndexes"
      name="selectedPools"
      stacked
    >
      <b-form-checkbox
        class="d-flex align-items-center ml-2 my-2"
        :class="darkMode ? 'checkbox-dark' : 'checkbox-light'"
        v-for="(pool, index) in poolNames"
        :key="pool.id"
        :id="pool.id"
        :value="index + 1"
      >
        <pool-logos-overlapped :pool="pool" size="16" />
        <div
          class="font-size-12 font-w500 ml-2"
          :class="
            indexSelected(index + 1)
              ? darkMode
                ? 'label-active-dark'
                : 'label-active-light'
              : darkMode
              ? 'label-muted-dark'
              : 'label-muted-light'
          "
        >
          {{ pool.title }}
        </div>
      </b-form-checkbox>
    </b-form-checkbox-group>
    <div
      class="text-center text-link font-size-12 font-w400"
      @click="clearAllFilters"
    >
      {{ $t("clear_all_filters") }}
    </div>
    <main-button
      @click="onHide"
      :label="$t('confirm')"
      :large="true"
      :active="true"
      :block="true"
      class="font-size-14 font-w400 mt-3"
    />
  </modal-base>
</template>

<script lang="ts">
import { Component, Prop, VModel } from "vue-property-decorator";
import ModalBase from "@/components/modals/ModalBase.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import MainButton from "@/components/common/Button.vue";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import dayjs from "@/utils/dayjs";

@Component({
  components: {
    ModalBase,
    MainButton,
    DateRangePicker,
    PoolLogosOverlapped
  }
})
export default class ModalProtectedFilters extends BaseComponent {
  @VModel({ type: Boolean }) modal!: boolean;
  @Prop() poolFilters?: {
    id: string;
    selectedIndexes: number[];
    multiiSelect: boolean;
    items: {
      id: string;
      title: string;
    }[];
  };

  @Prop() poolNames?: {
    id: string;
    title: string;
    reserves: any;
  }[];

  dateRange: {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  } = {
    startDate: null,
    endDate: null
  };

  selectedPosition: number = 0;

  get hasRange() {
    return this.dateRange.startDate && this.dateRange.endDate;
  }

  indexSelected(index: number) {
    if (this.poolFilters)
      return this.poolFilters.selectedIndexes.includes(index);

    return false;
  }

  setSelectedPosition(index: number) {
    this.selectedPosition = index;
  }

  updateDateRange(values: { startDate: string; endDate: string }) {
    this.dateRange.startDate = dayjs(values.startDate);
    this.dateRange.endDate = dayjs(values.endDate);
  }

  clearDateRange() {
    this.dateRange.startDate = null;
    this.dateRange.endDate = null;
  }

  formatDateRange(startDate: number, endDate: number, short: boolean = false) {
    let start = new Intl.DateTimeFormat("en-GB").format(startDate);
    let end = new Intl.DateTimeFormat("en-GB").format(endDate);
    if (short) {
      start = start.slice(0, start.length - 5); //4 numbers in a year
      end = end.slice(0, end.length - 5);
    }
    return `${start} - ${end}`;
  }

  clearAllFilters() {
    this.selectedPosition = 0;
    if (this.poolFilters) this.poolFilters.selectedIndexes = [];
    this.clearDateRange();
  }

  onHide() {
    this.modal = false;
  }
}
</script>
<style lang="scss"></style>
