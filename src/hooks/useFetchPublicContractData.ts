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
import { CONTRACT, CONTRACT_ALL_PUBLIC } from "@utils/queryKeys";
import { etherToBN, toBN } from "@utils/number";
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

export default function useFetchPublicContractData() {
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
    const setAppDataReady = useUpdateAtom(appDataReadyAtom);

    const setLastDebtLedgerEntry = useUpdateAtom(lastDebtLedgerEntryAtom);
    const setTotalSupply = useUpdateAtom(totalSupplyAtom);
    const setTotalIssuedZUSDExclEth = useUpdateAtom(totalIssuedZUSDExclEthAtom);
    const setTargetCRatio = useUpdateAtom(targetRatioAtom);
    const setLiquidationRatio = useUpdateAtom(liquidationRatioAtom);

    const setSuspensionStatus = useUpdateAtom(suspensionStatusAtom)

    const setRates = useUpdateAtom(ratesAtom);

    const fetcher = useCallback<QueryFunction>(async () => {
        const {
            utils,
            contracts: { SynthUtil, ExchangeRates },
        } = horizon.js!;

        const mixCalls = [
            /*---- useFetchAppData ----*/
            contractMap!.SynthetixState.lastDebtLedgerEntry(),
            contractMap!.HZN.totalSupply(),
            contractMap!.SystemSettings.issuanceRatio(),
            contractMap!.Liquidations.liquidationRatio(),
            contractMap!.HZN.totalIssuedSynthsExcludeOtherCollateral(utils.formatBytes32String("zUSD"),
                // {blockTag: "latest"}
            ),
            /*---- useSuspensionStatus ----*/
            contractMap!.SystemStatus.systemSuspension(),
            contractMap!.SystemStatus.issuanceSuspension(),
            /*----  useFetchExchangeRates ----*/
            // SynthUtil.synthsRates(),
            // ExchangeRates.ratesForCurrencies(additionalCurrencies),
        ];

        const ethcallProvider = await getProvider();

        const res = (await ethcallProvider.all(mixCalls)) as unknown[];

        const [
            /*---- useFetchAppData ----*/
            lastDebtLedgerEntry,
            totalSupply,
            targetRatio,
            liquidationRatio,
            totalIssuedZUSDExclEth,
            /*---- useSuspensionStatus ----*/
            systemSuspension,
            issuanceSuspension,
            /*----  useFetchExchangeRates ----*/
            // synthsRates, 
            // ratesForCurrencies
        ] = res as [
            /*---- useFetchAppData ----*/
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            /*---- useSuspensionStatus ----*/
            any,
            any,
            /*----  useFetchExchangeRates ----*/
            // SynthRatesTuple, 
            // CurrencyRate[]
        ];

        return [
            /*---- useFetchAppData ----*/
            toBN(utils.formatUnits(lastDebtLedgerEntry, 27)),
            etherToBN(totalSupply),
            etherToBN(targetRatio),
            etherToBN(liquidationRatio),
            etherToBN(totalIssuedZUSDExclEth),
            /*---- useSuspensionStatus ----*/
            systemSuspension,
            issuanceSuspension,
            /*----  useFetchExchangeRates ----*/
            // exchangeRates
        ]
    }, [
        contractMap,
        getProvider,
        setLastDebtLedgerEntry,
        setTotalSupply,
        setTotalIssuedZUSDExclEth,
        setTargetCRatio,
        setLiquidationRatio
    ]);

    useQuery([CONTRACT_ALL_PUBLIC], fetcher, {
        enabled: !!contractMap,
        onSuccess([
            /*---- useFetchAppData ----*/
            lastDebtLedgerEntry,
            totalSupply,
            targetRatio,
            liquidationRatio,
            totalIssuedZUSDExclEth,
            /*---- useSuspensionStatus ----*/
            systemSuspension,
            issuanceSuspension,
            /*----  useFetchExchangeRates ----*/
            // exchangeRates
        ]) {
            // if (import.meta.env.DEV) {
                // console.log("====useFetchAppData&useSuspensionStatus Combine====", {
                //     lastDebtLedgerEntry: lastDebtLedgerEntry.toString(),
                //     totalSupply: totalSupply.toString(),
                //     targetRatio: targetRatio.toString(),
                //     liquidationRatio: liquidationRatio.toString(),
                //     totalIssuedZUSDExclEth: totalIssuedZUSDExclEth.toString(),
                //     systemSuspension,
                //     issuanceSuspension,
                //     // exchangeRates
                // });
            // }

            /*---- useFetchAppData ----*/
            setLastDebtLedgerEntry(lastDebtLedgerEntry);
            setTotalSupply(totalSupply);
            setTargetCRatio(targetRatio);
            setLiquidationRatio(liquidationRatio);
            setTotalIssuedZUSDExclEth(totalIssuedZUSDExclEth);
            /*---- useSuspensionStatus ----*/
            setSuspensionStatus({
                status: systemSuspension[0] || issuanceSuspension[0],
                reason: systemSuspension[1] === issuanceSuspension[1] ? systemSuspension[1] : 0
            })
            /*----  useFetchExchangeRates ----*/
            // setRates(exchangeRates);
            /*----  appready ----*/
            setAppDataReady(true);
        },
        onError(err) {
            console.log("====AppDataError====", err)
        },
    });
}