<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div>
          <span
            class="font-size-20 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            {{ $t("liquidity_protection") }}
          </span>
        </div>

        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("protect_tokens") }}
        </p>
      </b-col>

      <b-col lg="6">
        <ProtectedSummary :positions="positions" />
      </b-col>
      <b-col lg="6">
        <RewardsSummary :positions="positions" />
      </b-col>

      <b-col cols="12">
        <content-block
          search-style="width: 200px !important"
          :px0="true"
          :shadow-light="true"
          :title="
            positions.length ? $t('protected_positions') : $t('protected')
          "
          :search.sync="searchProtected"
          :drop-down-filters="positions.length ? dropDownFilters : []"
        >
          <div v-if="loading" class="d-flex justify-content-center mt-3">
            <b-spinner
              style="width: 3rem; height: 3rem"
              class="text-primary"
              :label="`${$t('loading')}... `"
            />
          </div>
          <div
            v-else-if="!positions.length"
            class="mx-3 mt-3 font-size-14 font-w500"
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
          <template v-if="positions.length" #date>
            <div
              :class="
                darkMode ? 'date-range-picker-dark' : 'date-range-picker-light'
              "
            >
              <date-range-picker
                style="width: 200px !important; height: 35px !important"
                ref="picker"
                :auto-apply="true"
                :ranges="false"
                single-date-picker="range"
                v-model="dateRange"
                class="dark-date"
                @update="updateDateRange"
                :control-container-class="
                  darkMode
                    ? 'form-control date-range-dark'
                    : 'form-control date-range-light'
                "
              >
                <template #input="picker">
                  <div class="d-lg-none">
                    {{
                      formatDateRange(picker.startDate, picker.endDate, true)
                    }}
                  </div>
                  <div class="d-none d-lg-inline font-size-12 font-w400">
                    <div
                      v-if="hasRange"
                      class="d-flex justify-content-between align-items-center"
                      :class="darkMode ? 'active-dark' : 'active-light'"
                    >
                      {{ formatDateRange(picker.startDate, picker.endDate) }}
                      <font-awesome-icon
                        icon="times"
                        @click.stop="clearDateRange"
                      />
                    </div>
                    <div
                      v-else
                      class="d-flex justify-content-between align-items-center"
                      :class="darkMode ? 'muted-dark' : 'muted-light'"
                    >
                      {{ $t("date_range") }}
                      <font-awesome-icon icon="caret-down" />
                    </div>
                  </div>
                </template>
              </date-range-picker>
            </div>
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
  </b-container>
</template>

<script lang="ts">
import { uniqBy } from "lodash";
import { Component, Watch } from "vue-property-decorator";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ProtectedTable from "@/components/protection/ProtectedTable.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Claim from "@/components/protection/Claim.vue";
import BaseComponent from "@/components/BaseComponent.vue";
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
    DateRangePicker
  }
})
export default class ProtectionHome extends BaseComponent {
  searchProtected = "";
  searchClaim = "";
  dropDownFilters = [
    {
      id: "position",
      selectedIndex: 0,
      items: [
        { id: "0", title: i18n.t("all_positions") },
        { id: "1", title: i18n.t("fully_protected") },
        { id: "2", title: i18n.t("not_fully_protected") }
      ]
    },
    {
      id: "pools",
      selectedIndex: 0,
      items: [{ id: "0", title: i18n.t("all_pools") }, ...this.poolNames]
    }
  ];
  today = dayjs();
  dateRange: {
    startDate: dayjs.Dayjs | null;
    endDate: dayjs.Dayjs | null;
  } = {
    startDate: null,
    endDate: null
  };

  positionFilterFunction(row: ViewGroupedPositions) {
    const fullRow = this.groupedPos.find(x => x.id === row.id);
    if (fullRow) row.collapsedData = fullRow.collapsedData;

    const now = dayjs();
    let isFullyProtected: boolean = dayjs.unix(row.fullCoverage).isBefore(now);

    const selectedIndex = this.dropDownFilters[0].selectedIndex;
    if (selectedIndex == 1) {
      row.collapsedData = row.collapsedData.filter(x => {
        const before = dayjs.unix(x.fullCoverage).isBefore(now);
        if (before) isFullyProtected = true;
        return before;
      });
      return isFullyProtected;
    } else if (selectedIndex == 2) {
      row.collapsedData = row.collapsedData.filter(x => {
        const before = dayjs.unix(x.fullCoverage).isBefore(now);
        if (!before) isFullyProtected = false;
        return !before;
      });
      return !isFullyProtected;
    } else return true;
  }

  poolsFilterFunction(row: ViewGroupedPositions) {
    const pools = this.dropDownFilters[1];
    if (pools.selectedIndex == 0) return true;

    const pool = this.poolNames[pools.selectedIndex - 1];
    return pool.id === row.poolId;
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

  get poolNames() {
    const filteredNamedPos = uniqBy(this.groupedPos, x => x.poolId).map(
      value => ({
        id: value.poolId,
        title: buildPoolName(value.poolId)
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
    this.updateDropdownFilters();
  }

  updateDropdownFilters() {
    this.dropDownFilters[1].items = [
      { id: "0", title: i18n.t("all_pools") },
      ...this.poolNames
    ];
  }

  async mounted() {
    this.updateDropdownFilters();
    const scroll = this.$route.params.scroll;
    const el = this.$el.getElementsByClassName("closedPos")[0];

    if (el && scroll) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}
</script>
