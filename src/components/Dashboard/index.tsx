import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps } from "@mui/material";
import { debtAtom, collateralDataAtom, zUSDBalanceAtom } from "@atoms/debt";
import { hznRateAtom } from "@atoms/exchangeRates";
import useUserStakingData from "@hooks/useUserStakingData";
import { formatNumber } from "@utils/number";
import { formatPrice } from "@utils/formatters";
import { BORDER_COLOR, COLOR } from "@utils/theme/constants";
import CRatioRange from "./CRatioRange";
import StakingApy from "./StakingApy";
import Balance from "./Balance";
import ClaimCountDown from "./ClaimCountDown";

export default function Dashboard(props: BoxProps) {
  const { collateral, transferable, debtBalance } = useAtomValue(debtAtom);
  const { stakedCollateral, dashboardEscrowed } =
    useAtomValue(collateralDataAtom);
  const zUSDBalance = useAtomValue(zUSDBalanceAtom);

  const hznRate = useAtomValue(hznRateAtom);

  const { stakingAPR, isEstimateAPR } = useUserStakingData();

  const balances = useMemo(
    () => [
      {
        label: "HZN Price",
        value: `$${formatPrice(hznRate.toNumber(), { mantissa: 4 })}`,
        color: COLOR.safe,
      },
      {
        label: "HZN Balance",
        value: `${formatNumber(collateral)} HZN`,
      },
      {
        label: "zUSD Balance",
        value: `${formatNumber(zUSDBalance)} zUSD`,
      },
      {
        label: "",
      },
      {
        label: "Debt",
        value: `$ ${formatNumber(debtBalance)}`,
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
        bgcolor='#0C111D'
        borderRadius={{
          xs: 0,
          md: 2.5, // 10px
        }}
        {...props}
      >
        <CRatioRange px={2} />
        <Box
          mt={4}
          p={2}
          pt={0}
          pb={3}
          textAlign='center'
          bgcolor='rgba(16,38,55,0.3)'
        >
          <StakingApy
            percent={stakingAPR * 100}
            isEstimate={isEstimateAPR}
            bgcolor='#091620'
            sx={{
              transform: "translateY(-50%)",
            }}
          />
          <Box p={2} bgcolor='rgba(12, 17, 29, 0.5)'>
            <Balance data={balances} />
          </Box>
        </Box>
        <ClaimCountDown p={2} />
      </Box>
    </>
  );
}
