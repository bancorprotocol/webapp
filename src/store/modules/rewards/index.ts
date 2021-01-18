import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsDistributionContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";

const VuexModule = createModule({
  strict: false
});

export class RewardsModule extends VuexModule.With({
  namespaced: "rewards/"
}) {
  @action async claimRewards() {
    const contract = buildStakingRewardsDistributionContract(
      vxm.ethBancor.contracts.StakingRewardsDistribution
    );

    await contract.methods
      .claimRewards()
      .send({ from: vxm.ethBancor.currentUser });
  }

  @action async stakeRewards({
    maxAmount,
    poolId
  }: {
    maxAmount: string;
    poolId: string;
  }) {
    const contract = buildStakingRewardsDistributionContract(
      vxm.ethBancor.contracts.StakingRewardsDistribution
    );

    await contract.methods
      .stakeRewards(maxAmount, poolId)
      .send({ from: vxm.ethBancor.currentUser });
  }
}
