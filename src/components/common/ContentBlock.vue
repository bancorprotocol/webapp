<template>
  <div
    class="block"
    :class="[
      { 'block-rounded-tabs': tabs },
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
      class="d-flex justify-content-between align-items-center py-2 px-3 font-size-14 font-w600"
      :class="[
        tabs || filters
          ? ''
          : darkMode
          ? 'border-bottom-dark'
          : 'border-bottom-light',
        searchInput !== null ? 'pr-2' : ''
      ]"
    >
      <div v-if="backButton">
        <font-awesome-icon icon="chevron-left" @click="back" class="cursor" />
      </div>

      <div
        class="m-0 p-0 my-2"
        style="min-width: 190px !important"
        :class="[
          ...titleClasses,
          tabs ? 'font-size-14 font-w400' : 'font-size-16 font-w500'
        ]"
      >
        {{ title }}
      </div>

      <slot name="dropDowns"> </slot>
      <div class="d-none d-lg-inline">
        <slot name="date"></slot>
      </div>

      <div v-if="rippleAnimation">
        <img
          id="ripple"
          width="30"
          height="30"
          :src="
            darkMode
              ? require(`@/assets/media/icons/rippleDark.svg`)
              : require(`@/assets/media/icons/ripple.svg`)
          "
        />
        <b-popover
          :target="`ripple`"
          triggers="hover"
          placement="bottom"
          class="font-size-12 font-w400"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("data_refreshes_auto") }}
        </b-popover>
      </div>

      <div
        v-if="searchInput !== null"
        class="float-right"
        style="width: 220px !important"
      >
        <multi-input-field
          class="d-none d-lg-inline"
          :style="searchStyle"
          v-model="searchInput"
          :clear="true"
          :placeholder="$t('search')"
          prepend="search"
        />
      </div>
    </div>
    <div
      v-else
      class="block-header"
      :class="darkMode ? 'border-bottom-dark' : 'border-bottom-light'"
    >
      <slot name="header"> </slot>
    </div>

    <div v-if="filters" class="d-lg-none d-flex align-items-center pb-2 px-3">
      <multi-input-field
        v-if="searchInput !== null"
        class="mr-2 w-100"
        v-model="searchInput"
        :clear="true"
        :placeholder="$t('search')"
        prepend="search"
      />
      <slot name="mobileFilters"></slot>
    </div>

    <div :class="padding ? 'block-content pb-3 pt-0 ' : '' + px0 ? 'px-0' : ''">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Emit } from "vue-property-decorator";
import MultiInputField from "@/components/common/MultiInputField.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { MultiInputField }
})
export default class ContentBlock extends BaseComponent {
  @Prop() title?: string;
  @Prop({ default: false }) noHeader?: boolean;
  @Prop({ default: true }) rounded?: boolean;
  @Prop({ default: false }) tabs?: boolean;
  @Prop({ default: false }) shadow?: boolean;
  @Prop({ default: false }) shadowLight?: boolean;
  @Prop({ default: false }) px0?: boolean;
  @Prop({ default: true }) padding?: boolean;
  @Prop({ default: false }) backButton!: boolean;
  @Prop({ default: false }) rippleAnimation?: boolean;
  @Prop({ default: false }) filters!: boolean;
  @PropSync("search", { default: null }) searchInput!: string | null;
  @Prop() searchStyle!: string;

  @Emit()
  back() {}
  get titleClasses() {
    const color = this.darkMode ? "text-dark" : "text-light";
    const alignment = this.backButton ? "text-center w-100" : "text-left";
    return [color, alignment];
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
