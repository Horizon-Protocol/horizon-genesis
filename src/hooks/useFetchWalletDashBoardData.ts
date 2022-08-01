import { useCallback, useMemo } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import { utils, BigNumber, BigNumberish } from "ethers";
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
import { CONTRACT, CONTRACT_ALL_PUBLIC, CONTRACT_ALL_WALLETINFO } from "@utils/queryKeys";
import { etherToBN, formatNumber, toBN } from "@utils/number";
import useHorizonJs from "./useHorizonJs";
import useGetEthCallProvider from "./staker/useGetEthCallProvider";
import horizon from "@lib/horizon";
import useFetchExchangeRates from "./useFetchExchangeRates";
import { CryptoCurrency, ParitalRates, iStandardSynth, synthToAsset, RateKey } from "@utils/currencies";
import { ratesAtom } from "@atoms/exchangeRates";


type CurrencyRate = BigNumberish;
type SynthRatesTuple = [string[], CurrencyRate[]];

// Additional commonly used currencies to fetch, besides the one returned by the SynthUtil.synthsRates
const additionalCurrencies = [CryptoCurrency.HZN].map(
  utils.formatBytes32String
);

export default function useFetchWalletDashBoardData() {
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
            )
        };
    }, [horizonJs]);

    const setTotalIssuedZUSDExclEth = useUpdateAtom(totalIssuedZUSDExclEthAtom);
    const setTargetCRatio = useUpdateAtom(targetRatioAtom);
    const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);

    const fetcher = useCallback<QueryFunction>(async () => {
        const {
            utils,
        } = horizon.js!;

        const mixCalls = [
            contractMap!.SystemSettings.issuanceRatio(),
            contractMap!.Liquidations.liquidationRatio(),
            contractMap!.HZN.totalIssuedSynthsExcludeOtherCollateral(utils.formatBytes32String("zUSD"),
                // {blockTag: "latest"}
            ),
        ];

        const ethcallProvider = await getProvider();

        const res = (await ethcallProvider.all(mixCalls)) as unknown[];

        const [
            targetRatio,
            liquidationRatio,
            totalIssuedZUSDExclEth,
        ] = res as [
            BigNumber,
            BigNumber,
            BigNumber,
        ];

        return [
            etherToBN(targetRatio),
            etherToBN(liquidationRatio),
            etherToBN(totalIssuedZUSDExclEth),
        ]
    }, [
        contractMap,
        getProvider,
        setTotalIssuedZUSDExclEth,
        setTargetCRatio,
        setLiquidationRatio
    ]);

    useQuery([CONTRACT_ALL_WALLETINFO], fetcher, {
        enabled: !!contractMap,
        onSuccess([
            targetRatio,
            liquidationRatio,
            totalIssuedZUSDExclEth,
        ]) {
            console.log('combine useFetchWalletDashBoardData',{
                targetRatio: formatNumber(targetRatio),
                liquidationRatio: formatNumber(liquidationRatio),
                totalIssuedZUSDExclEth: formatNumber(totalIssuedZUSDExclEth),
            })

            setTargetCRatio(targetRatio);               // - useful
            setLiquidationRatio(liquidationRatio);       // - useful
            setTotalIssuedZUSDExclEth(totalIssuedZUSDExclEth); // - useful
        },
        onError(err) {
            console.log("====AppDataError====", err)
        },
    });
}