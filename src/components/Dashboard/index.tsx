import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps, Typography } from "@mui/material";
import { debtAtom, collateralDataAtom } from "@atoms/debt";
import { zUSDBalanceAtom } from "@atoms/balances";
import { hznRateAtom } from "@atoms/exchangeRates";
import useUserStakingData from "@hooks/useUserStakingData";
import { formatNumber } from "@utils/number";
import { formatPrice } from "@utils/formatters";
import { BORDER_COLOR, COLOR } from "@utils/theme/constants";
import CRatioRange from "./CRatioRange";
import HZNInfoPrice from "./HZNInfoPrice";
import Balance from "./Balance";
import ClaimCountDown from "./ClaimCountDown";
import useFilterZAssets from "@hooks/useFilterZAssets";
import { last, sumBy } from "lodash";
import { totalIssuedZUSDExclEthAtom } from "@atoms/app";
import { globalDebtAtom } from "@atoms/record";
import useWallet from "@hooks/useWallet";
import { Token } from "@utils/constants";
import Tooltip from "@components/Tooltip";

export default function Dashboard(props: BoxProps) {
  const { collateral, transferable, debtBalance } = useAtomValue(debtAtom);
  const { stakedCollateral, dashboardEscrowed } =
    useAtomValue(collateralDataAtom);
  const zUSDBalance = useAtomValue(zUSDBalanceAtom);

  const hznRate = useAtomValue(hznRateAtom);

  const totalIssuedSynths = useAtomValue(totalIssuedZUSDExclEthAtom)
  const globalDebt = useAtomValue(globalDebtAtom);

  const { connected } = useWallet()

  // console.log('debtpoll',{
  //   debtBalance:debtBalance,
  //   globalDebt:globalDebt
  // })

  const { stakingAPR, isEstimateAPR } = useUserStakingData();

  const othersZAssets = sumBy(useFilterZAssets({ zUSDIncluded: false }), "amountUSD")
  const zAssets = sumBy(useFilterZAssets({ zUSDIncluded: true }), "amountUSD")

  const balances = useMemo(
    () => [
      {
        sectionHeader: true,
        showWalletIcon: connected,
        importToken: Token.HZN,
        tooltipText: 'The total amount of HZN in this account (Staked + Transferrable + Escrowed)',
        label: 'HZN Balance',
        value: `${formatNumber(collateral)} HZN`,
      },
      {
        label: "Staked",
        tooltipText: 'The amount of HZN being used as collateral. Includes Escrowed HZN used as collateral',
        value: `${formatNumber(stakedCollateral)} HZN`,
      },
      {
        label: "Transferrable",
        tooltipText: 'The amount of HZN that is sitting idly in this wallet. This HZN can be staked or transferred.',
        value: `${formatNumber(transferable)} HZN`,
      },
      {
        label: "Escrowed",
        tooltipText: 'The amount of HZN that is locked in Escrow. This HZN can be staked but not transferred.',
        value: `${formatNumber(dashboardEscrowed)} HZN`,
      },
      {
        sectionHeader: true,
        label: "Active Debt",
        tooltipText: 'This is the amount of debt this wallet owes to the protocol. This fluctuates based on the size of the global debt pool and your % of it.',
        value: `$ ${formatNumber(debtBalance)}`,
      },
      {
        label: "Your Debt Pool %",
        tooltipText: 'This is the percentage of the global debt pool that this wallet owes. This is used to calculate the Active Debt.',
        value: `${formatNumber(Number(debtBalance) / Number(last(globalDebt)?.value ?? 0) * 100, { mantissa: 5 })}%`
      },
      {
        sectionHeader: true,
        label: "zAssets",
        tooltipText: 'This is the total value of all zAssets in this wallet.',
        value: `${formatNumber(zAssets)} zUSD`,
      },
      {
        label: "zUSD Balance",
        showWalletIcon: connected,
        importToken: Token.ZUSD,
        tooltipText: 'This amount of zUSD held in this wallet',
        value: `${formatNumber(zUSDBalance)} zUSD`,
      },
      {
        label: "Others zAssets",
        tooltipText: 'This is the value of all zAssets held in this wallet except zUSD.',
        value: `${formatNumber(othersZAssets)} zUSD`,
      },
    ],
    [
      hznRate,
      collateral,
      zUSDBalance,
      debtBalance,
      stakedCollateral,
      transferable,
      dashboardEscrowed,
    ]
  );

  return (
    <>
      <Box
        // border={1}
        borderColor={BORDER_COLOR}
        width='100%'
        bgcolor={COLOR.bgColor}
        borderRadius={{
          xs: 0,
          md: 2.5, // 10px
        }}
        {...props}
      >
        <CRatioRange px={2} />
        <Box
          mt={0}
          p="15px"
          pt={0}
          pb={0}
          textAlign='center'
        // bgcolor='rgba(16, 38, 55, 0.3)'
        >
          <Box
            width='100%'
            bgcolor='transparent'
            display='flex'
            justifyContent='space-between'
          >
            <HZNInfoPrice
              width={150}
              height='50px'
              toolTipText='apy tootip'
              title='HZN STAKING APY'
              desc={<>
                {stakingAPR * 100 && isEstimateAPR ? '≈' : null}
                <span>{stakingAPR * 100 ? formatNumber(stakingAPR * 100) : "--"}</span>%
              </>}
              bgcolor={COLOR.bgColor}
            />
            <HZNInfoPrice
              width={110}
              toolTipText='HZN PRICE tooltip'
              title='HZN PRICE'
              desc={`$${formatPrice(hznRate.toNumber(), { mantissa: 4 })}`}
              bgcolor={COLOR.bgColor}
            />
          </Box>
          <Box mt="10px" bgcolor={COLOR.bgColor}>
            <Balance data={balances} />
          </Box>
        </Box>
        <ClaimCountDown mt={0} p={2} />
      </Box>
    </>
  );
}
