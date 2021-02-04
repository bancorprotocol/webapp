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

    <div v-if="!(txBusy || success || error)" class="w-100">
      <b-alert show variant="warning" class="mb-3 p-3 font-size-14 alert-over">
        New proposal requires you to hold at least
        {{ proposalMinimumFormatted }} {{ symbol }} which will be locked up to
        {{ maxLock }}h.
      </b-alert>

      <multi-input-field
        class="mb-3"
        v-model="discourseUrl"
        @input="onDiscourseInput"
        type="url"
        placeholder="https://gov.bancor.network/t/..."
        height="48"
        label="Discourse Url"
      />

      <template v-if="name || description">
        <label-content-split label="Title and description" class="mb-2" />

        <b-form-textarea
          v-model="name"
          readonly
          no-resize
          size="sm"
          placeholder="Add Liquidity pool xyz"
          class="combo combo--title"
          :class="[
            !darkMode ? 'form-control-alt-light' : 'form-control-alt-dark'
          ]"
        />
        <b-form-textarea
          class="mb-3 combo combo--desc"
          v-model="description"
          max-rows="4"
          readonly
          no-resize
          placeholder="I would like to propose to ..."
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
        placeholder="0x0000000000000000000000000000000000000000"
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
    </div>

    <action-modal-status
      v-else
      :error="error"
      :success="success"
      step-description="Creating Proposal"
    />

    <main-button
      @click="propose"
      class="mt-3"
      :label="proposeButton"
      :active="true"
      :large="true"
      :disabled="!success && (this.hasError || txBusy)"
    />
  </modal-base>
</template>

<script lang="ts">
import { Component, VModel } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import { isAddress } from "web3-utils";
import { formatNumber } from "@/api/helpers";
import { ProposalMetaData } from "@/store/modules/governance/ethGovernance";
import BaseComponent from "@/components/BaseComponent.vue";
import { TxResponse } from "@/types/bancor";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";

@Component({
  components: {
    MultiInputField,
    ContentBlock,
    LabelContentSplit,
    MainButton,
    ActionModalStatus,
    ModalBase,
    AlertBlock
  }
})
export default class AddProposal extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;

  discourseUrl: string = "";
  githubUrl: string = "";
  contractAddress: string = "";
  description: string = "";
  name: string = "";
  error: string = "";
  inputError: boolean = false;
  maxLock: number = 0;
  proposalMinimum: number = 0;
  symbol: string = "";
  txBusy = false;
  success: TxResponse | null = null;

  get proposeButton() {
    return this.error
      ? "Try Again"
      : this.success
      ? "Close"
      : this.txBusy
      ? "processing ..."
      : "Propose";
  }

  get proposalMinimumFormatted() {
    return formatNumber(this.proposalMinimum, 2);
  }

  async onDiscourseInput(input: string) {
    const parseIdRegex = new RegExp("\\/(\\d+)\\/?");
    const match = input.match(parseIdRegex);
    if (match) {
      const topicId = match[1];
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
    this.inputError = !isAddress(input);
  }

  get hasError() {
    return (
      this.inputError ||
      this.discourseUrl.length === 0 ||
      this.githubUrl.length === 0 ||
      this.description.length === 0 ||
      this.contractAddress.length === 0 ||
      this.name.length === 0
    );
  }

  async propose() {
    if (this.success || this.error) {
      this.setDefault();
      this.error = "";
      this.success = null;
      this.txBusy = false;
      return;
    }

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

    try {
      this.txBusy = true;
      this.error = "";
      // store in ipfs!
      const hash = await vxm.ethGovernance.storeInIPFS({
        proposalMetaData
      });

      // propose!
      const txHash = await vxm.ethGovernance.propose({
        account: this.currentUser,
        executor: this.contractAddress,
        hash
      });

      this.success = await vxm.ethBancor.createTxResponse(txHash);

      this.setDefault();
    } catch (e) {
      this.error = e.message;
    } finally {
      this.txBusy = false;
    }
  }

  async updateMaxLock() {
    const [voteDuration, voteLockDuration] = await Promise.all([
      vxm.ethGovernance.getVoteDuration(),
      vxm.ethGovernance.getVoteLockDuration()
    ]);

    this.maxLock = Math.max(voteDuration, voteLockDuration) / 60 / 60;
  }

  async created() {
    await this.updateMaxLock();
    this.proposalMinimum = await vxm.ethGovernance.getNewProposalMinimum();
    this.symbol = await vxm.ethGovernance.getSymbol();
  }

  setDefault() {
    this.description = "";
    this.name = "";
    this.discourseUrl = "";
    this.githubUrl = "";
    this.contractAddress = "";

  }

  onHide() {
    this.show = false;
    this.error = "";
    this.success = null;
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.combo {
  &#{&}--title {
    border-bottom-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom: 0 !important;
    font-weight: 500 !important;
  }

  &#{&}.form-control-alt-light {
    background-color: $block-bg-blue !important;
  }

  &#{&}--desc {
    border-top-right-radius: 0 !important;
    border-top-left-radius: 0 !important;
    border-top: 0 !important;
    min-height: 0 !important;
    max-height: 999999px !important;
    padding-bottom: 16px;
  }
}
</style>
