<template>
  <div>
    <content-block class="mb-3 pt-3" :no-header="true" :shadow="true">
      <sub-navigation />

      <div>
        <main-button
          @click="modal = true"
          :label="$t('join_pool')"
          :active="true"
          :large="true"
        />
        <modal-pool-select
          @select="selectPool"
          v-model="modal"
          :pools="pools"
        />
        <your-liquidity />
      </div>
    </content-block>
    <div class="d-flex justify-content-center">
      <router-link
        :to="{ name: 'PoolCreate' }"
        class="cursor font-w700 mb-3"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        <font-awesome-icon icon="plus" class="mr-2" />{{ $t("create_pool") }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import SubNavigation from "@/components/layout/SubNavigation.vue";
import MainButton from "@/components/common/Button.vue";
import YourLiquidity from "@/components/pool/YourLiquidity.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { ViewRelay } from "@/types/bancor";
import BigNumber from "bignumber.js";

@Component({
  components: {
    YourLiquidity,
    MainButton,
    SubNavigation,
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
