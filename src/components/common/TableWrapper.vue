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
      @filtered="onFiltered"
    >
      <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      <template
        v-for="(_, name) in $scopedSlots"
        :slot="name"
        slot-scope="slotData"
      >
        <slot :name="name" v-bind="slotData" />
      </template>
    </b-table>

    <b-pagination
      v-if="totalRows >= perPage"
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      align="center"
    >
      <!--   <template v-slot:prev-text="{ disabled }">
        <font-awesome-icon
          icon="long-arrow-alt-left"
          :class="iconClass(disabled)"
        />
      </template>
      <template v-slot:next-text="{ disabled }">
        <font-awesome-icon
          icon="long-arrow-alt-right"
          :class="iconClass(disabled)"
        />
      </template>-->w
    </b-pagination>

    <div v-if="!totalRows" class="text-center">
      <span class="font-size-14 font-w500">No results found</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { Method } from 'axios';

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

  iconClass(disabled: boolean) {
    return disabled
      ? this.darkMode
        ? "text-muted-dark"
        : "text-muted-light"
      : "text-primary";
  }
  mounted() {
    this.totalRows = this.items.length;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
