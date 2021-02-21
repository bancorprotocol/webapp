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
          :px0="true"
          :shadow-light="true"
          :title="
            positions.length ? $t('protected_positions') : $t('protected')
          "
          :search.sync="searchProtected"
          :dropDownFilters="positions.length ? dropDownFilters : []"
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
              :filter-functions="[positionFilterFunction, poolsFilterFunction]"
            />
          </div>
          <template v-if="positions.length" #date>
            <date-range-picker
              ref="picker"
              :autoApply="true"
              :ranges="false"
              singleDatePicker="range"
              v-model="dateRange"
              @update="updateDateRange"
            >
              <template #input="picker">
                {{ formatDate(picker.startDate) }} -
                {{ formatDate(picker.endDate) }}
              </template>
            </date-range-picker>
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
import { Component } from "vue-property-decorator";
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
  groupedPos = groupPositionsArray(vxm.ethBancor.protectedPositions);
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
  dateRange = {
    startDate: this.today.subtract(30, "days"),
    endDate: this.today
  };

  positionFilterFunction(row: ViewGroupedPositions) {
    const fullRow = this.groupedPos.find(x => x.id === row.id);
    if (fullRow) row.collapsedData = fullRow.collapsedData;

    const now = dayjs();
    const isFullyProtected: boolean = dayjs
      .unix(row.fullCoverage)
      .isBefore(now);

    const selectedIndex = this.dropDownFilters[0].selectedIndex;
    if (selectedIndex == 1) {
      row.collapsedData = row.collapsedData.filter(x =>
        dayjs.unix(x.fullCoverage).isBefore(now)
      );
      return isFullyProtected;
    } else if (selectedIndex == 2) {
      row.collapsedData = row.collapsedData.filter(
        x => !dayjs.unix(x.fullCoverage).isBefore(now)
      );
      return !isFullyProtected;
    } else return true;
  }

  poolsFilterFunction(row: ViewGroupedPositions) {
    const pools = this.dropDownFilters[1];
    if (pools.selectedIndex == 0) return true;

    const pool = this.poolNames[pools.selectedIndex - 1];
    return pool.id === row.poolId;
  }

  updateDateRange(values: { startDate: string; endDate: string }) {
    this.dateRange.startDate = dayjs(values.startDate);
    this.dateRange.endDate = dayjs(values.endDate);
  }

  formatDate(date: number) {
    return new Intl.DateTimeFormat("en-GB").format(date);
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

  get loading() {
    if (this.currentUser) return vxm.ethBancor.loadingProtectedPositions;
    else return false;
  }

  async mounted() {
    const scroll = this.$route.params.scroll;
    const el = this.$el.getElementsByClassName("closedPos")[0];

    if (el && scroll) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}
</script>

<style lang="scss"></style>
