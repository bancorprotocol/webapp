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
      CONTENT
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
</style>
