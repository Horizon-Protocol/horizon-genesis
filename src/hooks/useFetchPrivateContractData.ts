import { useCallback, useMemo } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { utils, BigNumber, ethers } from "ethers";
import { zipWith } from "lodash";
import { CurrencyKey } from "@horizon-protocol/contracts-interface";
import { Contract } from "@horizon-protocol/ethcall";
import { CONTRACT, CONTRACT_ALL_PRIVATE } from "@utils/queryKeys";
import { etherToBN, toBN, zeroBN } from "@utils/number";
import useHorizonJs from "./useHorizonJs";
import useGetEthCallProvider from "./staker/useGetEthCallProvider";
import horizon from "@lib/horizon";
import useWallet from "./useWallet";
import { debtAtom, resetDebtAtom } from "@atoms/debt";
import useDisconnected from "./useDisconnected";
import { rewardsAtom } from "@atoms/feePool";

export default function useFetchPrivateContractData() {
    const { account } = useWallet();
    const horizonJs = useHorizonJs();
    const getProvider = useGetEthCallProvider();

    const setDebtData = useUpdateAtom(debtAtom);
    const resetDebtData = useResetAtom(debtAtom);
    useDisconnected(resetDebtData);

    const setRewards = useUpdateAtom(rewardsAtom);
    const resetRewards = useResetAtom(rewardsAtom);
    useDisconnected(resetRewards);

    const contractMap = useMemo(() => {
        if (!horizonJs) {
            return null;
        }
        const { contracts } = horizonJs;
        return {
            HZN: new Contract(
                contracts.Synthetix.address,
                contracts.Synthetix.interface.fragments as any
            ),
            SynthetixState: new Contract(
                contracts.SynthetixState.address,
                contracts.SynthetixState.interface.fragments as any
            ),
            SystemSettings: new Contract(
                contracts.SystemSettings.address,
                contracts.SystemSettings.interface.fragments as any
            ),
            Liquidations: new Contract(
                contracts.Liquidations.address,
                contracts.Liquidations.interface.fragments as any
            ),
            SynthUtil: new Contract(
                contracts.SynthUtil.address,
                contracts.SynthUtil.interface.fragments as any
            ),
            ExchangeRates: new Contract(
                contracts.ExchangeRates.address,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                contracts.ExchangeRates.interface.fragments as any
            ),
            FeePool: new Contract(
                contracts.FeePool.address,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                contracts.FeePool.interface.fragments as any
            ),
            SystemStatus: new Contract(
                contracts.SystemStatus.address,
                contracts.SystemStatus.interface.fragments as any
            ),
            RewardEscrowV2: new Contract(
                contracts.RewardEscrowV2.address,
                contracts.RewardEscrowV2.interface.fragments as any
            )
        };
    }, [horizonJs]);

    const fetcher = useCallback<QueryFunction>(async () => {
        const {
            utils,
        } = horizon.js!;

        const mixCalls = [
            /* ----- useFetchDebtData -----*/
            contractMap!.Liquidations.getLiquidationDeadlineForAccount(account),
            contractMap!.HZN.collateral(account),
            contractMap!.HZN.collateralisationRatio(account),
            contractMap!.HZN.transferableSynthetix(account),
            contractMap!.HZN.debtBalanceOf(account, utils.formatBytes32String("zUSD")),
            contractMap!.HZN.maxIssuableSynths(account),
            contractMap!.HZN.balanceOf(account),
            contractMap!.RewardEscrowV2.balanceOf(account),

            /* ----- useFetchRewards -----*/
            contractMap!.FeePool.isFeesClaimable(account),
            contractMap!.FeePool.feesAvailable(account),
            contractMap!.FeePool.feesByPeriod(account)
        ];

        const ethcallProvider = await getProvider();

        const res = (await ethcallProvider.all(mixCalls)) as unknown[];

        const [
            /* ----- useFetchDebtData -----*/
            liquidationDeadline,
            collateral,
            currentCRatio,
            transferable,
            debtBalance,
            issuableSynths,
            balance,
            escrowedReward,
            /* ----- useFetchRewards -----*/
            claimable,
            availableFees,
            periodFees
        ] = res as [
            /* ----- useFetchDebtData -----*/
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber, 
            BigNumber,
            BigNumber,
            /* ----- useFetchRewards -----*/
            boolean,
            [ethers.BigNumber, ethers.BigNumber],
            [[ethers.BigNumber, ethers.BigNumber], [ethers.BigNumber, ethers.BigNumber]]
        ];
        return [
            /* ----- useFetchDebtData -----*/
            liquidationDeadline.toNumber(),
            etherToBN(collateral),
            etherToBN(currentCRatio),
            etherToBN(transferable),
            etherToBN(debtBalance),
             etherToBN(issuableSynths),
            etherToBN(balance),
            etherToBN(escrowedReward),
            /* ----- useFetchRewards -----*/
            claimable,
            etherToBN(availableFees[0]),
            etherToBN(availableFees[1]),
            etherToBN(periodFees[0][0]),
            etherToBN(periodFees[0][1]),
        ]
    }, [
        contractMap,
        getProvider,
        account
    ]);

    useQuery([CONTRACT_ALL_PRIVATE], fetcher, {
        enabled: !!contractMap,
        onSuccess([
            /* ----- useFetchDebtData -----*/
            liquidationDeadline,
            collateral,
            currentCRatio,
            transferable,
            debtBalance,
            issuableSynths,
            balance,
            escrowedReward,
            /* ----- useFetchRewards -----*/
            claimable,
            exchangeReward,
            stakingReward,
            upcomingExchangeReward,
            upcomingStakingReward,
        ]) {
            // console.log("====useFetchDebtData&useFetchRewards Combine====", {
            //     currentCRatio: currentCRatio.toNumber(),
            //     transferable: transferable.toString(),
            //     debtBalance: debtBalance.toString(),
            //     collateral: collateral.toString(),
            //     issuableSynths: issuableSynths.toString(),
            //     balance: balance.toString(),
            //     escrowedReward: escrowedReward.toString(),
            //     liquidationDeadline,

            //     claimable:claimable,
            //     stakingReward:stakingReward.toNumber(),
            //     exchangeReward:exchangeReward.toNumber(),
            //     upcomingExchangeReward: upcomingExchangeReward.toNumber(),
            //     upcomingStakingReward: upcomingStakingReward.toNumber()
            // });

            setDebtData({
                currentCRatio,
                transferable,
                debtBalance,
                collateral,
                issuableSynths,
                balance,
                escrowedReward,
                liquidationDeadline,
              });
              setRewards({
                claimable,
                stakingReward,
                exchangeReward,
                upcomingExchangeReward,
                upcomingStakingReward
              });
        },
        onError(err) {
            // console.log("====AppDataError====", err)
        },
    });
}