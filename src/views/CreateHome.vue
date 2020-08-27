<template>
  <content-block class="mb-3">
    <template slot="header">
      <pool-actions-header title="Create a Pool" @back="back" />
    </template>

    <div class="mt-3">
      <label-content-split label="Pool Type">
        <b-badge variant="primary" size="sm" class="px-2">V1</b-badge>
      </label-content-split>

      <div v-if="step == 1">
        <alert-block
          class="mt-3"
          variant="info"
          msg="In Bancor V1 total reserve of the pool you create should be less or equal 100%."
        />

        <token-input-field
          class="mt-3"
          label="Input"
          v-model="amount1"
          :token="token1"
          :tokens="secondaryReserveOptions"
          @select="selectToken1"
          :balance="balance1"
          :error-msg="errorToken1"
        />

        <token-input-field
          class="mt-3"
          label="Input"
          v-model="amount2"
          :token="token2"
          :balance="balance2"
          :tokens="primaryReserveOptions"
          @select="selectToken2"
          :dropdown="true"
          :error-msg="errorToken2"
        />

        <p v-if="true">{{ existingPoolWarning }}</p>
        <main-button
          @click="nextStep"
          class="mt-4"
          label="Continue"
          :active="true"
          :large="true"
          :loading="false"
          :disabled="false"
        />
      </div>

      <div v-if="step == 2">
        <b-form-input
          type="text"
          v-model="poolSymbol"
          style="border-right: 0 !important;"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          placeholder="Pool Symbol"
        ></b-form-input>
        <b-form-input
          type="text"
          v-model="poolName"
          style="border-right: 0 !important;"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          placeholder="Pool Name"
        ></b-form-input>
        <b-form-input
          type="number"
          v-model.number="decimals"
          style="border-right: 0 !important;"
          :class="darkMode ? 'form-control-alt-dark' : 'form-control-alt-light'"
          placeholder="Decimals"
        ></b-form-input>

        <main-button
          @click="promptModal"
          class="mt-4"
          label="Create Pool"
          :active="true"
          :large="true"
          :disabled="false"
        />
      </div>
      <modal-base title="Create Pool" v-model="modal">
        <p>Doing things and stuff...</p>

        {{ currentStatus }}
        <main-button
          @click="createPool"
          class="mt-4"
          :label="createPoolLabel"
          :active="true"
          :large="true"
          :disabled="txBusy"
        />
      </modal-base>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolActionsHeader from "@/components/pool/PoolActionsHeader.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import { ViewToken, TxResponse, Step } from "@/types/bancor";
import MainButton from "@/components/common/Button.vue";
import ModalCreateAction from "@/components/pool/create/ModalCreateAction.vue"
import ModalTokenSelect from "@/components/modals/ModalSelects/ModalTokenSelect.vue";
import SearchInputField from "@/components/common/SearchInputField.vue";
import { compareString } from '../api/helpers';


@Component({
  components: {
    ModalTokenSelect,
    TokenInputField,
    AlertBlock,
    LabelContentSplit,
    PoolActionsHeader,
    ContentBlock,
    MainButton,
    ModalCreateAction,
    ModalBase,
    SearchInputField
  }
})
export default class CreateHome extends Vue {
  amount1 = "";
  amount2 = "";

  searchTerm = ""

  token1: ViewToken = vxm.bancor.token(vxm.bancor.newNetworkTokenChoices[0].id);
  token2: ViewToken = vxm.bancor.tokens[1];

  errorToken1 = "";
  errorToken2 = "";

  fee = 0
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;

  poolName = ""
  poolSymbol = ""
  decimals = 18;

  modal: boolean = false;

  step = 1;

  selectToken1(id: string) {
    console.log(id, 'token 1 selected')
  }

  selectToken2(id: string) {
    console.log(id, 'token 2 selected');
  }

  get createPoolLabel() {
    return this.txBusy ? 'Processing..': 'Create Pool'
  }

  get existingPoolWarning() {
    return this.existingPool ? "A pool like this already exists" : ""
  }


  get existingPool() {
    const suggestion = [this.token1.id, this.token2.id].map(tokenId => ({ tokenId, decReserveWeight: '0.5'}))
    const relays = vxm.ethBancor.relays;
    const existingPooll = relays.find(relay => relay.reserves.every(r => suggestion.some(token => compareString(token.tokenId, r.id))))
    if (existingPooll) {
      console.log(existingPooll, 'is the existing pool')
      return true;
    } else {
      console.log('no pool found')
      return false
    }
  }

  get primaryReserveOptions() {
    const result = vxm.ethBancor.primaryReserveChoices(this.token1.id).map(x => ({...x, logo: x.img}))
    return result
  }

  get secondaryReserveOptions() {
    return vxm.ethBancor.secondaryReserveChoices.map(x => ({...x, logo: x.img}))
  }


  back() {
    const atStart = this.step == 1
    if (atStart) {
      this.$router.push({ name: "Pool" })
    } else {
      this.prevStep()
    }
  }

  onUpdate(index: number, steps: any[]) {
    this.sections = steps;
    this.stepIndex = index;
  }

  get currentStatus() {
    if (this.sections.length) {
      return this.sections[this.stepIndex].description
    }
    return ''
  }

  async createPool() {
    const tokens = [this.token1.id, this.token2.id].map(tokenId => ({ tokenId, decReserveWeight: '0.4'}))
    this.txBusy = true;
    this.error = ''
    try {
      const res = await vxm.ethBancor.createV1Pool({ onUpdate: this.onUpdate, reserves: tokens,  poolName: this.poolName, poolSymbol: this.poolSymbol, decimals: this.decimals, decFee: '0.01' })
    } catch(e) {
      this.error = e.message;
    } finally {
      this.modal = false;
      this.txBusy = false;
    }
  }
  nextStep() {
    this.step++
  }

  prevStep() {
    this.step--
  }


  get tokenChoices() {
    return vxm.bancor.tokens
  }

  get balance1() {
    return vxm.bancor.token(this.token1.id).balance ?? "0";
  }

  get balance2() {
    return vxm.bancor.token(this.token2.id).balance ?? "0";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  toggleModal() {
    this.modal = !this.modal
  }

  async promptModal() {
    if (this.isAuthenticated) this.toggleModal()
    //@ts-ignore
    else await this.promptAuth();

  }


}
</script>

<style scoped lang="scss"></style>
