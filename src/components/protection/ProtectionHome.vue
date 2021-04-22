<template>
  <div>
    <b-row>
      <b-col cols="12">
        <content-block
          :title="$t('protect_tokens')"
          :tabs="true"
          :padding="false"
        >
        </content-block>
      </b-col>

      <b-col lg="6">
        <ProtectedSummary :positions="positions" />
      </b-col>
      <b-col lg="6">
        <RewardsSummary :positions="positions" />
      </b-col>

      <b-col cols="12">
        <content-block
          :padding="false"
          :px0="true"
          :shadow-light="true"
          :filters="positions.length"
          :title="
            positions.length ? $t('protected_positions') : $t('protected')
          "
          :search.sync="searchProtected"
        >
          <div v-if="loading" class="d-flex justify-content-center mt-3 pb-3">
            <b-spinner
              style="width: 3rem; height: 3rem"
              :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
              :label="`${$t('loading')}... `"
            />
          </div>
          <div
            v-else-if="!positions.length"
            class="mx-3 mt-3 pb-3 font-size-14 font-w500"
          >
            {{ $t("no_positions_found") }}
          </div>
          <div v-else>
            <ProtectedTable
              :positions="positions"
              :search="searchProtected"
              :filter-functions="[
                positionFilterFunction,
                poolsFilterFunction,
                dateFilterFunction
              ]"
            />
          </div>
          <template v-if="positions.length" #dropDowns>
            <b-dropdown
              :ref="'dropdown_' + positionFilters.id"
              :key="positionFilters.id"
              :variant="
                !positionsFiltering()
                  ? darkMode
                    ? 'muted-dark'
                    : 'muted-white-light'
                  : darkMode
                  ? 'active-dark'
                  : 'active-light'
              "
              :block="true"
              class="d-none d-lg-inline full-dropdown"
              toggle-class="block-rounded"
              :menu-class="
                darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
              "
              style="width: 220px !important"
              :no-caret="true"
            >
              <template #button-content>
                <div class="d-flex justify-content-between align-items-center">
                  {{
                    positionFilters.selectedIndex === -1
                      ? $t("all_positions")
                      : positionFilters.items[positionFilters.selectedIndex]
                          .title
                  }}
                  <div
                    v-if="positionsFiltering()"
                    class="clickable-expand"
                    @click.stop="clearPositions()"
                  >
                    <font-awesome-icon icon="times" />
                  </div>
                  <font-awesome-icon v-else icon="caret-down" />
                </div>
              </template>

              <b-dropdown-item
                :class="darkMode ? 'dropdown-item-dark' : 'dropdown-item-light'"
                v-for="(item, index) in positionFilters.items"
                :key="item.id"
                @click="positionFilters.selectedIndex = index"
              >
                {{ item.title }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown
              :ref="'dropdown_' + poolFilters.id"
              :key="poolFilters.id"
              :text="
                poolsFiltering()
                  ? poolFilters.selectedIndexes.length > 1
                    ? $t('multiple_token_pairs')
                    : poolFilters.items[poolFilters.selectedIndexes[0]].title
                  : poolFilters.items[0].title
              "
              :variant="
                !poolsFiltering()
                  ? darkMode
                    ? 'muted-dark'
                    : 'muted-white-light'
                  : darkMode
                  ? 'active-dark'
                  : 'active-light'
              "
              :block="true"
              class="d-none d-lg-inline limited-dropdown full-dropdown"
              toggle-class="block-rounded"
              :menu-class="
                darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
              "
              style="width: 220px !important"
              :no-caret="true"
            >
              <template #button-content>
                <div class="d-flex justify-content-between align-items-center">
                  {{
                    poolsFiltering()
                      ? poolFilters.selectedIndexes.length > 1
                        ? $t("multiple_token_pairs")
                        : poolFilters.items[poolFilters.selectedIndexes[0]]
                            .title
                      : poolFilters.items[0].title
                  }}
                  <div
                    v-if="poolsFiltering()"
                    class="clickable-expand"
                    @click.stop="clearPools()"
                  >
                    <font-awesome-icon icon="times" />
                  </div>
                  <font-awesome-icon v-else icon="caret-down" />
                </div>
              </template>
              <b-form-checkbox-group
                id="checkbox-group"
                v-model="poolFilters.selectedIndexes"
                name="selectedPools"
                stacked
              >
                <b-form-checkbox
                  class="d-flex align-items-center my-3 ml-3"
                  :class="darkMode ? 'checkbox-dark' : 'checkbox-light'"
                  v-for="(pool, index) in poolNames"
                  :key="pool.id"
                  :id="pool.id"
                  :value="index + 1"
                >
                  <pool-logos-overlapped :pool="pool" size="16" class="ml-2" />
                  <div
                    class="font-size-14 font-w500 ml-3"
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
            </b-dropdown>
          </template>
          <template v-if="positions.length" #date>
            <div
              :class="
                darkMode ? 'date-range-picker-dark' : 'date-range-picker-light'
              "
            >
              <date-range-picker
                ref="picker"
                :auto-apply="true"
                :ranges="false"
                single-date-picker="range"
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
                      <div
                        class="clickable-expand"
                        @click.stop="clearDateRange"
                      >
                        <font-awesome-icon icon="times" />
                      </div>
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
          </template>
          <template v-if="positions.length" #mobileFilters>
            <b-button-group v-if="anyAreFiltering">
              <b-btn variant="primary">
                <font-awesome-icon
                  icon="sliders-h"
                  @click="showMobileFilters"
                />
              </b-btn>
              <b-button
                :variant="darkMode ? 'active-alt-dark' : 'active-alt-light'"
              >
                <font-awesome-icon icon="times" @click="clearAllFilters" />
              </b-button>
            </b-button-group>

            <b-btn
              v-else
              :variant="darkMode ? 'muted-dark' : 'muted-white-light'"
            >
              <font-awesome-icon icon="sliders-h" @click="showMobileFilters" />
            </b-btn>
          </template>
        </content-block>
      </b-col>
    </b-row>

    <b-row class="closedPos">
      <b-col cols="12">
        <span
          class="font-size-20 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("closed_positions") }}
        </span>

        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("unstaking_positions") }}
        </p>
      </b-col>
      <b-col cols="12">
        <content-block :px0="true" :shadow-light="true" :title="$t('claim')">
          <claim :search="searchClaim" />
        </content-block>
      </b-col>
    </b-row>

    <modal-protected-filters
      v-model="modal"
      :initialPoolFilters="poolFilters"
      :initialDateRange="dateRange"
      :initialPosition="positionFilters.selectedIndex"
      :poolNames="poolNames"
      @confirm="setFilters"
    />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { uniqBy } from "lodash";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ProtectedTable from "@/components/protection/ProtectedTable.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Claim from "@/components/protection/Claim.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import ModalProtectedFilters from "@/components/modals/ModalProtectedFilters.vue";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import { ViewGroupedPositions, ViewProtectedLiquidity } from "@/types/bancor";
