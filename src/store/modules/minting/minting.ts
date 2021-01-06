import { createModule, action } from "vuex-class-component";
import { buildLiquidityProtectionSettingsContract } from "@/api/eth/contractTypes";
import { web3 } from "@/api/web3";
import { shrinkToken } from "@/api/eth/helpers";
import BigNumber from "bignumber.js";
const VuexModule = createModule({
  strict: false
});

export class MintingModule extends VuexModule.With({
  namespaced: "minting/"
}) {
  public minNetworkTokenLiquidityforMinting: BigNumber | null = null;

  @action async fetchMinLiqForMinting(protectionSettingsContract: string) {
    const contract = await buildLiquidityProtectionSettingsContract(
      protectionSettingsContract,
      web3
    );

    const settingsContract = await contract.methods
      .minNetworkTokenLiquidityForMinting()
      .call();

    this.minNetworkTokenLiquidityforMinting = new BigNumber(
      shrinkToken(settingsContract, 18)
    );
  }
}
