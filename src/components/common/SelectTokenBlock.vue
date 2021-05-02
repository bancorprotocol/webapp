<template>
  <div>
    <gray-border-block
      @click.native="clickAction"
      :class="type === 'primary' ? 'cursor' : ''"
    >
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <pool-logos
            v-if="token"
            :token="token"
            :cursor="type === 'primary'"
          />
          <span v-else class="font-size-14 font-w600">
            {{ $t("select_token") }}</span
          >
        </div>
        <div :class="darkMode ? 'text-white' : 'text-primary'">
          <span
            v-if="token && type === 'primary'"
            class="font-size-12 font-w500 cursor"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ $t("remove") }}
          </span>
          <font-awesome-icon v-else-if="type === 'primary'" icon="caret-down" />
        </div>
      </div>
    </gray-border-block>

    <modal-token-select
      v-model="modal"
      :tokens="tokens"
      @select="select"
      :allow-token-add="type == 'primary'"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, VModel } from "vue-property-decorator";
import { vxm } from "@/store/";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ModalTokenSelect from "@/components/modals/ModalSelects/ModalTokenSelect.vue";
import { ViewToken } from "@/types/bancor";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { ModalTokenSelect, PoolLogos, GrayBorderBlock }
})
export default class SelectTokenBlock extends BaseComponent {
  @Prop({ default: "primary" }) type!: "primary" | "secondary";
  @VModel() token!: ViewToken | null;

  modal = false;

  select(id: string) {
    if (this.type === "primary") {
      this.token = this.primaryReserveOptions.find((x: any) => x.id === id);
    } else {
      this.token = this.secondaryReserveOptions.find((x: any) => x.id === id);
    }
  }

  clickAction() {
    if (this.type === "secondary") return;
    if (this.token && this.type === "primary") this.removeToken();
    else this.modal = true;
  }

  @Emit("remove")
  removeToken() {
    return this.token!.id;
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
}
</script>
<style lang="scss">
// @import "../../../assets/_scss/custom/variables";
</style>
