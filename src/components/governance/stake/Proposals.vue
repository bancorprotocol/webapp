<template>
  <content-block title="Proposals" :shadow-light="true">
    <div class="pt-2">
      <div class="float-right mr-2">
        + add
      </div>
      <b-tabs no-fade :class="darkMode ? 'tabs-dark' : 'tabs-light'">
        <b-tab title="Open" active>
          Open
        </b-tab>
        <b-tab title="Done">
          Done
        </b-tab>
      </b-tabs>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";

@Component({
  components: {
    ContentBlock,
  }
})
export default class Stake extends Vue {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
