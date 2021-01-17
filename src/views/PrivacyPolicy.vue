<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div class="mt-2">
          <h1 :class="headingsMode">
            {{ title }}
          </h1>
          <div v-for="content in contents" :key="content.id">
            <h2 :class="headingsMode">
              {{ content.subtitle }}
            </h2>
            <p>
              {{ content.subcontent }}
            </p>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import { i18n } from "@/i18n";

@Component
export default class PrivacyPolicy extends BaseComponent {
  get headingsMode() {
    return this.darkMode ? "headings-dark" : "headings-light";
  }

  get title() {
    return i18n.t("privacy_policy");
  }

  get contents() {
    return [
      {
        id: 1,
        subtitle: i18n.t("about_us"),
        subcontent: i18n.t("about_us_content")
      },
      {
        id: 2,
        subtitle: i18n.t("acceptance_policy"),
        subcontent: i18n.t("acceptance_policy_content")
      },
      {
        id: 3,
        subtitle: i18n.t("changes_privacy_policy"),
        subcontent: i18n.t("changes_privacy_policy_content")
      },
      {
        id: 4,
        subtitle: i18n.t("info"),
        subcontent: i18n.t("info_content")
      },
      {
        id: 5,
        subtitle: i18n.t("disclosure_info"),
        subcontent: i18n.t("disclosure_info_content")
      },
      {
        id: 6,
        subtitle: i18n.t("cookies_statement"),
        subcontent: i18n.t("cookies_statement_content")
      },
      {
        id: 7,
        subtitle: i18n.t("security"),
        subcontent: i18n.t("security_content")
      },
      {
        id: 8,
        subtitle: i18n.t("processing_transferring"),
        subcontent: i18n.t("processing_transferring_content")
      },
      {
        id: 9,
        subtitle: i18n.t("your_rights"),
        subcontent: i18n.t("your_rights_content")
      },
      {
        id: 10,
        subtitle: i18n.t("notices"),
        subcontent: i18n.t("notices_content")
      },
      {
        id: 11,
        subtitle: i18n.t("contact_us"),
        subcontent: i18n.t("contact_us_content") + " : privacy@bancor.network"
      }
    ];
  }
}
</script>

<style lang="scss"></style>
