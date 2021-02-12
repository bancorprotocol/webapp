<template>
  <div>
    <label-content-split :label="label" class="mb-1" />
    <div
      class="block block-rounded block-bordered"
      :class="darkMode ? 'block-light-blue-dark' : 'block-light-blue-light'"
    >
      <div class="block-content py-2">
        <b-row>
          <b-col
            v-for="item in items"
            :key="item.id"
            cols="4"
            class="text-center"
          >
            <div>
              <span
                class="font-size-12"
                :class="darkMode ? 'text-dark' : 'text-light'"
              >
                {{ item.title }}
              </span>
            </div>
            <span
              class="font-size-12 font-w500"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            >
              {{ item.label }}
            </span>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import BaseComponent from "@/components/BaseComponent.vue";

interface Item {
  label: string;
  title: string;
  id: string;
}

@Component({
  components: { LabelContentSplit }
})
export default class RateShareBlock extends BaseComponent {
  @Prop() items!: Item[];
  @Prop() label!: string;
}
</script>

<style scoped lang="scss"></style>
