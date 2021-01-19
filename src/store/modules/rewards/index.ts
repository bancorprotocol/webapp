import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";
import BigNumber from "bignumber.js";

const VuexModule = createModule({
  strict: false
});

export class RewardsModule extends VuexModule.With({
  namespaced: "rewards/"
}) {
  get contract() {
    return buildStakingRewardsContract(vxm.ethBancor.contracts.StakingRewards);
  }

  @action async stakeRewards({
    maxAmount,
    poolId
  }: {
    maxAmount: string;
    poolId: string;
  }) {
    await this.contract.methods
      .stakeRewards(maxAmount, poolId)
      .send({ from: vxm.ethBancor.currentUser });
  }

  @action async claimRewards() {
    await this.contract.methods
      .claimRewards()
      .send({ from: vxm.ethBancor.currentUser });
  }

  @action async totalClaimedRewards(): Promise<BigNumber> {
    const result = await this.contract.methods
      .totalClaimedRewards(vxm.ethBancor.currentUser)
      .call();

    return new BigNumber(result);
  }

  @action async pendingRewards(): Promise<BigNumber> {
    const result = await this.contract.methods
      .pendingRewards(vxm.ethBancor.currentUser)
      .call();

    return new BigNumber(result);
  }

  @action async pendingReserveRewards({
    poolId,
    reserveId
  }: {
    poolId: string;
    reserveId: string;
  }) {
    await this.contract.methods
      .pendingReserveRewards(vxm.ethBancor.currentUser, poolId, reserveId)
      .call();
  }
}
