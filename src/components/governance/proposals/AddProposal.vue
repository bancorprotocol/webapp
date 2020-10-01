<template>
  <content-block>
    <multi-input-field
      v-model="name"
      type="text"
      placeholder="Add Liquidity pool xyz"
      label="Proposal Name"
    />
    <label-content-split label="Description" class="mb-2" />
    <b-form-textarea
      v-model="description"
      placeholder="I would like to propose to ..."
      rows="8"
      :class="[
        !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
        'font-size-14'
      ]"
    />
    <multi-input-field
      v-model="contractAddress"
      type="text"
      placeholder="0x0"
      label="Contract to Execute"
    />
    <multi-input-field
      v-model="githubUrl"
      type="url"
      placeholder="https://github.com/..."
      label="Github Url"
    />
    <multi-input-field
      v-model="discourseUrl"
      type="url"
      placeholder="https://www.reddit.com/r/Bancor/comments/iv39oc"
      label="Discourse Url"
    />
    <content-block>
      <main-button @click="saveToIPFS" label="Propose" />
    </content-block>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: {
    MultiInputField,
    ContentBlock,
    LabelContentSplit,
    MainButton
  }
})
export default class AddProposal extends Vue {
  discourseUrl: string = "";
  githubUrl: string = "";
  contractAddress: string = "";
  description: string = "";
  name: string = "";

  get darkMode() {
    return vxm.general.darkMode;
  }

  async saveToIPFS() {
    const proposalMetaData = {
      payload: {
        body: this.description,
        metadata: {
          github: this.githubUrl,
          discourse: this.discourseUrl
        },
        name: this.name
      },
      timestamp: parseInt((Date.now() / 1000).toString()),
      revision: "0.0.1"
    };

    const hash = await vxm.ethGovernance.storeInIPFS({
      proposalMetaData
    });

    await vxm.ethGovernance.propose({
      account: vxm.wallet.isAuthenticated,
      executor: this.contractAddress,
      hash
    });
  }
}
</script>

<style lang="scss"></style>
