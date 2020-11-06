<template>
  <div class="table-responsive">
    <table :class="darkMode ? 'dark-table' : 'table'">
      <table-header
        :fields="fields"
        :sort-by.sync="sortBy"
        :desc-order.sync="descOrder"
      />
      <tbody>
        <tr v-for="pool in paginatedItems" :key="pool.id">
          <td v-for="column in fields" :key="column.key">
            <slot :name="column.key" :item="pool" :value="pool[column.key]">
              {{ pool[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <table-pagination
      v-if="!hidePagination"
      :current-page.sync="currentPage"
      :rowCount.sync="modifiedItems.length"
      :per-page="perPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
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

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
