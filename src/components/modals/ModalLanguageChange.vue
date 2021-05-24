<template>
  <modal-base v-model="modal" size="sm">
    <b-row class="d-flex justify-content-center mb-4">
      <b-col class="text-center">
        <span>
          <font-awesome-icon
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
            :icon="['fal', 'globe']"
            size="4x"
          />
          <font-awesome-icon
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
            :icon="['fal', 'language']"
            size="3x"
          />
        </span>
        <div
          :class="darkMode ? 'text-dark' : 'text-light'"
          class="font-size-24 font-w600 mb-3"
        >
          {{ $t("language_change") }}
        </div>
        <div
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          class="font-size-16 font-w400 mb-3"
        >
          {{ $t("translations_community") }}
        </div>
        <div
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          class="font-size-16 font-w400"
        >
          {{ $t("suggest_edits") }}
        </div>
        <a
          href="https://support.bancor.network/hc/en-us/articles/360021725059-How-to-add-new-languages-to-bancor-network"
          target="_blank"
          :class="darkMode ? 'text-link-muted-dark' : 'text-link-muted-light'"
          class="font-size-16 font-w400"
        >
          {{ $t("press_here_info") }}
        </a>
      </b-col>
    </b-row>
  </modal-base>
</template>

<script lang="ts">
import { Component, VModel } from "vue-property-decorator";
import ModalBase from "@/components/modals/ModalBase.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: {
    ModalBase,
    MainButton
  }
})
export default class ModalLanguageChange extends BaseComponent {
  @VModel({ type: Boolean }) modal!: boolean;
}
</script>
<style lang="scss"></style>
