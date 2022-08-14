import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";
import { CONTRACT } from "@utils/queryKeys";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import useWallet from "@hooks/useWallet";
import { BNWithDecimals, formatNumber, zeroBN } from "@utils/number";
import { flatten, flattenDeep } from "lodash";
import { rewardsEscrowAtom } from "@atoms/record";
import useDisconnected from "@hooks/useDisconnected";
import useHorizonJs from "@hooks/useHorizonJs";
import { Contract } from "@horizon-protocol/ethcall";
import BigNumber from "bignumber.js";

export type RewardEscrowV2Props = {
    claimableAmount?: BN;
    schedule: RecordEscrowRowProps[] | [];
    totalEscrowed: BN;
    totalVested?: BN;
    vestingEntriesId: BN[]
}

export type RecordEscrowRowProps = {
    endTime: BN;
    entryID: BN;
    escrowAmount: number;
}

export default function useEscrowDataQuery() {

    const appReady = useAtomValue(readyAtom);
    const { account } = useWallet(); 
    const horizonJs = useHorizonJs();

    const setRewardsEscrow = useUpdateAtom(rewardsEscrowAtom)
    const resetRewardsEscrow = useResetAtom(rewardsEscrowAtom);
    useDisconnected(resetRewardsEscrow);

    const contractMap = useMemo(() => {
        if (!horizonJs) {
            return null;
        }
        const { contracts } = horizonJs;
        return {
            RewardEscrowV2: new Contract(
                contracts.RewardEscrowV2.address,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                contracts.RewardEscrowV2.interface.fragments as any
            ),
        };
    }, [horizonJs]);

    const fetcher = useCallback(async () => {
        if (appReady && account) {
            const {
                contracts: { RewardEscrowV2 },
            } = horizon.js!;

            /*--- promise alll ----*/
            const [numVestingEntries, totalEscrowed, totalVested] = await Promise.all([
                RewardEscrowV2.numVestingEntries(account),
                RewardEscrowV2.balanceOf(account),
                RewardEscrowV2.totalVestedAccountBalance(account),
            ]);

            /*--- combine alll ----*/
            // const mixCalls = [
            //     contractMap!.RewardEscrowV2.numVestingEntries(account),
            //     contractMap!.RewardEscrowV2.balanceOf(account),
            //     contractMap!.RewardEscrowV2.totalVestedAccountBalance(account)
            // ];
            // const ethcallProvider = await getProvider();
            // const res = (await ethcallProvider.all(mixCalls)) as unknown[];

            // const [numVestingEntries,totalEscrowed,totalVested] = res as [
            //     BigNumber,
            //     BigNumber,
            //     BigNumber
            // ];

            const vestingEntriesPromise = [];
            const vestingEntriesIdPromise:Promise<any>[] = [];
            const totalVestingEntries = Number(numVestingEntries);

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
            console.log('vestingEntriesId',vestingEntriesId.map(item => item.toNumber()))

            let claimableAmount = zeroBN;
            if (vestingEntriesId != null) {
                claimableAmount = await RewardEscrowV2.getVestingQuantity(account, vestingEntriesId);
            }
            console.log('claimableAmount',formatNumber(BNWithDecimals(claimableAmount)))

            const unorderedSchedule:RecordEscrowRowProps[] = [];
            // console.log('vestingEntries',vestingEntries)
            vestingEntries.forEach((item) => {
                const endTime = item[0]
                const entryID = item[1]
                // const escrowAmount = item[1]
                const escrowAmount = Number(item[1]) / 1e18
                // if (escrowAmount?.lt(0)) {
                    unorderedSchedule.push({
                        endTime,
                        entryID,
                        escrowAmount
                    });
                // }
            });

            unorderedSchedule.sort((a, b) => a.endTime < b.endTime ? 1 : -1);

            const result = {
                claimableAmount: claimableAmount,
                schedule: unorderedSchedule,
                totalEscrowed: totalEscrowed,
                totalVested: totalVested,
                vestingEntriesId: vestingEntriesId
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
