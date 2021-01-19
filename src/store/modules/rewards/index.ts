import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsDistributionContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";

const VuexModule = createModule({
  strict: false
});

const contract = buildStakingRewardsDistributionContract(
  vxm.ethBancor.contracts.StakingRewardsDistribution
);

export class RewardsModule extends VuexModule.With({
  namespaced: "rewards/"
}) {
  @action async stakeRewards({
    maxAmount,
    poolId
  }: {
    maxAmount: string;
    poolId: string;
  }) {
    await contract.methods
      .stakeRewards(maxAmount, poolId)
      .send({ from: vxm.ethBancor.currentUser });
  }

  @action async claimRewards() {
    await contract.methods
      .claimRewards()
      .send({ from: vxm.ethBancor.currentUser });
  }

  @action async totalClaimedRewards() {
    await contract.methods
      .totalClaimedRewards(vxm.ethBancor.currentUser)
      .call();
  }

  @action async pendingRewards() {
    await contract.methods.pendingRewards(vxm.ethBancor.currentUser).call();
  }

  @action async pendingReserveRewards({
    poolId,
    reserveId
  }: {
    poolId: string;
    reserveId: string;
  }) {
    await contract.methods
      .pendingReserveRewards(vxm.ethBancor.currentUser, poolId, reserveId)
      .call();
  }
}
