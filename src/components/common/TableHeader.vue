<template>
  <thead>
    <tr :class="darkMode ? 'table-header-dark' : 'table-header-light'">
      <th
        @click="setSortBy(column)"
        v-for="column in fields"
        :key="column.key"
        scope="col"
        :class="column.key ? 'cursor' : ''"
        :style="getWidthStyle(column)"
      >
        {{ column.label }}
        <font-awesome-icon
          v-if="column.key && column.key === sortByKey"
          :icon="desc ? 'caret-down' : 'caret-up'"
          :class="darkMode ? 'text-white' : 'text-primary'"
        />
      </th>
    </tr>
  </thead>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
import { vxm } from "@/store";

export interface ViewTableFields {
  label: string;
  key?: string;
  minWidth?: string;
  maxWidth?: string;
}

@Component
export default class TableHeader extends Vue {
  @Prop() fields!: ViewTableFields[];
  @PropSync("sortBy", { type: String }) sortByKey!: string;
  @PropSync("descOrder", { type: Boolean }) desc!: boolean;

  setSortBy(column: ViewTableFields) {
    if (column.key) {
      if (this.sortByKey === column.key) this.desc = !this.desc;
      else this.sortByKey = column.key;
    } else return;
  }

  getWidthStyle(column: ViewTableFields) {
    let styleString = "";
    if (column.maxWidth) styleString = "width: " + column.maxWidth + ";";
    if (column.minWidth)
      styleString = styleString + "min-width: " + column.minWidth + ";";
    return styleString;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

th {
  font-size: 12px !important;
  font-weight: 500 !important;
}

.table-header {
  &-light {
    background-color: $block-bg-blue;
    color: $text-muted-light !important;
  }

  &-dark {
    background-color: $gray-border-dark;
    color: $text-muted-dark !important;
  }
}
</style>
