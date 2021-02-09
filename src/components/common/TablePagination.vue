<template>
  <div
    v-if="pagesTotal > 0"
    class="d-flex justify-content-center align-items-center mt-4 font-size-14 font-w500"
  >
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
    <span class="mx-3">
      {{
        $t("page_of", {
          current: current,
          total: pagesTotal
        })
      }}</span
    >

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
  <span
    v-else
    class="d-flex justify-content-center align-items-center mt-4 font-size-14 font-w500"
    :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
  >
    {{ $t("no_res_found") }}</span
  >
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

<style lang="scss"></style>
