<template>
  <div>
    <b-table
      responsive
      :dark="darkMode"
      :fields="fields"
      :primary-key="primarykey"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortByProp"
      :sort-desc.sync="sortDescProp"
      :filter="filter"
      :filter-function="filterFunction"
      @filtered="onFiltered"
      empty-filtered-text="No results found"
      show-empty
    >
      <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
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
import { Prop, Watch } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

export default class TableWrapper extends BaseComponent {
  @Prop() primarykey?: string;
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
}
</script>

<style lang="scss"></style>
