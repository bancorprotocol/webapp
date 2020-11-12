<template>
  <div class="mt-3">
    <alert-block :msg="infoMsg" class="my-3" />

    <stake-buttons @click="openModal" />

    <modal-pool-select
      @select="selectPool"
      v-model="modal"
      :pools="pools"
      :show-token-balance="showTokenBalance"
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
import AlertBlock from "@/components/common/AlertBlock.vue";

@Component({
  components: {
    AlertBlock,
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

  get infoMsg() {
    return "By joining a pool, liquidity providers earn a percentage fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.";
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
        this.$router.push({
          name: "AddProtectionSingle",
          params: { id }
        });
      } else {
        this.$router.push({
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
