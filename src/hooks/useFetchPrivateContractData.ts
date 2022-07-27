import { useCallback, useMemo } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import { utils, BigNumber } from "ethers";
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

export default function useFetchPrivateContractData() {
    const { account } = useWallet();

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
        const {
            utils,
        } = horizon.js!;

        const mixCalls = [
            //useFetchDebtData
            contractMap!.Liquidations.getLiquidationDeadlineForAccount(account),
            contractMap!.HZN.collateral(account),
            contractMap!.HZN.collateralisationRatio(account),
            contractMap!.HZN.transferableSynthetix(account),
            contractMap!.HZN.debtBalanceOf(account, utils.formatBytes32String("zUSD")),
            // contractMap!.HZN.maxIssuableSynths(account),
            contractMap!.HZN.balanceOf(account),
            contractMap!.RewardEscrowV2.balanceOf(account),
        ];

        const ethcallProvider = await getProvider();

        const res = (await ethcallProvider.all(mixCalls)) as unknown[];

        const [
            //AppData
            liquidationDeadline, 
            collateral, 
            currentCRatio, 
            transferable, 
            debtBalance, 
            // issuableSynths, 
            balance, 
            escrowedReward,
        ] = res as [
            BigNumber, 
            BigNumber, 
            BigNumber, 
            BigNumber, 
            BigNumber, 
            // BigNumber, 
            BigNumber, 
            BigNumber
        ];
        return [
             //useFetchDebtData
            //  liquidationDeadline: liquidationDeadline.toNumber(),
            //  collateral: etherToBN(collateral),
            //  currentCRatio: etherToBN(currentCRatio),
            //  transferable: etherToBN(transferable),
            //  debtBalance: etherToBN(debtBalance),
            //  issuableSynths: etherToBN(issuableSynths),
            //  balance: etherToBN(balance),
            //  escrowedReward: etherToBN(escrowedReward)

             liquidationDeadline.toNumber(),
             etherToBN(collateral),
             etherToBN(currentCRatio),
             etherToBN(transferable),
             etherToBN(debtBalance),
            //  etherToBN(issuableSynths),
             etherToBN(balance),
             etherToBN(escrowedReward)
        ]
    }, [
        contractMap,
        getProvider,
        account
    ]);

    useQuery(CONTRACT, fetcher, {
        enabled: !!contractMap,
        onSuccess([
            //AppData
            liquidationDeadline, 
            collateral, 
            currentCRatio, 
            transferable, 
            debtBalance, 
            // issuableSynths,
            balance, 
            escrowedReward,
        ]) {
            // if (import.meta.env.DEV) {
                console.log("====PrivateContract====", {
                    liquidationDeadline,
                    collateral,
                    currentCRatio,
                    transferable, 
                    debtBalance, 
                    // issuableSynths,
                    balance, 
                    escrowedReward: escrowedReward.toString(),
                });
            // }
        },
        onError(err) {
            console.log("====AppDataError====", err)
        },
    });
}