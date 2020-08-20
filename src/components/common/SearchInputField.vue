<template>
  <b-input-group>
    <b-input-group-prepend>
      <div
        class="rounded-left d-flex align-items-center pl-2 pr-0 font-size-12"
        :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
        :style="'border-right: 0 !important; height: ' + height + 'px;'"
      >
        <font-awesome-icon
          icon="search"
          class="ml-1"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        />
      </div>
    </b-input-group-prepend>
    <b-form-input
      :class="[
        !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
        fontSizeClass
      ]"
      debounce="150"
      v-model="searchValue"
      placeholder="Search"
      class="mb-1"
      :style="'border-left: 0 !important; height: ' + height + 'px;'"
    ></b-form-input>
  </b-input-group>
</template>

<script lang="ts">
import { Prop, PropSync, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class SearchInputField extends Vue {
  @PropSync("value", { type: String }) searchValue!: string;
  @Prop({ default: 32 }) height!: number;
  @Prop({ default: "md" }) fontSize!: "sm" | "md" | "lg";

  get fontSizeClass() {
    if (this.fontSize === "sm") return "font-size-12";
    else if (this.fontSize === "md") return "font-size-14";
    else return "font-size-16";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
