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
import BigNumber from "bignumber.js";

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
}
@Component({
  components: {
    TablePagination
  }
})
export default class DataTable extends Vue {
  @Prop() fields!: ViewTableField[];
  @Prop() items!: Item[];
  @Prop() filter?: string;
  @Prop() filterBy?: string;
  @Prop() defaultSort?: string;
  @Prop({ default: "desc" }) defaultOrder!: "desc" | "asc";
  @Prop({ default: 10 }) perPage!: number;
  @Prop({ default: false }) hidePagination!: boolean;
  @Prop() filterFunction?: Function;

  sortBy: string = "";
  descOrder: boolean = this.defaultOrder === "desc";
  currentPage = 1;

  created() {
    this.sortBy = this.defaultSort ? this.defaultSort : "";
  }

  get modifiedItems() {
    let filtered = [];
    const items = this.items.slice();
    const filter = this.filter;
    const filterBy = this.filterBy;
    const filterFunction = this.filterFunction;
    const sortBy = this.sortBy;

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

    if (sortBy) {
      return sort(filtered)[this.descOrder ? "desc" : "asc"]((t: Item) => {
        if (
          t[sortBy] !== 0 &&
          t[sortBy] !== "0" &&
          t[sortBy] !== undefined &&
          t[sortBy] !== null
        ) {
          const value = t[sortBy];
          const number = new BigNumber(value);
          if (BigNumber.isBigNumber(number)) return number.toNumber();
          else return null;
        } else return null;
      });
    } else return filtered;
  }

  get paginatedItems() {
    const perPage = this.perPage;
    const endIndex = this.currentPage * perPage;
    const startIndex = endIndex - perPage;
    return this.modifiedItems.slice(startIndex, endIndex);
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

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
