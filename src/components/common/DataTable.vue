<template>
  <div class="table-responsive">
    <table :class="darkMode ? 'dark-table' : 'table'">
      <thead>
        <tr :class="darkMode ? 'table-header-dark' : 'table-header-light'">
          <th
            @click="setSortBy(column)"
            v-for="column in fields"
            :key="column.id"
            scope="col"
            :class="getThClass(column)"
            :style="getWidthStyle(column)"
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
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in paginatedItems">
          <tr
            @click="toggleCollapse(item.id)"
            :key="`main-row${item.id}`"
            class="table-row"
            :class="trClasses(item.id)"
          >
            <td v-for="column in fields" :key="column.id">
              <slot
                :name="`cell(${column.key})`"
                :item="item"
                :value="item[column.key]"
              >
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
          <template v-if="expandedId === item.id">
            <tr
              v-for="item2 in item.collapsedData"
              :key="`collapsable-row${item2.id}`"
            >
              <td
                v-for="(column, index) in fields"
                :key="`collapsable-column${column.id}`"
              >
                <div :class="index === 0 ? 'collapsed-indicator' : ''">
                  <slot
                    :name="`cellCollapsed(${column.key})`"
                    :item="item2"
                    :value="item2[column.key]"
                  >
                    {{ item2[column.key] }}
                  </slot>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>

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
import sort from "fast-sort";
import { defaultTableSort } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";

export interface ViewTableField {
  id: number;
  label: string;
  key: string;
  sortable?: boolean;
  tooltip?: string;
  minWidth?: string;
  maxWidth?: string;
  thClass?: string;
}
export interface Item {
  id: string;
  [key: string]: any;
  collapsedData?: Item[];
}
@Component({
  components: {
    TablePagination
  }
})
export default class DataTable extends BaseComponent {
  @Prop() fields!: ViewTableField[];
  @Prop() items!: Item[];
  @Prop() filter?: string;
  @Prop() filterBy?: string;
  @Prop() defaultSort?: string;
  @Prop({ default: false }) collapsable!: boolean;
  @Prop({ default: "desc" }) defaultOrder!: "desc" | "asc";
  @Prop({ default: 10 }) perPage!: number;
  @Prop({ default: false }) hidePagination!: boolean;
  @Prop() filterFunction?: Function;
  @Prop() sortFunction?: Function;

  sortBy: string = "";
  descOrder: boolean = this.defaultOrder === "desc";
  currentPage = 1;

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
      sorted = sort(filtered)[orderBy]((t: Item) => sortFunction(t, sortBy));
    } else {
      sorted = sort(filtered)[orderBy]((t: Item) =>
        defaultTableSort(t, sortBy)
      );
    }

    return sorted;
  }

  get paginatedItems(): Item[] {
    const perPage = this.perPage;
    const endIndex = this.currentPage * perPage;
    const startIndex = endIndex - perPage;
    return this.sortedItems.slice(startIndex, endIndex);
  }

  isColumnSort(column: ViewTableField) {
    return column.sortable === undefined || column.sortable;
  }

  setSortBy(column: ViewTableField) {
    if (this.isColumnSort(column)) {
      if (this.sortBy === column.key) this.descOrder = !this.descOrder;
      else this.sortBy = column.key;
    } else return;
  }

  getThClass(column: ViewTableField) {
    const styles = [];
    if (column.thClass) {
      styles.push(column.thClass);
    }
    if (this.isColumnSort(column)) {
      styles.push("cursor");
    }
    return styles;
  }

  trClasses(id: string | number) {
    const array: string[] = [];
    if (this.collapsable) array.push("cursor");
    if (id === this.expandedId) array.push("table-row-active");
    return array;
  }

  expandedId: string | number | null = null;

  toggleCollapse(id: string | number | null) {
    if (!this.collapsable) return;

    if (this.expandedId === id) this.expandedId = null;
    else this.expandedId = id;
  }

  getWidthStyle(column: ViewTableField) {
    let styleString = "";
    if (column.maxWidth) styleString = "width: " + column.maxWidth + ";";
    if (column.minWidth)
      styleString = styleString + "min-width: " + column.minWidth + ";";
    return styleString;
  }

  isHtmlTooltip(key: string) {
    return !!this.$slots[`tooltip(${key})`];
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
@import "../../assets/_scss/custom/variables";
.table-row:hover {
  background-color: $gray-border;
}
.table-row-active {
  background-color: $gray-border;
}

.collapsed-indicator {
  border-left: 2px solid $primary;
  padding-left: 20px;
}
</style>
