import { createModule, action, mutation } from "vuex-class-component";
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
    const contract = buildLiquidityProtectionSettingsContract(
      protectionSettingsContract,
      web3
    );

    const result = await contract.methods
      .minNetworkTokenLiquidityForMinting()
      .call();

    this.setMinNetworkTokenLiquidityForMinting(result);
  }

  @mutation setMinNetworkTokenLiquidityForMinting(result: string) {
    this.minNetworkTokenLiquidityforMinting = new BigNumber(
      shrinkToken(result, 18)
    );
  }
}
