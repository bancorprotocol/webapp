<template>
  <div class="mt-3">
    <stake-buttons @click="openModal" />

    <modal-pool-select
      v-model="modal"
      :pools="pools"
      :show-token-balance="showTokenBalance"
      @select="selectPool"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import MainButton from "@/components/common/Button.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import StakeButtons from "@/components/protection/StakeButtons.vue";

@Component({
  components: {
    StakeButtons,
    GrayBorderBlock,
    MainButton,
    ModalPoolSelect
  }
})
export default class AddProtectionHome extends Vue {
  modal = false;

  singleMode: boolean | null = null;
  showTokenBalance = false;

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.liquidityProtection);
  }

  openModal(optionId: number) {
    this.singleMode = optionId === 0;
    this.showTokenBalance = this.singleMode;
    this.modal = true;
  }

  selectPool(id: string) {
    this.modal = false;
    setTimeout(() => {
      if (this.singleMode) {
        void this.$router.push({
          name: "AddProtectionSingle",
          params: { id }
        });
      } else {
        void this.$router.push({
          name: "AddProtectionDouble",
          params: { id }
        });
      }
    }, 400);
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
