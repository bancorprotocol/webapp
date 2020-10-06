<template>
  <b-modal
    scrollable
    centered
    v-model="show"
    hide-footer
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
  >
    <template slot="modal-header">
      <div class="w-100">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-between mb-2">
            <span
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              Create Proposal
            </span>
            <font-awesome-icon
              class="cursor font-size-lg"
              :class="darkMode ? 'text-dark' : 'text-light'"
              @click="onHide"
              icon="times"
            />
          </b-col>
        </b-row>
      </div>
    </template>

    <b-alert show variant="warning" class="mb-3 p-3 font-size-14 alert-over">
      New proposal requires you to hold at least {{ 2 }} {{ symbol }} which will
      be locked for 72 hrs.
    </b-alert>

    <multi-input-field
      class="mb-3"
      v-model="discourseUrl"
      @input="onDiscourseInput"
      type="url"
      placeholder="https://gov.bancor.network/t/solution-to-make-voting-www-affordable/31"
      height="48"
      label="Discourse Url"
    />

    <template v-if="name || description">
      <label-content-split label="Title and description" class="mb-2" />

      <b-form-input
        v-model="name"
        type="text"
        height="48"
        placeholder="Add Liquidity pool xyz"
        class="combo combo--title"
        :class="[
          !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
          fontSizeClass
        ]"
      />
      <b-form-textarea
        class="mb-3 combo combo--desc"
        v-model="description"
        placeholder="I would like to propose to ..."
        rows="8"
        :class="[
          !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark',
          'font-size-14'
        ]"
      />
    </template>

    <multi-input-field
      class="mb-3"
      v-model="contractAddress"
      @input="onAddressInput"
      type="text"
      placeholder="0x0..."
      height="48"
      label="Contract address"
    />
    <multi-input-field
      class="mb-3"
      v-model="githubUrl"
      type="url"
      placeholder="https://github.com/..."
      height="48"
      label="Github URL"
    />
    <div class="pt-3" />

    <main-button
      @click="propose"
      label="Propose"
      :large="true"
      :active="true"
      :disabled="this.hasError"
    />
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import { isAddress } from "web3-utils";
import { VModel } from "@/api/helpers";
import { ProposalMetaData } from "@/store/modules/governance/ethGovernance";

@Component({
  components: {
    MultiInputField,
    ContentBlock,
    LabelContentSplit,
    MainButton
  }
})
export default class AddProposal extends Vue {
  @VModel({ type: Boolean }) show!: boolean;

  discourseUrl: string = "";
  githubUrl: string = "";
  contractAddress: string = "";
  description: string = "";
  name: string = "";
  error: boolean = false;

  get darkMode() {
    return vxm.general.darkMode;
  }

  async onDiscourseInput(input: string) {
    const parseIdRegex = new RegExp("\\/(\\d+)\\/?");
    const match = input.match(parseIdRegex);
    console.log(match);
    if (match) {
      const topicId = match[1];

      console.log(topicId);
      if (topicId) {
        const result = await vxm.ethGovernance.getTopicFromDiscourse({
          topicId
        });

        this.description = result.description;
        this.name = result.title;
      }
    }
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

    const proposalMetaData: ProposalMetaData = {
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

    this.onHide();
  }

  onHide() {
    this.show = false;
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.combo {
  @at-root body &#{&} {
    color: $text-muted-light;
    pointer-events: none;
  }

  &#{&}--title {
    border-bottom-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom: 0 !important;
    font-weight: 500;
    height: 48px;
  }
  &#{&}--desc {
    border-top-right-radius: 0 !important;
    border-top-left-radius: 0 !important;
    border-top: 0 !important;
    height: 120px !important;
    min-height: 120px !important;
    max-height: 120px !important;
  }
}
</style>
