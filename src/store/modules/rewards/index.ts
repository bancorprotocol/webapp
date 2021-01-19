import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsDistributionContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";

const VuexModule = createModule({
  strict: false
});

export class RewardsModule extends VuexModule.With({
  namespaced: "rewards/"
}) {
  get contract() {
    return buildStakingRewardsDistributionContract(
      vxm.ethBancor.contracts.StakingRewardsDistribution
    );
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

  @action async totalClaimedRewards() {
    await this.contract.methods
      .totalClaimedRewards(vxm.ethBancor.currentUser)
      .call();
  }

  @action async pendingRewards() {
    await this.contract.methods
      .pendingRewards(vxm.ethBancor.currentUser)
      .call();
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
