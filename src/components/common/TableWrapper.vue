<template>
  <div>
    <b-table
      responsive
      :dark="darkMode"
      :fields="fields"
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :filter="filter"
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
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      hide-goto-end-buttons
      align="center"
      limit="3"
    >
      <template v-slot:prev-text="{ disabled }">
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
      </template>
    </b-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component({
  components: {}
})
export default class TableWrapper extends Vue {
  @Prop() items!: any[];
  @Prop() fields!: any[];
  @Prop() sortBy!: string;
  @Prop({ default: "" }) filter!: string;
  @Prop({ default: true }) sortDesc!: boolean;
  @Prop({ default: 10 }) perPage!: number;

  currentPage = 1;

  iconClass(disabled: boolean) {
    return disabled
      ? this.darkMode
        ? "text-muted-dark"
        : "text-muted-light"
      : "text-primary";
  }

  get totalRows() {
    return this.items.length;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
