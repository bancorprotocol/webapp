<template>
  <div>
    <content-block class="mb-3" :shadow="true">
      <template slot="header">
        <sub-navigation />
      </template>

      <div>
        <main-button
          label="Join a Pool"
          :active="true"
          :large="true"
          @click="modal = true"
        />
        <modal-pool-select
          v-model="modal"
          :pools="pools"
          @select="selectPool"
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
        <font-awesome-icon icon="plus" class="mr-2" />Create Pool
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import SubNavigation from "@/components/layout/SubNavigation.vue";
import MainButton from "@/components/common/Button.vue";
import YourLiquidity from "@/components/pool/YourLiquidity.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";

@Component({
  components: {
    YourLiquidity,
    MainButton,
    SubNavigation,
    ModalPoolSelect,
    ContentBlock
  }
})
export default class PoolHome extends Vue {
  modal = false;

  get pools() {
    return vxm.bancor.relays;
  }

  selectPool(id: string) {
    const whitelisted = vxm.bancor.relay(id).whitelisted;
    if (whitelisted) {
      void this.$router.push({
        name: "PoolAdd",
        params: { id }
      });
    } else {
      void this.$router.push({
        name: "PoolAction",
        params: { poolAction: "add", account: id }
      });
    }

    this.modal = false;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
