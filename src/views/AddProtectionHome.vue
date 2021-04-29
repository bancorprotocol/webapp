<template>
  <div class="mt-3">
    <alert-block :title="`${$t('add_liquidity_pool')}:`" class="my-3">
      <ol class="m-0 pl-3">
        <li>
          <a
            href="https://blog.bancor.network/how-to-stake-liquidity-earn-fees-on-bancor-bff8369274a1"
            target="_blank"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ `${$t("make_money_liquidity")}?` }}
          </a>
        </li>
        <li>
          <a
            href="https://blog.bancor.network/beginners-guide-to-getting-rekt-by-impermanent-loss-7c9510cb2f22"
            target="_blank"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ `${$t("impermanent_loss")}?` }}
          </a>
        </li>
        <li>
          <a
            href="https://bankless.substack.com/p/how-to-protect-yourself-from-impermanent"
            target="_blank"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          >
            {{ `${$t("protect_impermanent_loss")}?` }}
          </a>
        </li>
      </ol>
    </alert-block>

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
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import MainButton from "@/components/common/Button.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import StakeButtons from "@/components/protection/StakeButtons.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    AlertBlock,
    StakeButtons,
    GrayBorderBlock,
    MainButton,
    ModalPoolSelect
  }
})
export default class AddProtectionHome extends BaseComponent {
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
        this.$router.push({
          name: "AddProtectionSingle",
          params: { id }
        });
      }
    }, 400);
  }
}
</script>

<style scoped lang="scss"></style>
