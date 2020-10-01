<template>
  <content-block>
    <multi-input-field
      type="text"
      placeholder="Add Liquidity pool xyz"
      label="Proposal Name"
    />
    <label-content-split label="Description" class="mb-2" />
    <b-form-textarea
      placeholder="I would like to propose to ..."
      rows="8"
      :class="[
        !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
        'font-size-14'
      ]"
    />
    <multi-input-field
      type="text"
      placeholder="0x0"
      label="Contract to Execute"
    />
    <multi-input-field
        type="text"
        placeholder="https://github.com/..."
        label="Github Url"
    />
    <multi-input-field
        type="text"
        placeholder="https://www.reddit.com/r/Bancor/comments/iv39oc"
        label="Discourse Url"
    />
  </content-block>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";

@Component({
  components: {
    MultiInputField,
    ContentBlock,
    LabelContentSplit
  }
})
export default class AddProposal extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
