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
    <div :class="darkMode ? 'border-bottom-dark' : 'border-bottom-light'">
      <div v-if="noHeader"></div>

      <div
        v-if="!noHeader && title"
        class="d-flex justify-content-between align-items-center py-2 px-3 font-size-12 font-w400"
        :class="searchInput !== null ? 'pr-2' : ''"
      >
        <div v-if="backButton">
          <font-awesome-icon icon="chevron-left" @click="back" class="cursor" />
        </div>

        <h3 class="m-0 p-0 my-2 font-size-12 font-w400" :class="titleClasses">
          {{ title }}
        </h3>

        <b-dropdown
          :ref="'dropdown_' + dropdown.id"
          v-for="dropdown in dropDownFilters"
          :key="dropdown.id"
          :text="dropdown.items[dropdown.selectedIndex].title"
          :variant="
            !dropDownFiltering(dropdown)
              ? darkMode
                ? 'muted-dark'
                : 'muted-light'
              : darkMode
              ? 'active-dark'
              : 'active-light'
          "
          :block="true"
          class="d-none d-lg-inline"
          toggle-class="block-rounded"
          :menu-class="
            darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'
          "
          style="width: 200px !important; height: 35px !important"
          :no-caret="true"
        >
          <template #button-content>
            <div class="d-flex justify-content-between align-items-center">
              {{ dropdown.items[dropdown.selectedIndex].title }}
              <font-awesome-icon
                :icon="dropDownFiltering(dropdown) ? 'times' : 'caret-down'"
                @click.stop="clearFilter(dropdown)"
              />
            </div>
          </template>
          <b-dropdown-item
            :class="darkMode ? 'dropdown-item-dark' : 'dropdown-item-light'"
            v-for="(item, index) in dropdown.items"
            :key="item.id"
            @click="dropdown.selectedIndex = index"
            >{{ item.title }}
          </b-dropdown-item>
        </b-dropdown>
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

        <multi-input-field
          v-if="searchInput !== null"
          class="d-none d-lg-inline"
          :style="searchStyle"
          v-model="searchInput"
          :clear="true"
          :placeholder="$t('search')"
          prepend="search"
        />
      </div>

      <div
        v-if="!noHeader && !title"
        class="block-header"
        :class="darkMode ? 'border-bottom-dark' : 'border-bottom-light'"
      >
        <slot name="header"> </slot>
      </div>
      <div
        v-if="dropDownFilters"
        class="d-lg-none d-flex align-items-center pb-2 px-3"
      >
        <multi-input-field
          v-if="searchInput !== null"
          class="mr-2"
          style="width: 100%"
          v-model="searchInput"
          :clear="true"
          :placeholder="$t('search')"
          prepend="search"
        />
        <b-btn class="d-flex" variant="primary">
          <font-awesome-icon icon="filter" @click="showMobileFilters" />
          <font-awesome-icon
            icon="times"
            v-if="anyAreFiltering"
            class="ml-2"
            @click="clearAllFilters"
          />
        </b-btn>
      </div>
    </div>

    <div class="block-content pb-3 pt-0" :class="px0 ? 'px-0' : ''">
      <slot></slot>
    </div>

    <modal-protected-filters v-model="modal" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Emit } from "vue-property-decorator";
import MultiInputField from "@/components/common/MultiInputField.vue";
import ModalProtectedFilters from "@/components/modals/ModalProtectedFilters.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { drop } from "node_modules/@types/lodash";

@Component({
  components: { MultiInputField, ModalProtectedFilters }
})
export default class ContentBlock extends BaseComponent {
  @Prop() title?: string;
  @Prop({ default: false }) noHeader?: boolean;
  @Prop({ default: true }) rounded?: boolean;
  @Prop({ default: false }) shadow?: boolean;
  @Prop({ default: false }) shadowLight?: boolean;
  @Prop({ default: false }) px0?: boolean;
  @Prop({ default: false }) backButton!: boolean;
  @Prop() dropDownFilters!: {
    id: string;
    selectedIndex: number;
    items: {
      title: string;
    }[];
  }[];
  @Prop({ default: false }) dateFiltering!: boolean[];
  @Prop() clearDate?: Function;
  @Prop({ default: false }) rippleAnimation?: boolean;
  @PropSync("search", { default: null }) searchInput!: string | null;
  @Prop() searchStyle!: string;

  modal: boolean = false;

  @Emit()
  back() {}

  get titleClasses() {
    const color = this.darkMode ? "text-dark" : "text-light";
    const alignment = this.backButton ? "text-center w-100" : "text-left";
    return [color, alignment];
  }

  get anyAreFiltering() {
    let anyFiltering: boolean = false;
    this.dropDownFilters.map(
      dropDown => (anyFiltering = dropDown.selectedIndex !== 0)
    );

    return this.dateFiltering || anyFiltering;
  }

  showMobileFilters() {
    this.modal = true;
  }

  dropDownFiltering(dropDown: any) {
    return dropDown.selectedIndex !== 0;
  }

  clearFilter(dropdown: any) {
    if (this.dropDownFiltering(dropdown)) {
      dropdown.selectedIndex = 0;
    }
  }

  clearAllFilters() {
    this.dropDownFilters.map(dropDown => dropDown.selectedIndex !== 0);
    if (this.clearDate) this.clearDate();
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
