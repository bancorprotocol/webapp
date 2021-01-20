import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";
import BigNumber from "bignumber.js";
import { OnUpdate, TxResponse } from "@/types/bancor";
import { multiSteps } from "@/api/helpers";
import wait from "waait";

const VuexModule = createModule({
  strict: false
});

export class RewardsModule extends VuexModule.With({
  namespaced: "rewards/"
}) {
  balance = {
    totalClaimedRewards: new BigNumber(0),
    pendingRewards: new BigNumber(0)
  };

  get contract() {
    return buildStakingRewardsContract(vxm.ethBancor.contracts.StakingRewards);
  }

  get currentUser() {
    return vxm.ethBancor.currentUser;
  }

  @action async stakeRewards({
    maxAmount,
    poolId,
    onUpdate
  }: {
    maxAmount: string;
    poolId: string;
    onUpdate: OnUpdate;
  }): Promise<TxResponse> {
    const txHash = (await multiSteps({
      items: [
        {
          description: "ReStaking Rewards ...",
          task: async () => {
            return vxm.ethBancor.resolveTxOnConfirmation({
              tx: this.contract.methods.stakeRewards(maxAmount, poolId),
              onConfirmation: async () => {
                //
                // await wait(3000);
                //
              },
              resolveImmediately: true
            });
          }
        }
      ],
      onUpdate
    })) as string;

    return {
      blockExplorerLink: await vxm.ethBancor.createExplorerLink(txHash),
      txId: txHash
    };
  }

  @action async claimRewards({
    onUpdate
  }: {
    onUpdate: OnUpdate;
  }): Promise<TxResponse> {
    const txHash = (await multiSteps({
      items: [
        {
          description: "ReStaking Rewards ...",
          task: async () => {
            return vxm.ethBancor.resolveTxOnConfirmation({
              tx: this.contract.methods.claimRewards(),
              onConfirmation: async () => {
                //
                // await wait(3000);
                //
              },
              resolveImmediately: true
            });
          }
        }
      ],
      onUpdate
    })) as string;

    return {
      blockExplorerLink: await vxm.ethBancor.createExplorerLink(txHash),
      txId: txHash
    };
  }

  @action async loadData() {
    await this.pendingRewards();
    await this.totalClaimedRewards();
  }

  @action async totalClaimedRewards(): Promise<BigNumber> {
    const result = await this.contract.methods
      .totalClaimedRewards(this.currentUser)
      .call();

    const value = new BigNumber(result);
    this.balance.totalClaimedRewards = value;

    return value;
  }

  @action async pendingRewards(): Promise<BigNumber> {
    const result = await this.contract.methods
      .pendingRewards(this.currentUser)
      .call();

    const value = new BigNumber(result);
    this.balance.pendingRewards = value;

    return value;
  }

  @action async pendingReserveRewards({
    poolId,
    reserveId
  }: {
    poolId: string;
    reserveId: string;
  }): Promise<BigNumber> {
    const result = await this.contract.methods
      .pendingReserveRewards(this.currentUser, poolId, reserveId)
      .call();

    return new BigNumber(result);
  }
}
