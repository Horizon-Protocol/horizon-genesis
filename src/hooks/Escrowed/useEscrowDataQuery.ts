
import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";
import { CONTRACT } from "@utils/queryKeys";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { utils, BigNumberish, ethers, BigNumber } from "ethers";
import useWallet from "@hooks/useWallet";
import { etherToBN, formatNumber, toBN, zeroBN } from "@utils/number";
import { flatten, flattenDeep } from "lodash";
import { rewardsEscrowAtom } from "@atoms/record";
import useDisconnected from "@hooks/useDisconnected";

export type RewardEscrowV2Props = {
    claimableAmount?: BN;
    schedule: RecordEscrowRowProps[] | [];
    totalEscrowed: BN;
    totalVested?: BN;
}

export type RecordEscrowRowProps = {
    endTime: BN;
    entryID: BN;
    escrowAmount: BN;
}

export default function useEscrowDataQuery() {

    const appReady = useAtomValue(readyAtom);
    const { account } = useWallet(); 

    const setRewardsEscrow = useUpdateAtom(rewardsEscrowAtom)
    const resetRewardsEscrow = useResetAtom(rewardsEscrowAtom);
    useDisconnected(resetRewardsEscrow);

    const fetcher = useCallback(async () => {
        if (appReady && account) {
            const {
                contracts: { RewardEscrowV2 },
            } = horizon.js!;
            const [numVestingEntries, totalEscrowed, totalVested] = await Promise.all([
                RewardEscrowV2.numVestingEntries(account),
                RewardEscrowV2.balanceOf(account),
                RewardEscrowV2.totalVestedAccountBalance(account),
            ]);

            // console.log('useEscrowDataQuery',{
            //     claimableAmount: formatNumber(numVestingEntries),
            //     totalEscrowed: formatNumber(totalEscrowed),
            //     totalVested: formatNumber(totalVested),
            // })

            const vestingEntriesPromise = [];
            const vestingEntriesIdPromise:Promise<any>[] = [];
            const totalVestingEntries = Number(numVestingEntries);
            // console.log('totalVestingEntries',totalVestingEntries)

            const VESTING_ENTRIES_PAGINATION = 50;
            for (let index = 0; index < totalVestingEntries; index += VESTING_ENTRIES_PAGINATION) {
                const pagination = index + VESTING_ENTRIES_PAGINATION > totalVestingEntries
                    ? totalVestingEntries - index
                    : VESTING_ENTRIES_PAGINATION;
                vestingEntriesPromise.push(RewardEscrowV2.getVestingSchedules(account, index, pagination));
                vestingEntriesIdPromise.push(RewardEscrowV2.getAccountVestingEntryIDs(account, index, pagination));
            }

            const vestingEntries = flatten(await Promise.all(vestingEntriesPromise));
            const vestingEntriesId = flattenDeep(await Promise.all(vestingEntriesIdPromise));
            // console.log('vestingEntries',vestingEntries)

            let claimableAmount = zeroBN;
            if (vestingEntriesId != null) {
                claimableAmount = await RewardEscrowV2.getVestingQuantity(account, vestingEntriesId);
            }

            const unorderedSchedule:RecordEscrowRowProps[] = [];
            // console.log('vestingEntries',vestingEntries)
            vestingEntries.forEach((item) => {
                const endTime = item[0]
                const entryID = item[1]
                const escrowAmount = item[2]
                // if (escrowAmount?.lt(0)) {
                    unorderedSchedule.push({
                        endTime,
                        entryID,
                        escrowAmount
                    });
                // }
            });

            const result = {
                claimableAmount: claimableAmount,
                schedule: unorderedSchedule,
                totalEscrowed: totalEscrowed,
                totalVested: totalVested,
            };
            // console.log('useEscrowDataQueryresult',result)
            return result
        }
    }, [appReady, account])

    useQuery([CONTRACT, account, "RewardEscrowV2"], fetcher, {
        enabled: !!account && !!horizon.js,
        onSuccess(data) {
            if (data){
                setRewardsEscrow(data)
            }
        },onError(e){
            console.log("erroruseEscrowDataQuery", e)
        }
    })
}
