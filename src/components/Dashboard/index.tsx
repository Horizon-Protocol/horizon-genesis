import { useMemo } from "react";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
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
import { first, last, sumBy } from "lodash";
import { totalIssuedZUSDExclEthAtom } from "@atoms/app";
import { globalDebtAtom } from "@atoms/record";
import useWallet from "@hooks/useWallet";
import { Token } from "@utils/constants";
import Tooltip from "@components/Tooltip";
import useIsMobile from "@hooks/useIsMobile";
import MenuSVG from "@components/MobileFooter/MobileMenu/MenuSVG";
import { ReactComponent as Union } from "@assets/images/Union.svg";

interface DashboardProps extends BoxProps{
  dashBoardOnClose?: () => void
}

export default function Dashboard({dashBoardOnClose, ...props}: DashboardProps) {
  const { collateral, transferable, debtBalance } = useAtomValue(debtAtom);
  // alert(debtBalance)
  const { stakedCollateral, dashboardEscrowed } = useAtomValue(collateralDataAtom);
  const zUSDBalance = useAtomValue(zUSDBalanceAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const totalIssuedSynths = useAtomValue(totalIssuedZUSDExclEthAtom)
  const globalDebt = useAtomValue(globalDebtAtom);
  const { connected } = useWallet()
  const isMobile = useIsMobile()
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
        value: `${formatNumber(Number(debtBalance) / Number(first(globalDebt)?.totalDebt ?? 0) * 100, { mantissa: 5 })}%`
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
        borderColor={BORDER_COLOR}
        width='100%'
        bgcolor={{
          xs:'#0C1D2E',
          sm:'#0C1D2E',
          md:COLOR.bgColor
        }}
        borderRadius={{
          xs: 0,
          md: 2.5, // 10px
        }}
        {...props}
      >
        {!isMobile && <CRatioRange px={2} />} 
        <Box
          mt={0}
          p={isMobile ? '8px':'15px'}
          pt={0}
          pb={0}
          textAlign='center'
        >
          <Box
            width='100%'
            bgcolor='transparent'
            display='flex'
            justifyContent='space-between'
          >
            <HZNInfoPrice
              width={150}
              flexGrow={isMobile ? 1 : 0}
              height='50px'
              toolTipText='Estimated APY for staking HZN on Horizon Genesis.'
              title='HZN STAKING APY'
              desc={<>
                {stakingAPR * 100 && isEstimateAPR ? '≈' : null}
                <span>{stakingAPR * 100 ? formatNumber(stakingAPR * 100) : "--"}</span>%
              </>}
              bgcolor={COLOR.bgColor}
            />
            <HZNInfoPrice
              width={110}
              flexGrow={isMobile ? 1 : 0}
              toolTipText='Current HZN Price'
              title='HZN PRICE'
              desc={`$${formatPrice(hznRate.toNumber(), { mantissa: 4 })}`}
              bgcolor={COLOR.bgColor}
            />
            {isMobile && <MenuSVG mr='0px' onClick={dashBoardOnClose} width='50px' height='50px'>
                <Union/>
            </MenuSVG>}
          </Box>
          <Box mt={isMobile?'3px':'10px'} bgcolor={COLOR.bgColor}>
            <Balance data={balances} />
          </Box>
        </Box>
        <ClaimCountDown mt={0} p={2} />
      </Box>
    </>
  );
}
