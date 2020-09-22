<template>
  <b-modal
    scrollable
    :size="size"
    centered
    v-model="show"
    hide-footer
    :content-class="contentClass"
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
              >Stake</span
            >
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

    <div>
      <div class="font-size-12 font-w500" :class="darkMode ? 'text-muted-dark' : 'text-muted-light'">
        <span class="text-uppercase">Stake your tokens</span>
        <span class="float-right">Balance: {{120}} gBTN</span>
      </div>

      <div class="input-currency mt-1">
        <b-form-input type="number" size="lg" class="input-currency__input"></b-form-input>
        <div class="input-currency__append pr-3">
          <img
            class="img-avatar img-avatar32 bg-dark input-currency__img mr-2 ml-3"
            src="@/assets/media/logos/bancor-white2.png">

          <span class=" font-size-14 font-w500">gBNT</span>
        </div>
        
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { vxm } from "@/store/";
import {
  Component,
  Prop,
  PropSync,
  Vue,
  Emit,
  Model
} from "vue-property-decorator";
import { VModel } from "@/api/helpers";
import MultiInputField from "@/components/common/MultiInputField.vue";
@Component({
  components: { MultiInputField }
})
export default class ModalBase extends Vue {
  @VModel({ type: Boolean }) show!: boolean;

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  onHide() {
    this.show = false;
  }
}
</script>
<style lang="scss">
.modal-body {
  padding-top: 0 !important;
}
.input-currency {
  border-right: 0 !important;
  position: relative;

  &__append {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    height: 100%;
    right: 0;
  }
  &__img {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e6ebf2;
    padding: 4px;
  }
  &__input {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type=number] {
      -moz-appearance: textfield;
    }
  }
}
</style>
