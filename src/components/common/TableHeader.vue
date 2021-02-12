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
        <span v-if="column.key !== 'liquidityProtection'" class="mr-1">
          {{ column.label }}
          <font-awesome-icon
            v-if="column.tooltip"
            icon="info-circle"
            class="mr-1"
            v-b-popover.hover.top="column.tooltip"
          />
        </span>
        <img
          v-else
          :src="require(`@/assets/media/icons/liquidity.svg`)"
          class="mr-1"
        />
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
import { Component, Prop, PropSync } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

export interface ViewTableFields {
  label: string;
  key?: string;
  tooltip?: string;
  minWidth?: string;
  maxWidth?: string;
}

@Component
export default class TableHeader extends BaseComponent {
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
