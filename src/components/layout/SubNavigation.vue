<template>
  <div class="w-100 text-center mt-2 mb-3">
    <b-row>
      <b-col>
        <b-button-group class="d-flex">
          <b-button
            :to="{ name: 'Swap' }"
            :variant="$route.name !== 'Swap' ? 'outline-primary' : 'primary'"
            style="width: 50%"
            >Swap</b-button
          >
          <b-button
            :to="{ name: 'Pool' }"
            :variant="$route.name !== 'Pool' ? 'outline-primary' : 'primary'"
            style="width: 50%"
            >Pool</b-button
          >
        </b-button-group>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class SubNavigation extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style></style>
