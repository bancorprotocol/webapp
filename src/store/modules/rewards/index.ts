import { createModule, action } from "vuex-class-component";
import { buildStakingRewardsContract } from "@/api/eth/contractTypes";
import { vxm } from "@/store";
import BigNumber from "bignumber.js";
import { OnUpdate, TxResponse } from "@/types/bancor";
import { multiSteps } from "@/api/helpers";
import wait from "waait";
import { shrinkToken } from "@/api/eth/helpers";

const VuexModule = createModule({
  strict: false
});

export class RewardsModule extends VuexModule.With({
  namespaced: "rewards/"
}) {
  totalClaimedRewards: BigNumber = new BigNumber(0);
  pendingRewards: BigNumber = new BigNumber(0);

  get balance() {
    const totalRewards = this.totalClaimedRewards.plus(this.pendingRewards);
    const bntPrice = vxm.bancor.stats.bntUsdPrice || 0;

    return {
      totalRewards: {
        bnt: totalRewards,
        usd: totalRewards.times(bntPrice)
      },
      totalClaimedRewards: {
        bnt: this.totalClaimedRewards,
        usd: this.totalClaimedRewards.times(bntPrice)
      },
      pendingRewards: {
        bnt: this.pendingRewards,
        usd: this.pendingRewards.times(bntPrice)
      }
    };
  }

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
                await this.loadData();
                await wait(3000);
                await this.loadData();
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
                await this.loadData();
                await wait(3000);
                await this.loadData();
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
    await this.loadPendingRewards();
    await this.loadTotalClaimedRewards();
  }

  @action async loadTotalClaimedRewards(): Promise<BigNumber> {
    const result = await this.contract.methods
      .totalClaimedRewards(this.currentUser)
      .call();

    const value = new BigNumber(shrinkToken(result, 18));
    this.totalClaimedRewards = value;

    return value;
  }

  @action async loadPendingRewards(): Promise<BigNumber> {
    const result = await this.contract.methods
      .pendingRewards(this.currentUser)
      .call();

    const value = new BigNumber(shrinkToken(result, 18));
    this.pendingRewards = value;

    return value;
  }

  @action async loadPendingReserveRewards({
    poolId,
    reserveId
  }: {
    poolId: string;
    reserveId: string;
  }): Promise<BigNumber> {
    const result = await this.contract.methods
      .pendingReserveRewards(this.currentUser, poolId, reserveId)
      .call();

    return new BigNumber(shrinkToken(result, 18));
  }
}
