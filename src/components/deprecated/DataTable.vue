<template>
  <div class="table-responsive">
    <table :class="darkMode ? 'dark-table' : 'table'">
      <table-header
        :fields="fields"
        :sort-by.sync="sortBy"
        @update:sortBy="modifyItems"
        :desc-order.sync="descOrder"
        @update:descOrder="modifyItems"
      />
      <tbody>
        <slot />
      </tbody>
    </table>

    <table-pagination
      :current-page.sync="currentPage"
      @update:currentPage="modifyItems"
      :rowCount.sync="modifiedItems.length"
      @update:rowCount="modifyItems"
      :per-page="perPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import TableHeader, {
  ViewTableFields
} from "@/components/common/TableHeader.vue";
import TablePagination from "@/components/common/TablePagination.vue";
import { VModel } from "@/api/helpers";
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
  @VModel() paginatedItems!: any[];
  @Prop() filter!: string;
  @Prop() filterBy!: string;
  @Prop() defaultSort!: string;
  @Prop({ default: "desc" }) defaultOrder!: "desc" | "asc";
  @Prop({ default: 10 }) perPage!: number;

  sortBy: string = this.defaultSort;
  descOrder: boolean = this.defaultOrder === "desc";
  currentPage = 1;
  modifiedItems: any[] = [];

  modifyItems() {
    const items = this.items;
    const filtered = items.filter(
      (t: any) =>
        t[this.filterBy] && t[this.filterBy].includes(this.filter.toUpperCase())
    );
    this.modifiedItems = sort(filtered)[this.descOrder ? "desc" : "asc"](
      (t: any) => t[this.sortBy]
    );
    this.paginateItems();
  }

  paginateItems() {
    this.paginatedItems = this.modifiedItems.slice(
      this.currentPage * this.perPage - this.perPage,
      this.currentPage * this.perPage
    );
  }

  @Watch("filter")
  @Watch("items")
  updateItems() {
    this.modifyItems();
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  mounted() {
    this.modifyItems();
  }
}
</script>

<style lang="scss"></style>
