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
              {{ $t("create_proposal") }}
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
        {{
          $t("new_proposal_requires") +
          proposalMinimumFormatted +
          symbol +
          $t("will_be_locked") +
          maxLock +
          $t("will_be_locked") +
          "."
        }}
      </b-alert>

      <multi-input-field
        class="mb-3"
        v-model="discourseUrl"
        @input="onDiscourseInput"
        type="url"
        placeholder="https://gov.bancor.network/t/..."
        height="48"
        :label="$t('discourse_url')"
      />

      <template v-if="name || description">
        <label-content-split :label="$t('title_description')" class="mb-2" />

        <b-form-textarea
          v-model="name"
          readonly
          no-resize
          size="sm"
          max-rows="2"
          :placeholder="$t('add_liquidity_pool_xyz')"
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
          no-resize="true"
          :placeholder="`${$t('i_propose')}...`"
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
        :label="$t('contract_address')"
      />
      <multi-input-field
        class="mb-3"
        v-model="githubUrl"
        type="url"
        placeholder="https://github.com/..."
        height="48"
        :label="$t('github_url')"
      />
      <div class="pt-3" />
    </div>

    <action-modal-status
      v-if="txBusy || error || success"
      :error="error"
      :success="success"
    />

    <main-button
      @click="propose"
      :label="proposeButton"
      :large="true"
      :active="true"
      :disabled="!success && (this.hasError || txBusy)"
    />
  </b-modal>
</template>

<script lang="ts">
import { Component, VModel } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
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

@Component({
  components: {
    MultiInputField,
    ContentBlock,
    LabelContentSplit,
    MainButton,
    ActionModalStatus
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
      ? i18n.t("try_again")
      : this.success
      ? i18n.t("close")
      : this.txBusy
      ? `${i18n.t("processing")}...`
      : i18n.t("propose");
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
    if (this.success) {
      this.setDefault();
      this.onHide();
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
      this.success = {
        txId: txHash,
        blockExplorerLink: await vxm.ethBancor.createExplorerLink(hash)
      };

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
