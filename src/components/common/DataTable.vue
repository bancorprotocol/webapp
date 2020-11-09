<template>
  <div class="table-responsive">
    <table :class="darkMode ? 'dark-table' : 'table'">
      <thead>
        <tr :class="darkMode ? 'table-header-dark' : 'table-header-light'">
          <th
            @click="setSortBy(column)"
            v-for="(column, index) in fields"
            :key="index"
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
        <tr v-for="pool in paginatedItems" :key="pool.id">
          <td v-for="(column, index) in fields" :key="index">
            <slot
              :name="`cell(${column.key})`"
              :item="pool"
              :value="pool[column.key]"
            >
              {{ pool[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <table-pagination
      v-if="!hidePagination"
      :current-page.sync="currentPage"
      :rowCount="modifiedItems.length"
      :per-page="perPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import TableHeader, {
  ViewTableFields
} from "@/components/common/TableHeader.vue";
import TablePagination from "@/components/common/TablePagination.vue";
import sort from "fast-sort";

@Component({
  components: {
    TableHeader,
    TablePagination
  }
})
export default class DataTable extends Vue {
  @Prop() fields!: ViewTableFields[];
  @Prop() items!: any[];
  @Prop() filter!: string;
  @Prop() filterBy!: string;
  @Prop() defaultSort!: string;
  @Prop({ default: "desc" }) defaultOrder!: "desc" | "asc";
  @Prop({ default: 10 }) perPage!: number;
  @Prop({ default: false }) hidePagination!: boolean;

  sortBy: string = this.defaultSort;
  descOrder: boolean = this.defaultOrder === "desc";
  currentPage = 1;

  get modifiedItems() {
    const filtered = this.items.filter(
      (t: any) =>
        t[this.filterBy] &&
        t[this.filterBy].toUpperCase().includes(this.filter.toUpperCase())
    );

    return sort(filtered)[this.descOrder ? "desc" : "asc"](
      (t: any) => t[this.sortBy]
    );
  }

  get paginatedItems() {
    return this.modifiedItems.slice(
      this.currentPage * this.perPage - this.perPage,
      this.currentPage * this.perPage
    );
  }

  isColumnSort(column: ViewTableFields) {
    return column.sort === undefined || column.sort;
  }

  setSortBy(column: ViewTableFields) {
    if (this.isColumnSort(column)) {
      if (this.sortBy === column.key) this.descOrder = !this.descOrder;
      else this.sortBy = column.key;
    } else return;
  }

  getWidthStyle(column: ViewTableFields) {
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
