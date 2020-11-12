<template>
  <div :class="`progress-line-bar progress-line-bar--${type}`">
    <div
      class="progress-line-bar__progress"
      :style="{ width: percentageValue }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";

@Component
export default class TestProgressBar extends Vue {
  @Prop() type?: "warn" | "error" | "info";
  @Prop() percentage?: number;

  // for testing
  @Getter("isCountryBanned", { namespace: "GeneralNewModule" })
  isCountryBanned!: boolean;

  @State("darkMode", { namespace: "GeneralNewModule" })
  darkMode!: boolean;

  @State("countryCode", { namespace: "GeneralNewModule" })
  countryCode!: string;

  @Mutation("toggleDarkMode", { namespace: "GeneralNewModule" })
  toggleDarkMode!: () => void;

  @Action("getUserCountry", { namespace: "GeneralNewModule" })
  getUserCountry!: () => void;

  get percentageValue() {
    return `${+(this.percentage || 0)}%`;
  }

  async mounted() {
    console.log("Getter: ", this.isCountryBanned);
    console.log("State: ", this.darkMode);
    this.toggleDarkMode();
    console.log("Mutated: ", this.darkMode);
    await this.getUserCountry();
    console.log("Action performed: ", this.countryCode);
  }

  // get darkMode() {
  // return vxm.general.darkMode;
  // }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

$progress-line-bar---height: 4px;
$progress-line-bar---border-radius: 0;

$progress-line-bar---background: $gray-border;
$progress-line-bar__progress---background: $primary;
$progress-line-bar--warn__progress---background: $text-warning-light;
$progress-line-bar--error__progress---background: $text-error-light;
$progress-line-bar--info__progress---background: #3ec8c8;

.progress-line-bar {
  border-radius: $progress-line-bar---border-radius;
  overflow: hidden;
  position: relative;
  background: $progress-line-bar---background;

  &,
  &__progress {
    height: $progress-line-bar---height;
  }

  &__progress {
    background: $progress-line-bar__progress---background;
  }

  &--info &__progress {
    background: $progress-line-bar--info__progress---background;
  }
  &--warn &__progress {
    background: $progress-line-bar--warn__progress---background;
  }
  &--error &__progress {
    background: $progress-line-bar--error__progress---background;
  }
}
</style>
