<template>
  <div
    class="block"
    :class="[
      { 'block-rounded': rounded },
      { 'block-shadow': shadow },
      { 'block-shadow-light': shadowLight },
      { 'bg-block-dark': darkMode },
      { 'bg-block-light': !darkMode }
    ]"
  >
    <div v-if="noHeader"></div>
    <div
      v-else-if="title"
      class="block-header pr-2"
      :class="darkMode ? 'border-bottom-dark' : 'border-bottom-light'"
    >
      <h3
        class="m-0 p-0 my-1 font-size-14 font-w600"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        {{ title }}
      </h3>

      <div v-if="searchInput !== null" class="float-right">
        <multi-input-field
          v-model="searchInput"
          placeholder="Search"
          prepend="search"
        />
      </div>
    </div>
    <div v-else class="block-header">
      <slot name="header"></slot>
    </div>
    <div class="block-content pb-3 pt-0" :class="px0 ? 'px-0' : ''">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Watch, Component, Prop, Vue, PropSync } from "vue-property-decorator";
import { vxm } from "@/store/";
import MultiInputField from "@/components/common/MultiInputField.vue";
@Component({
  components: { MultiInputField }
})
export default class ContentBlock extends Vue {
  @Prop() title?: string;
  @Prop({ default: false }) noHeader?: boolean;
  @Prop({ default: true }) rounded?: boolean;
  @Prop({ default: false }) shadow?: boolean;
  @Prop({ default: false }) shadowLight?: boolean;
  @Prop({ default: false }) px0?: boolean;
  @PropSync("search", { default: null }) searchInput!: string | null;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/_scss/custom/_variables";

.border-bottom-light {
  border-bottom: 1px solid $gray-border;
}

.border-bottom-dark {
  border-bottom: 1px solid $gray-border-dark;
}
</style>
