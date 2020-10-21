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
      <span class="text-primary font-size-24 font-w600">Page not found</span>
    </b-col>
    <b-col
      cols="12"
      class="d-flex justify-content-center align-items-center mt-3"
    >
      <span :class="darkMode ? 'text-dark' : 'text-light'" class="font-w400"
        >The page you're looking for is not available.</span
      >
    </b-col>
    <b-col
      cols="12"
      class="d-flex justify-content-center align-items-center mt-3"
    >
      <main-button
        class="px-5 mt-2"
        label="Go to homepage"
        :active="true"
        :large="true"
        :block="false"
        @click="
          $router.push({ name: 'Swap', params: { service: selectedNetwork } })
        "
      />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: {
    MainButton
  }
})
export default class PageNotFound extends Vue {
  get selectedNetwork() {
    return vxm.bancor.currentNetwork;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss" scoped></style>
