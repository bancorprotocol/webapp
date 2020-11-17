<template>
  <b-card>
    <h3>Simple Comp With Vuex</h3>
    <p>isCountryBanned: {{isCountryBanned}}</p>
    <p>darkMode: {{darkMode}}</p>
    <p>countryCode: {{countryCode}}</p>
    <b-btn @click="toggleDarkMode">ToggleDarkMode</b-btn>
    <b-btn @click="getUserCountry">GetUserCountry</b-btn>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State, Getter, Mutation, Action, namespace } from "vuex-class";

const general = namespace('general')

@Component
export default class SimpleCompWithVuex extends Vue {
  @Prop() type?: "warn" | "error" | "info";  
  
  @general.Getter("isCountryBanned")
  isCountryBanned!: boolean;

  @general.State("darkMode")
  darkMode!: boolean;

  @general.State("countryCode")
  countryCode!: string;

  @general.Mutation("toggleDarkMode")
  toggleDarkMode!: () => void;

  @general.Action("getUserCountry")
  getUserCountry!: () => void;  

  async mounted() {
    console.log("Getter: ", this.isCountryBanned);
    console.log("State: ", this.darkMode);
    this.toggleDarkMode();
    console.log("Mutated: ", this.darkMode);
    await this.getUserCountry();
    console.log("Action performed: ", this.countryCode);
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

</style>
