<template>
  <div>
    <b-table
      responsive
      :dark="darkMode"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortByProp"
      :sort-desc.sync="sortDescProp"
      :filter="filter"
      :filter-function="filterFunction"
      empty-filtered-text="No results found"
      show-empty
      @filtered="onFiltered"
    >
      <slot v-for="(_, name) in $slots" :slot="name" :name="name" />
      <template
        v-for="(_, name) in $scopedSlots"
        :slot="name"
        slot-scope="slotData"
      >
        <slot :name="name" v-bind="slotData" />
      </template>

      <template #emptyfiltered="scope">
        <div class="font-size-14 font-w500 text-center mt-4">
          {{ scope.emptyFilteredText }}
        </div>
        <h4></h4>
      </template>
    </b-table>

    <b-pagination
      v-if="totalRows >= perPage"
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      align="center"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class TableWrapper extends Vue {
  @Prop() items!: any[];
  @Prop() fields!: any[];
  @Prop() sortBy!: string;
  @Prop({ default: "" }) filter!: string;
  @Prop({ default: true }) sortDesc!: boolean;
  @Prop({ default: 10 }) perPage!: number;
  @Prop() filterFunction!: Function;
  currentPage = 1;
  totalRows = 1;

  sortByProp = this.sortBy;
  sortDescProp = this.sortDesc;

  onFiltered(filteredItems: any) {
    this.totalRows = filteredItems.length;
    this.currentPage = 1;
  }

  @Watch("items")
  onItemsChange() {
    this.totalRows = this.items.length;
  }
  mounted() {
    this.onItemsChange();
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
