import { useCallback, useMemo } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useResetAtom, useUpdateAtom } from "jotai/utils";
import { BigNumber, ethers } from "ethers";
import { zipWith } from "lodash";
import { CurrencyKey } from "@horizon-protocol/contracts-interface";
import { Contract } from "@horizon-protocol/ethcall";
import {
    appDataReadyAtom,
    lastDebtLedgerEntryAtom,
    totalSupplyAtom,
    totalIssuedZUSDExclEthAtom,
    targetRatioAtom,
    liquidationRatioAtom,
    suspensionStatusAtom,
} from "@atoms/app";
import { CONTRACT } from "@utils/queryKeys";
import { etherToBN, toBN } from "@utils/number";
import useHorizonJs from "./useHorizonJs";
import useGetEthCallProvider from "./staker/useGetEthCallProvider";
import horizon from "@lib/horizon";
import useWallet from "./useWallet";
import { resetAtom, rewardsAtom } from "@atoms/feePool";
import useDisconnected from "./useDisconnected";
import { debtAtom, resetDebtAtom } from "@atoms/debt";

export default function useFetchPrivateContractData() {
    const { account } = useWallet();

    const setRewards = useUpdateAtom(rewardsAtom);
    const resetRewards = useResetAtom(resetAtom);
    useDisconnected(resetRewards);

    const setDebtData = useUpdateAtom(debtAtom);
    const resetDebtData = useResetAtom(resetDebtAtom);
    useDisconnected(resetDebtData);


    const horizonJs = useHorizonJs();
    const getProvider = useGetEthCallProvider();
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
        // const {
        //     utils,
        //   } = horizon.js!;

        const mixCalls = [
            //useFetchRewards
            contractMap!.FeePool.isFeesClaimable(account),
            contractMap!.FeePool.feesAvailable(account),
            contractMap!.FeePool.feesByPeriod(account),
            //useFetchDebtData
            // contractMap!.Liquidations.getLiquidationDeadlineForAccount(account),
            // contractMap!.HZN.collateral(account),
            // contractMap!.HZN.collateralisationRatio(account),
            // contractMap!.HZN.transferableSynthetix(account),
            // contractMap!.HZN.debtBalanceOf(account, utils.formatBytes32String("zUSD")),
            // contractMap!.HZN.maxIssuableSynths(account),
            // contractMap!.HZN.balanceOf(account),
            // contractMap!.RewardEscrowV2.balanceOf(account),
        ];

        const ethcallProvider = await getProvider();
        const res = (await ethcallProvider.all(mixCalls)) as unknown[];

        const [
            claimable, availableFees, periodFees,
            // liquidationDeadline, collateral, currentCRatio, transferable, debtBalance, issuableSynths, balance, escrowedReward,
        ] = res as
            [
                boolean, [ethers.BigNumber, ethers.BigNumber], [[ethers.BigNumber, ethers.BigNumber], [ethers.BigNumber, ethers.BigNumber]],
                // BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber
            ];

            console.log('===useFetchPrivateContractData', {
                claimable, availableFees, periodFees
            })

        return {
            //useFetchRewards
            claimable,
            exchangeReward: etherToBN(availableFees[0]),
            stakingReward: etherToBN(availableFees[1]),
            upcomingExchangeReward: etherToBN(periodFees[0][0]),
            upcomingStakingReward: etherToBN(periodFees[0][1]),
            //useFetchDebtData
            // liquidationDeadline: liquidationDeadline.toNumber(),
            // collateral: etherToBN(collateral),
            // currentCRatio: etherToBN(currentCRatio),
            // transferable: etherToBN(transferable),
            // debtBalance: etherToBN(debtBalance),
            // issuableSynths: etherToBN(issuableSynths),
            // balance: etherToBN(balance),
            // escrowedReward: etherToBN(escrowedReward)
        }
    }, [
        contractMap,
        getProvider,
        account
    ]);

    useQuery(CONTRACT, fetcher, {
        enabled: !!contractMap, 
        onSuccess({
            claimable, stakingReward, exchangeReward, upcomingExchangeReward, upcomingStakingReward,
            // liquidationDeadline, collateral, currentCRatio, transferable, debtBalance, issuableSynths, balance, escrowedReward,
        }) {
            // console.log('===useFetchPrivateContractData', {
            //     claimable, stakingReward, exchangeReward, upcomingExchangeReward, upcomingStakingReward
            // })
            // console.log('===useFetchPrivateContractData', {
            //     claimable: claimable,
            //     stakingReward: stakingReward.toNumber(),
            //     exchangeReward: exchangeReward.toNumber(),
            //     upcomingExchangeReward: upcomingExchangeReward.toNumber(),
            //     upcomingStakingReward: upcomingStakingReward.toNumber()
            // });
            setRewards({
                claimable,
                stakingReward,
                exchangeReward,
                upcomingExchangeReward,
                upcomingStakingReward
            });
            // setDebtData({
            //     currentCRatio,
            //     transferable,
            //     debtBalance,
            //     collateral,
            //     issuableSynths,
            //     balance,
            //     escrowedReward,
            //     liquidationDeadline,
            // });
        },
    });
}