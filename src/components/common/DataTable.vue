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
            :class="isColumnSort(column) ? 'cursor' : ''"
            :style="getWidthStyle(column)"
          >
            <slot :name="`head(${column.key})`">
              {{ column.label }}
            </slot>
            <font-awesome-icon
              v-if="column.tooltip"
              icon="info-circle"
              class="mr-1"
              v-b-popover.hover.top="column.tooltip"
            />
            <font-awesome-icon
              v-if="column.key === sortBy"
              :icon="descOrder ? 'caret-down' : 'caret-up'"
              :class="darkMode ? 'text-white' : 'text-primary'"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedItems" :key="item.id">
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
      </tbody>
    </table>

    <table-pagination
      v-if="!hidePagination"
      :current-page.sync="currentPage"
      :row-count="modifiedItems.length"
      :per-page="perPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import TablePagination from "@/components/common/TablePagination.vue";
import sort from "fast-sort";

export interface ViewTableField {
  id: number;
  label: string;
  key: string;
  sort?: boolean;
  tooltip?: string;
  minWidth?: string;
  maxWidth?: string;
}

@Component({
  components: {
    TablePagination
  }
})
export default class DataTable extends Vue {
  @Prop() fields!: ViewTableField[];
  @Prop() items!: any[];
  @Prop() filter!: string;
  @Prop() filterBy!: string;
  @Prop() defaultSort!: string;
  @Prop({ default: "desc" }) defaultOrder!: "desc" | "asc";
  @Prop({ default: 10 }) perPage!: number;
  @Prop({ default: false }) hidePagination!: boolean;
  @Prop() filterFunction?: Function;

  sortBy: string = this.defaultSort;
  descOrder: boolean = this.defaultOrder === "desc";
  currentPage = 1;

  get modifiedItems() {
    let filtered = [];
    const items = this.items;
    const filter = this.filter;
    const filterBy = this.filterBy;
    const filterFunction = this.filterFunction;

    if (filterFunction !== undefined) {
      filtered = items.filter((t: any) => filterFunction(t, filter));
    } else {
      filtered = items.filter(
        (t: any) =>
          t[filterBy] &&
          t[filterBy].toUpperCase().includes(filter.toUpperCase())
      );
    }

    return sort(filtered)[this.descOrder ? "desc" : "asc"](
      (t: any) => t[this.sortBy]
    );
  }

  get paginatedItems() {
    const perPage = this.perPage;
    const endIndex = this.currentPage * perPage;
    const startIndex = endIndex - perPage;
    return this.modifiedItems.slice(startIndex, endIndex);
  }

  isColumnSort(column: ViewTableField) {
    return column.sort === undefined || column.sort;
  }

  setSortBy(column: ViewTableField) {
    if (this.isColumnSort(column)) {
      if (this.sortBy === column.key) this.descOrder = !this.descOrder;
      else this.sortBy = column.key;
    } else return;
  }

  getWidthStyle(column: ViewTableField) {
    let styleString = "";
    if (column.maxWidth) styleString = "width: " + column.maxWidth + ";";
    if (column.minWidth)
      styleString = styleString + "min-width: " + column.minWidth + ";";
    return styleString;
  }

  @Watch("filter")
  @Watch("sortBy")
  @Watch("descOrder")
  onFilterChange() {
    this.currentPage = 1;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
