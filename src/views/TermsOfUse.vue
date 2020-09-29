<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div class="mt-2">
          <h1 :class="headingsMode">
            {{ title }}
          </h1>
          <div v-html="intro"></div>
          <div v-for="content in contents" :key="content.id">
            <h2 :class="headingsMode">
              {{ content.id + `. ` + content.subtitle }}
            </h2>
            <div v-html="content.html"></div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class TermsOfUse extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }

  get headingsMode() {
    return vxm.general.darkMode ? "headings-dark" : "hedadings-light";
  }

  get title() {
    return vxm.termsofuse.title;
  }

  get contents() {
    return vxm.termsofuse.contents;
  }

  get intro() {
    return vxm.termsofuse.intro;
  }
}
</script>

<style lang="scss"></style>
