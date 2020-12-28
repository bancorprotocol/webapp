import { createModule, mutation, action } from "vuex-class-component";
import { buildLiquidityProtectionSettingsContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";
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

  @action async fetchMinLiqForMinting(): Promise<BigNumber> {
    if (this.minNetworkTokenLiquidityforMinting !== null)
      return this.minNetworkTokenLiquidityforMinting;

    const contract = await buildLiquidityProtectionSettingsContract(
      vxm.ethBancor.liquidityProtectionSettings.contract,
      web3
    );

    const result = await contract.methods
      .minNetworkTokenLiquidityForMinting()
      .call();

    this.minNetworkTokenLiquidityforMinting = new BigNumber(
      shrinkToken(result, 18)
    );
    return this.minNetworkTokenLiquidityforMinting;
  }
}
