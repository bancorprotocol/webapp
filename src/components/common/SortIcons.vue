<template>
  <font-awesome-icon
    v-if="currentSort !== category"
    icon="sort"
    fixed-width
    class="text-muted"
  />
  <font-awesome-icon
    v-else-if="currentSortDir === 'asc'"
    icon="sort-up"
    fixed-width
  />
  <font-awesome-icon v-else icon="sort-down" fixed-width />
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";

@Component
export default class SortIcons extends Vue {
  @Prop() currentSort!: string;
  @Prop() currentSortDir!: string;
  @Prop() category!: string;
}
</script>

<style lang="scss" scoped></style>
