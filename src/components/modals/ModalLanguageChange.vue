<template>
  <modal-base v-model="modal" size="sm">
    <b-row>
      <b-col class="text-center">
        <img
          :src="require(`@/assets/media/icons/language.svg`)"
          alt="language"
        />
        <div
          :class="darkMode ? 'text-dark' : 'text-light'"
          class="font-size-24 font-w600 mb-3"
        >
          {{ $t("language_change") }}
        </div>
        <div
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          class="font-size-16 font-w400 mb-2 text-left mx-3"
        >
          {{ $t("translations_community") }}
          {{ $t("suggest_edits") }}
        </div>
        <div class="text-left ml-3 mb-5">
          <a
            href="https://support.bancor.network/hc/en-us/articles/360021725059-How-to-add-new-languages-to-bancor-network"
            target="_blank"
            :class="darkMode ? 'text-link-muted-dark' : 'text-link-muted-light'"
            class="font-size-16 font-w400"
          >
            {{ $t("press_here_info") }}
          </a>
        </div>
        <div
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          class="font-size-14 font-w400"
        >
          You can change language in the settings menu
        </div>
        <main-button
          @click="onHide"
          :label="$t('close')"
          :large="true"
          :active="true"
          class="font-size-14 font-w400 mt-3"
        />
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

  onHide() {
    this.modal = false;
  }
}
</script>
<style lang="scss"></style>
