<template>
  <div>
    <span
      class="text-uppercase font-size-sm"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      {{ title }}
    </span>
    <div>
      <span :class="darkMode ? 'text-body-dark' : 'text-body-light'">
        {{ value }}
      </span>
      <span
        v-if="typeof percentage !== 'undefined'"
        :class="percentage >= 0 ? 'text-success' : 'text-danger'"
        >{{ percentage }}%</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class StatisticsDataBlock extends Vue {
  @Prop(String) title!: string;
  @Prop(String) value!: string;
  @Prop(Number) percentage?: number;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
