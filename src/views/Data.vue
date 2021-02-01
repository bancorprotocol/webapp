<template>
  <b-container fluid="xl" class="px-xl-0">
    HELLO TEST 123
    <router-view />
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class Data extends BaseComponent {}
</script>

<style lang="scss"></style>
