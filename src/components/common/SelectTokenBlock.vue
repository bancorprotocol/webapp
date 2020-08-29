<template>
  <div>
    <gray-border-block class="cursor">
      <div
        @click="modal = true"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          <pool-logos v-if="token" :token="token" />
          <span v-else class="font-size-14 font-w600">Select a token</span>
        </div>
        <div>
          <font-awesome-icon
            icon="caret-down"
            :class="darkMode ? 'text-white' : 'text-primary'"
          />
        </div>
      </div>
    </gray-border-block>

    <modal-token-select
      v-model="modal"
      :tokens="tokens"
      @select="select"
      :allowTokenAdd="type == 'primary'"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ModalTokenSelect from "@/components/modals/ModalSelects/ModalTokenSelect.vue";
import { VModel } from "@/api/helpers";
import { ViewModalToken, ViewToken } from "@/types/bancor";

@Component({
  components: { ModalTokenSelect, PoolLogos, GrayBorderBlock }
})
export default class SelectTokenBlock extends Vue {
  @Prop({ default: "primary" }) type!: "primary" | "secondary";
  @VModel() token?: ViewToken;

  modal = false;

  select(id: string) {
    if (this.type === "primary") {
      this.token = this.primaryReserveOptions.find((x: any) => x.id === id);
    } else {
      this.token = this.secondaryReserveOptions.find((x: any) => x.id === id);
    }
  }

  get tokens() {
    return this.type === "primary"
      ? this.primaryReserveOptions
      : this.secondaryReserveOptions;
  }

  get primaryReserveOptions() {
    const result = vxm.bancor
      .primaryReserveChoices("0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c")
      .map((x: any) => ({ ...x, logo: x.img }));
    return result;
  }

  get secondaryReserveOptions() {
    return vxm.bancor.secondaryReserveChoices.map((x: any) => ({
      ...x,
      logo: x.img
    }));
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>
<style lang="scss">
// @import "../../../assets/_scss/custom/variables";
</style>
