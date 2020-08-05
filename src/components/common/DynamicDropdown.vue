<template>
  <div>
    <b-dropdown
      button
      :disabled="noMenus"
      @click="clicked"
      :variant="variant"
      split
      class="m-2"
      size="lg"
    >
      <template v-slot:button-content>
        <font-awesome-icon :icon="icon" fixed-width class="mr-2" />
        <span class="font-w700">
          {{ title }}
        </span>
      </template>
      <b-dropdown-item-button
        @click="setMenu(menu[0])"
        v-for="menu in sortedMenus"
        :key="menu[0]"
      >
        {{ menu[1] }}
      </b-dropdown-item-button>
    </b-dropdown>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue, PropSync, Emit } from "vue-property-decorator";

@Component
export default class DynamicDropdown extends Vue {
  @Prop(Array) menus!: [string, string, string, string?][];
  @PropSync("selectedMenu", { type: String }) menu!: string;
  @Prop({ default: false }) disabled?: boolean;

  get icon() {
    return this.noMenus ? "question" : this.focusedMenu[2];
  }

  get variant() {
    return this.noMenus ? "warning" : this.focusedMenu[3] || "success";
  }

  get title() {
    return this.noMenus ? "No features available" : this.focusedMenu[1];
  }

  get noMenus() {
    return this.menus.length == 0;
  }

  get sortedMenus() {
    return this.menus.filter(([name, label, icon]) => name !== this.menu);
  }

  get focusedMenu() {
    return this.menus.find(([name, label, icon]) => this.menu == name)!;
  }

  setMenu(name: string) {
    this.menu = name;
  }

  @Emit()
  clicked() {}
}
</script>

<style lang="scss" scoped></style>
