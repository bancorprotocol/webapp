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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import wait from "waait";
import { router } from "@/router";
import { sync } from "vuex-router-sync";
import {
  services,
  Feature,
  buildTokenId,
  compareString,
  findOrThrow
} from "@/api/helpers";
import { store } from "../../store";
import { ModuleParam } from "../../types/bancor";
import { ethReserveAddress } from "../../api/eth/ethAbis";
import { Route } from "vue-router";

@Component
export default class SubNavigation extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style></style>
