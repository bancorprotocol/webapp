<template>
  <tr :class="collapsable ? 'cursor' : ''">
    <td v-for="column in fields" :key="column.id">
      <slot
        :name="`cell(${column.key})`"
        :item="item"
        :value="item[column.key]"
      >
        {{ item[column.key] }}
      </slot>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Item, ViewTableField } from "@/components/common/DataTable.vue";

@Component
export default class DataTableRow extends Vue {
  @Prop() fields!: ViewTableField[];
  @Prop() item!: Item;
  @Prop() collapsable!: boolean;
}
</script>

<style lang="scss" scoped></style>
