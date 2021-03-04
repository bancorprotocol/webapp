<template>
  <div>
    <b-row>
      <b-col>
        <p
          class="font-size-14 font-w400 my-3 mb-5"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("manage_pool_tokens") }}
        </p>

        <pool-token />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MainButton from "@/components/common/Button.vue";
import YourLiquidity from "@/components/pool/YourLiquidity.vue";
import PoolToken from "@/components/pool/PoolToken.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { ViewRelay } from "@/types/bancor";
import BigNumber from "bignumber.js";

@Component({
  components: {
    PoolToken,
    YourLiquidity,
    MainButton,
    ModalPoolSelect,
    ContentBlock
  }
})
export default class PoolHome extends BaseComponent {
  modal = false;

  get pools() {
    return vxm.bancor.relays;
  }

  selectPool(id: string) {
    const pool: ViewRelay = vxm.bancor.relay(id);
    if (!pool) {
      this.modal = false;
      return;
    }
    if (pool.addProtectionSupported) {
      this.$router.push({
        name: "AddProtectionSingle",
        params: { id }
      });
    } else {
      this.$router.push({
        name: "PoolAction",
        params: { poolAction: "add", account: id }
      });
    }

    this.modal = false;
  }
}
</script>

<style scoped lang="scss"></style>
