<template>
  <b-container fluid="xl" class="px-xl-0">
    <router-view />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";

@Component({
  components: {}
})
export default class Data extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
