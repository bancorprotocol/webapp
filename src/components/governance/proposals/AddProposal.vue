<template>
  <content-block>
    <multi-input-field
      class="mb-3"
      v-model="name"
      type="text"
      height="48"
      placeholder="Add Liquidity pool xyz"
      label="Proposal Name"
    />
    <label-content-split label="Proposal Description" class="mb-2" />
    <b-form-textarea
      class="mb-3"
      v-model="description"
      placeholder="I would like to propose to ..."
      rows="8"
      :class="[
        !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
        'font-size-14'
      ]"
    />
    <multi-input-field
      class="mb-3"
      v-model="contractAddress"
      @input="onAddressInput"
      type="text"
      placeholder="0x0..."
      height="48"
      label="Contract to Execute"
    />
    <multi-input-field
      class="mb-3"
      v-model="githubUrl"
      type="url"
      placeholder="https://github.com/..."
      height="48"
      label="Github Url"
    />
    <multi-input-field
      class="mb-3"
      v-model="discourseUrl"
      type="url"
      placeholder="https://www.reddit.com/r/Bancor/comments/iv39oc"
      height="48"
      label="Discourse Url"
    />

    <div class="pt-3" />

    <main-button
      @click="propose"
      label="Propose"
      :large="true"
      :active="!this.hasError"
    />
  </content-block>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import { isAddress } from "web3-utils";

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
  error: boolean = false;

  get darkMode() {
    return vxm.general.darkMode;
  }

  onAddressInput(input: string) {
    this.error = !isAddress(input);
  }

  get hasError() {
    return (
      this.error ||
      this.discourseUrl.length === 0 ||
      this.githubUrl.length === 0 ||
      this.description.length === 0 ||
      this.contractAddress.length === 0 ||
      this.name.length === 0
    );
  }

  async propose() {
    if (this.hasError) {
      return;
    }

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

    // store in ipfs!
    const hash = await vxm.ethGovernance.storeInIPFS({
      proposalMetaData
    });

    // propose!
    await vxm.ethGovernance.propose({
      account: vxm.wallet.isAuthenticated,
      executor: this.contractAddress,
      hash
    });
  }
}
</script>

<style lang="scss"></style>
