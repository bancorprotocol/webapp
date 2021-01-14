<template>
  <div v-if="pagesTotal > 0" class="undertable">
    <div
      :class="current > 1 ? 'cursor' : ''"
      @click="current > 1 ? current-- : null"
    >
      <font-awesome-icon
        icon="long-arrow-alt-left"
        :class="
          current === 1
            ? darkMode
              ? 'text-muted-dark'
              : 'text-muted-light'
            : 'text-primary'
        "
      />
    </div>
    <span class="mx-3">Page {{ current }} of {{ pagesTotal }}</span>

    <div
      :class="current < pagesTotal ? 'cursor' : ''"
      @click="current < pagesTotal ? current++ : null"
    >
      <font-awesome-icon
        icon="long-arrow-alt-right"
        :class="
          current === pagesTotal
            ? darkMode
              ? 'text-muted-dark'
              : 'text-muted-light'
            : 'text-primary'
        "
      />
    </div>
  </div>
  <span v-else class="undertable"> No results found</span>
</template>

<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class TablePagination extends BaseComponent {
  @PropSync("currentPage", { type: Number }) current!: number;
  @Prop() rowCount!: number;
  @Prop() perPage!: number;

  get pagesTotal() {
    return Math.ceil(this.rowCount / this.perPage);
  }
}
</script>

<style lang="scss">
.undertable {
  display: flex;
  justify-content: center;
  margin-block-start: 24px;
  color: #6b7c93;
  font-weight: 500;
  font-size: 14;
}
</style>
