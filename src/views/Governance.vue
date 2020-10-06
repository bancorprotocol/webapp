<template>
  <b-container fluid="xl" class="px-xl-0">
    <router-view />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component({})
export default class Governance extends Vue {
  filter: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
