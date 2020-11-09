<template>
  <div
    class="d-flex justify-content-center align-items-center mt-3 font-size-14 font-w500"
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
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class TablePagination extends Vue {
  @PropSync("currentPage", { type: Number }) current!: number;
  @Prop() rowCount!: number;
  @Prop() perPage!: number;

  get pagesTotal() {
    return Math.ceil(this.rowCount / this.perPage);
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
