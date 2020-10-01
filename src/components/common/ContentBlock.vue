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
      class="d-flex justify-content-between align-items-center py-2 px-3"
      :class="[
        darkMode ? 'border-bottom-dark' : 'border-bottom-light',
        searchInput !== null ? 'pr-2' : ''
      ]"
    >
      <div v-if="backButton" class="w-100">
        <font-awesome-icon icon="chevron-left" @click="back" class="cursor" />
      </div>

      <h3
        class="m-0 p-0 my-2 font-size-14 font-w600 w-100"
        :class="titleClasses"
      >
        {{ title }}
      </h3>

      <div v-if="version !== null" class="w-100 d-flex justify-content-end">
        <version-badge :version="version" />
      </div>

      <div v-if="detailMode !== null" class="w-100 d-flex justify-content-end">
        <span
          @click="detailMode = !detailMode"
          class="text-primary cursor font-size-12 font-w500"
        >
          {{ detailMode ? "Simple" : "Detailed" }}
        </span>
      </div>

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
import { Component, Prop, Vue, PropSync, Emit } from "vue-property-decorator";
import { vxm } from "@/store/";
import MultiInputField from "@/components/common/MultiInputField.vue";
import VersionBadge from "@/components/common/VersionBadge.vue";

@Component({
  components: { VersionBadge, MultiInputField }
})
export default class ContentBlock extends Vue {
  @Prop() title?: string;
  @Prop({ default: false }) noHeader?: boolean;
  @Prop({ default: true }) rounded?: boolean;
  @Prop({ default: false }) shadow?: boolean;
  @Prop({ default: false }) shadowLight?: boolean;
  @Prop({ default: false }) px0?: boolean;
  @Prop({ default: false }) backButton!: boolean;
  @Prop({ default: null }) version!: 1 | 2 | null;
  @PropSync("search", { default: null }) searchInput!: string | null;
  @PropSync("showDetailedToggle", { default: null }) detailMode!:
    | boolean
    | null;

  @Emit()
  back() {}

  get titleClasses() {
    const color = this.darkMode ? "text-dark" : "text-light";
    const alignment = this.backButton ? "text-center" : "text-left";
    return [color, alignment];
  }

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

.fix-width {
  width: 35px;
}
</style>
