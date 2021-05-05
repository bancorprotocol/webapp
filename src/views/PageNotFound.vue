<template>
  <b-row>
    <b-col cols="12" class="d-flex justify-content-center align-items-center">
      <img
        :src="
          require('@/assets/media/photos/404-page' +
            (darkMode ? '-dark' : '') +
            '.svg')
        "
        class="mt-5"
      />
    </b-col>
    <b-col
      cols="12"
      class="d-flex justify-content-center align-items-center mt-3"
    >
      <span
        class="font-size-24 font-w600"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      >
        {{ $t("page_not_found") }}
      </span>
    </b-col>
    <b-col
      cols="12"
      class="d-flex justify-content-center align-items-center mt-3"
    >
      <span :class="darkMode ? 'text-dark' : 'text-light'" class="font-w400">
        {{ `${$t("page_not_available")}.` }}
      </span>
    </b-col>
    <b-col
      cols="12"
      class="d-flex justify-content-center align-items-center mt-3"
    >
      <main-button
        @click="
          $router.push({ name: 'Data', params: { service: currentNetwork } })
        "
        class="px-5 mt-2"
        :label="$t('go_homepage')"
        :active="true"
        :large="true"
        :block="false"
      />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import MainButton from "@/components/common/Button.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    MainButton
  }
})
export default class PageNotFound extends BaseComponent {}
</script>

<style lang="scss" scoped></style>
