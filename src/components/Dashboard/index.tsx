import { useEffect, useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps, Typography } from "@mui/material";
import { debtAtom, collateralDataAtom } from "@atoms/debt";
import { zAssetsBalanceAtom, zUSDBalanceAtom } from "@atoms/balances";
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
import { sumBy } from "lodash";


export default function Dashboard(props: BoxProps) {
  const { collateral, transferable, debtBalance } = useAtomValue(debtAtom);
  const { stakedCollateral, dashboardEscrowed } =
    useAtomValue(collateralDataAtom);
  const zUSDBalance = useAtomValue(zUSDBalanceAtom);

  const hznRate = useAtomValue(hznRateAtom);

  const { stakingAPR, isEstimateAPR } = useUserStakingData();

  const othersZAssets = sumBy(useFilterZAssets({zUSDIncluded:false}),"amountUSD")
  const zAssets = sumBy(useFilterZAssets({zUSDIncluded:true}),"amountUSD")

  const balances = useMemo(
    () => [
      {
        sectionHeader: true,
        showWalletIcon: true,
        label: "HZN Balance",
        value: `${formatNumber(collateral)} HZN`,
      },
      {
        label: "Staked",
        value: `${formatNumber(stakedCollateral)} HZN`,
      },
      {
        label: "Transferrable",
        value: `${formatNumber(transferable)} HZN`,
      },
      {
        label: "Escrowed",
        value: `${formatNumber(dashboardEscrowed)} HZN`,
      },
      {
        sectionHeader: true,
        label: "Active Debt",
        value: `$ ${formatNumber(debtBalance)}`,
      },
      {
        label: "Your Debt Pool %",
        value: `?`,
      },
      {
        sectionHeader: true,
        label: "zAssets",
        value: `${formatNumber(zAssets)} zUSD`,
      },
      {
        label: "zUSD Balance",
        showWalletIcon: true,
        value: `${formatNumber(zUSDBalance)} zUSD`,
      },
      {
        label: "Others zAssets",
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
        border={1}
        borderColor={BORDER_COLOR}
        width='100%'
        bgcolor='rgba(16, 38, 55, 0.3)'
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
              width={140}
              title='HZN STAKING'
              desc={<>
                {stakingAPR * 100 && isEstimateAPR ? (
                  <Typography variant='overline' gutterBottom>
                    &#8776;{" "}
                  </Typography>
                ) : null}
                <span>{stakingAPR * 100 ? formatNumber(stakingAPR * 100) : "--"}</span>% APY
              </>}
              bgcolor='rgba(16, 38, 55, 0.3)'
              sx={{
              }}
            />
            <HZNInfoPrice
              width={100}
              title='HZN PRICE'
              desc={`$${formatPrice(hznRate.toNumber(), { mantissa: 4 })}`}
              bgcolor='rgba(16, 38, 55, 0.3)'
              sx={{
              }}
            />
          </Box>
          <Box mt={2} bgcolor='rgba(16, 38, 55, 0.3)'>
            <Balance data={balances} />
          </Box>
        </Box>
        <ClaimCountDown mt={0} p={2} />
      </Box>
    </>
  );
}
