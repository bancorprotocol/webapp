<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div class="mt-2">
          <h1 :class="headingsMode">
            {{title}}
          </h1>
          <div v-for="content in contents" :key="content.id">
            <h2 :class="headingsMode">{{content.subtitle}}</h2>
            <p>{{content.subcontent}}</p>
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
export default class PrivacyPolicy extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }

  get headingsMode() {
    return vxm.general.darkMode ? 'headings-dark' : 'headings-light';
  }

  get title() {
    return vxm.privacypolicy.title;
  }

  get contents() {
    console.log("privacypolicy", vxm.privacypolicy.contents);
    return vxm.privacypolicy.contents;
  }
}
</script>

<style lang="scss"></style>
