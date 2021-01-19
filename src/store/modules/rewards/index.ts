import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsDistributionContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";
import { web3 } from "@/api/web3";

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
    console.log(
      "StakingRewardsDistribution",
      vxm.ethBancor.contracts.StakingRewardsDistribution
    );
    const contract = await buildStakingRewardsDistributionContract(
      vxm.ethBancor.contracts.StakingRewardsDistribution,
      web3
    );
    await contract.methods.pendingRewards(vxm.ethBancor.currentUser).call();
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
