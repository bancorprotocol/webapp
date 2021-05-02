<template>
  <div>
    <b-container
      class="vote-head d-none d-lg-block"
      :class="darkMode ? 'vote-head-dark' : 'vote-head-light'"
    >
      <b-row>
        <b-col
          v-for="column in fields"
          :key="column.id"
          :style="getWidthStyle(column)"
          cols="12"
          :lg="column.colRate != 0 ? column.colRate : ''"
          class="colb my-auto"
        >
          <slot :name="`head(${column.key})`">
            {{ column.label }}
          </slot>

          <template v-if="column.tooltip || isHtmlTooltip(column.key)">
            <font-awesome-icon
              :id="`tooltip-column-${column.id}`"
              icon="info-circle"
              class="mr-1"
            />
            <b-popover
              :target="`tooltip-column-${column.id}`"
              triggers="hover"
              placement="bottom"
            >
              <slot :name="`tooltip(${column.key})`">
                {{ column.tooltip }}
              </slot>
            </b-popover>
          </template>

          <font-awesome-icon
            v-if="column.key === sortBy"
            :icon="descOrder ? 'caret-down' : 'caret-up'"
            :class="darkMode ? 'text-white' : 'text-primary'"
          />
        </b-col>
      </b-row>
    </b-container>
    <b-container class="table-body">
      <b-row v-for="item in paginatedItems" :key="item.id">
        <b-col
          v-for="column in fields"
          :key="column.id"
          class="colb my-auto"
          :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
          cols="12"
          :lg="column.colRate != 0 ? column.colRate : ''"
          :style="getWidthStyle(column)"
          @click="() => openProposal(item)"
        >
          <slot
            :name="`cell(${column.key})`"
            :item="item"
            :opened="opened"
            :label="column.label"
            :value="item[column.key]"
          >
            {{ item[column.key] }}
          </slot>
        </b-col>

        <div
          class="divider"
          :class="darkMode ? 'divider-dark' : 'divider-light'"
        />

        <template v-if="!isNaN(opened) && item.id === opened">
          <b-col
            v-for="column in fields2"
            :key="column.id"
            class="colb my-auto"
            :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
            cols="12"
            :lg="column.colRate != 0 ? column.colRate : ''"
            :style="getWidthStyle(column)"
          >
            <slot
              :name="`cell(${column.key})`"
              :item="item"
              :opened="opened"
              :value="item[column.key]"
            >
              {{ item[column.key] }}
            </slot>
          </b-col>

          <div
            class="divider"
            :class="darkMode ? 'divider-dark' : 'divider-light'"
          />
        </template>
      </b-row>
    </b-container>

    <table-pagination
      v-if="!hidePagination"
      :current-page.sync="currentPage"
      :row-count="filteredItems.length"
      :per-page="perPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import TablePagination from "@/components/common/TablePagination.vue";
import { sort } from "fast-sort";
import { defaultTableSort } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import { TableItem, ViewProposalsField } from "@/types/bancor";
import { Proposal } from "@/store/modules/governance/ethGovernance";

@Component({
  components: {
    TablePagination
  }
})
export default class LayoutProposals extends BaseComponent {
  @Prop() fields!: ViewProposalsField[];
  @Prop() fields2!: ViewProposalsField[];
  @Prop() items!: TableItem[];
  @Prop() filter?: string;
  @Prop() filterBy?: string;
  @Prop() defaultSort?: string;
  @Prop({ default: "desc" }) defaultOrder!: "desc" | "asc";
  @Prop({ default: 10 }) perPage!: number;
  @Prop({ default: false }) hidePagination!: boolean;
  @Prop() filterFunction?: Function;
  @Prop() sortFunction?: Function;
  sortBy: string = "";
  descOrder: boolean = this.defaultOrder === "desc";
  currentPage = 1;
  opened: number = -1;

  created() {
    this.sortBy = this.defaultSort ? this.defaultSort : "";
  }
  get filteredItems() {
    let filtered = [];
    const items = this.items.slice();
    const filter = this.filter;
    const filterBy = this.filterBy;
    const filterFunction = this.filterFunction;
    if (filterFunction !== undefined) {
      filtered = items.filter((t: any) => filterFunction(t, filter));
    } else if (filter && filterBy) {
      filtered = items.filter(
        (t: any) =>
          t[filterBy] &&
          t[filterBy].toUpperCase().includes(filter.toUpperCase())
      );
    } else {
      filtered = items;
    }
    return filtered;
  }
  get sortedItems() {
    const filtered = this.filteredItems;
    let sorted = [];
    const sortBy = this.sortBy;
    const sortFunction = this.sortFunction;
    const orderBy = this.descOrder ? "desc" : "asc";
    if (!sortBy) sorted = filtered;
    else if (sortFunction !== undefined) {
      sorted = sort(filtered)[orderBy]((t: TableItem) =>
        sortFunction(t, sortBy)
      );
    } else {
      sorted = sort(filtered)[orderBy]((t: TableItem) =>
        defaultTableSort(t, sortBy)
      );
    }
    return sorted;
  }
  get paginatedItems() {
    const perPage = this.perPage;
    const endIndex = this.currentPage * perPage;
    const startIndex = endIndex - perPage;
    return this.sortedItems.slice(startIndex, endIndex);
  }
  getWidthStyle(column: ViewProposalsField) {
    let styleString = "";
    if (column.maxWidth) styleString = "width: " + column.maxWidth + ";";
    if (column.minWidth)
      styleString = styleString + "min-width: " + column.minWidth + ";";
    styleString += "padding-right: 10px; padding-left: 10px;";
    return styleString;
  }
  isHtmlTooltip(key: string) {
    return !!this.$slots[`tooltip(${key})`];
  }
  openProposal(proposal: Proposal) {
    if (this.fields2) {
      this.opened = proposal.id === this.opened ? -1 : proposal.id;
      this.$forceUpdate();
    }
  }
  @Watch("filter")
  @Watch("sortBy")
  @Watch("descOrder")
  onFilterChange() {
    this.currentPage = 1;
  }
}
</script>

<style lang="scss">
.vote-head {
  font-size: 12px;
  font-weight: 500;
  padding: 0.75rem;

  &-light {
    background-color: #f7f9fc;
  }

  &-dark {
    background-color: #1f3a55;
  }

  .colb {
    padding: 0.1rem 0.3rem;
    vertical-align: middle !important;
    margin-right: -15px;
  }
}

.table-body {
  display: table;
  vertical-align: middle;

  .colb {
    display: table-cell;
    font-size: 14px;
    font-weight: 500;
    padding: 0.75rem 0.3rem;
    color: #0a2540;
    vertical-align: middle !important;
    margin-right: -15px;
  }

  .divider {
    width: 100%;
    height: 1px;

    &-light {
      background: #e6ebf2;
    }

    &-dark {
      background: #1f3a55;
    }
  }
}
</style>
