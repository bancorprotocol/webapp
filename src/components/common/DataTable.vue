<template>
  <div class="table-responsive">
    <table :class="darkMode ? 'dark-table' : 'table'">
      <thead>
        <tr :class="darkMode ? 'table-header-dark' : 'table-header-light'">
          <th
            @click="setSortBy(column)"
            v-for="column in fields"
            :key="`head-column-${column.id}`"
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
            @click="toggleCollapse(item)"
            :key="`main-row-${item.id}`"
            class="table-row"
            :class="trClasses(item)"
          >
            <td v-for="column in fields" :key="`main-column-${column.id}`">
              <slot
                :name="`cell(${column.key})`"
                :item="item"
                :value="item[column.key]"
                :isCollapsable="item.collapsedData && item.collapsedData.length"
                :isExpanded="expandedId === item.id"
              >
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
          <template v-if="expandedId === item.id">
            <tr
              v-for="item2 in item.collapsedData"
              :key="`collapsable-row-${item2.id}`"
            >
              <td
                v-for="(column, index) in fields"
                :key="`collapsable-column-${column.id}`"
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
import { sort } from "fast-sort";
import { defaultTableSort } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import {
  TableItem,
  ViewTableField,
  ViewGroupedPositions
} from "@/types/bancor";

@Component({
  components: {
    TablePagination
  }
})
export default class DataTable extends BaseComponent {
  @Prop() fields!: ViewTableField[];
  @Prop() items!: TableItem[];
  @Prop() filter?: string;
  @Prop() filterBy?: string;
  @Prop() defaultSort?: string;
  @Prop({ default: false }) collapsable!: boolean;
  @Prop({ default: 10 }) perPage!: number;
  @Prop({ default: false }) hidePagination!: boolean;
  @Prop() filterFunctions?: Function[];
  @Prop() sortFunction?: Function;

  sortBy: string = "";
  descOrder: boolean = true;
  currentPage = 1;

  created() {
    this.sortBy = this.defaultSort ? this.defaultSort : "";
  }

  get filteredItems() {
    let filtered = this.items.slice();
    const filter = this.filter;
    const filterBy = this.filterBy;

    if (this.filterFunctions !== undefined) {
      this.filterFunctions.forEach(filterFunction => {
        filtered = filtered.filter((t: any) => filterFunction(t));
      });
    } else if (filter && filterBy) {
      filtered = filtered.filter(
        (t: any) =>
          t[filterBy] &&
          t[filterBy].toUpperCase().includes(filter.toUpperCase())
      );
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

  get paginatedItems(): TableItem[] {
    const perPage = this.perPage;
    const endIndex = this.currentPage * perPage;
    const startIndex = endIndex - perPage;
    const items = this.sortedItems.slice(startIndex, endIndex);
    const itemsWithoutId = items.filter(x => !x.id);
    if (itemsWithoutId.length > 0) {
      console.warn(
        "The following paginated items dont have an id: ",
        itemsWithoutId
      );
    }
    return items;
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

  trClasses(item: TableItem) {
    const array: string[] = [];
    if (this.collapsable && item.collapsedData && item.collapsedData.length)
      array.push("cursor");
    if (item.id === this.expandedId) array.push("table-row-active");
    return array;
  }

  expandedId: string | number | null = null;

  toggleCollapse(item: TableItem) {
    if (
      !this.collapsable ||
      !item.collapsedData ||
      item.collapsedData.length === 0
    )
      return;

    if (this.expandedId === item.id) this.expandedId = null;
    else this.expandedId = item.id;
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

.table {
  .table-row:hover {
    background-color: $gray-border;
  }
  .table-row-active {
    background-color: $gray-border;
  }
}

.dark-table {
  .table-row:hover {
    background-color: $modal-backdrop-bg;
  }
  .table-row-active {
    background-color: $modal-backdrop-bg;
  }
}

.collapsed-indicator {
  border-left: 2px solid $primary;
  padding-left: 20px;
}
</style>
