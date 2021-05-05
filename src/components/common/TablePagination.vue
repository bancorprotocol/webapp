<template>
  <div
    v-if="pagesTotal > 0"
    class="d-flex justify-content-center py-4 font-size-14 font-w500"
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
            : darkMode
            ? 'text-primary-dark'
            : 'text-primary-light'
        "
      />
    </div>
    <div class="mx-3">
      {{ $t("page_of", { current: current, total: pagesTotal }) }}
    </div>

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
            : darkMode
            ? 'text-primary-dark'
            : 'text-primary-light'
        "
      />
    </div>
  </div>
  <div
    v-else
    class="text-center my-4 font-size-14 font-w500"
    :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
  >
    {{ $t("no_res_found") }}
  </div>
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