import { groupPositionsArray } from "@/api/pureHelpers";
import { buildPoolName } from "@/api/helpers";
import ProtectedSummary from "@/components/protection/ProtectedSummary.vue";
import RewardsSummary from "@/components/rewards/RewardsSummary.vue";
import dayjs from "@/utils/dayjs";

@Component({
  components: {
    RewardsSummary,
    ProtectedSummary,
    Claim,
    ContentBlock,
    ProtectedTable,
    DateRangePicker,
    ModalProtectedFilters,
    PoolLogosOverlapped
  }
})
export default class ProtectionHome extends BaseComponent {
  searchProtected = "";
  searchClaim = "";
  positionFilters = {
    id: "position",
    selectedIndex: -1,
    items: [
      { id: "1", title: i18n.t("fully_protected") },
      { id: "2", title: i18n.t("not_fully_protected") }
    ]
  };
  poolFilters: {
    id: string;
    selectedIndexes: number[];
    items: {
      id: string;
      title: string;
    }[];
  } = {
    id: "pools",
    selectedIndexes: [],
    items: [{ id: "0", title: i18n.tc("all_pools") }, ...this.poolNames]
  };
  today = dayjs();
  dateRange: {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  } = {
    startDate: null,
    endDate: null
  };
  modal: boolean = false;
  positionFilterFunction(row: ViewGroupedPositions) {
    const fullRow = this.groupedPos.find(x => x.id === row.id);
    if (fullRow) row.collapsedData = fullRow.collapsedData;
    const now = dayjs();
    let isFullyProtected: boolean = dayjs.unix(row.fullCoverage).isBefore(now);
    const selectedIndex = this.positionFilters.selectedIndex;
    if (selectedIndex === 0) {
      row.collapsedData = row.collapsedData.filter(x => {
        const before = dayjs.unix(x.fullCoverage).isBefore(now);
        if (before) isFullyProtected = true;
        return before;
      });
      return isFullyProtected;
    } else if (selectedIndex === 1) {
      row.collapsedData = row.collapsedData.filter(x => {
        const before = dayjs.unix(x.fullCoverage).isBefore(now);
        if (!before) isFullyProtected = false;
        return !before;
      });
      return !isFullyProtected;
    } else return true;
  }
  poolsFilterFunction(row: ViewGroupedPositions) {
    const pools = this.poolFilters;
    if (pools.selectedIndexes.length === 0) return true;
    return (
      pools.selectedIndexes.findIndex(
        index => pools.items[index].id === row.poolId
      ) !== -1
    );
  }
  dateFilterFunction(row: ViewGroupedPositions) {
    let isInRange: boolean = false;
    //cant use hasRange cause TS
    if (this.dateRange.startDate && this.dateRange.endDate) {
      const date = dayjs.unix(row.stake.unixTime);
      isInRange =
        date.isBefore(this.dateRange.endDate) &&
        date.isAfter(this.dateRange.startDate);
      row.collapsedData = row.collapsedData.filter(x => {
        const date = dayjs.unix(x.stake.unixTime);
        if (this.dateRange.startDate && this.dateRange.endDate)
          return (isInRange =
            date.isBefore(this.dateRange.endDate) &&
            date.isAfter(this.dateRange.startDate));
        else return true;
      });
    } else return true;
    return isInRange;
  }
  get hasRange() {
    return this.dateRange.startDate && this.dateRange.endDate;
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
  showMobileFilters() {
    this.modal = true;
  }
  positionsFiltering() {
    return this.positionFilters.selectedIndex !== -1;
  }
  poolsFiltering() {
    return this.poolFilters.selectedIndexes.length !== 0;
  }
  get anyAreFiltering() {
    return this.hasRange || this.positionsFiltering() || this.poolsFiltering();
  }
  indexSelected(index: number) {
    return this.poolFilters.selectedIndexes.includes(index);
  }
  clearPositions() {
    this.positionFilters.selectedIndex = -1;
  }
  clearPools() {
    this.poolFilters.selectedIndexes = [];
  }
  clearAllFilters() {
    this.clearPositions();
    this.clearPools();
    this.clearDateRange();
  }

  setFilters(filters: any) {
    this.positionFilters.selectedIndex = filters.positionIndex;
    this.dateRange = filters.dateRange;
    this.poolFilters.selectedIndexes = filters.selectedIndexes;
  }

  get poolNames() {
    const filteredNamedPos = uniqBy(this.groupedPos, x => x.poolId).map(
      value => ({
        id: value.poolId,
        title: buildPoolName(value.poolId),
        reserves: vxm.bancor.relay(value.poolId).reserves
      })
    );
    return filteredNamedPos;
  }

  get positions(): ViewProtectedLiquidity[] {
    return vxm.ethBancor.protectedPositions;
  }

  get groupedPos() {
    return groupPositionsArray(this.positions);
  }

  get loading() {
    if (this.currentUser) return vxm.ethBancor.loadingProtectedPositions;
    else return false;
  }

  @Watch("groupedPos")
  positionsChanged() {
    this.updatePools();
  }
  updatePools() {
    this.poolFilters.items = [
      { id: "0", title: i18n.tc("all_pools") },
      ...this.poolNames
    ];
  }

  async mounted() {
    this.updatePools();
    const scroll = this.$route.params.scroll;
    const el = this.$el.getElementsByClassName("closedPos")[0];

    if (el && scroll) el.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<style lang="scss">
.clickable-expand {
  display: inline-block;
  position: relative;
  z-index: 1;
  padding: 10px;
  margin: -10px;
}
</style>
