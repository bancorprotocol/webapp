import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsDistributionContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";

const VuexModule = createModule({
  strict: false
});

export class RewardsModule extends VuexModule.With({
  namespaced: "rewards/"
}) {
  @action async claimRewards({ rewardIds }: { rewardIds: string[] }) {
    const contract = buildStakingRewardsDistributionContract(
      vxm.ethBancor.contracts.StakingRewardsDistribution
    );

    await contract.methods
      .claimRewards(rewardIds)
      .send({ from: vxm.ethBancor.currentUser });
  }

  @action async stakeRewards({
    rewardIds,
    poolId
  }: {
    rewardIds: string[];
    poolId: string;
  }) {
    const contract = buildStakingRewardsDistributionContract(
      vxm.ethBancor.contracts.StakingRewardsDistribution
    );

    await contract.methods
      .stakeRewards(rewardIds, poolId)
      .send({ from: vxm.ethBancor.currentUser });
  }
}
