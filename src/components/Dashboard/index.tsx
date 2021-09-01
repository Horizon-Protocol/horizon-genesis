import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
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

const useStyles = makeStyles(({ breakpoints }) => ({
  container: {
    width: "100%",
    background: "#0C111D",
    borderRadius: 10,
    [breakpoints.down("sm")]: {
      borderRadius: 0,
    },
  },
  stats: {
    background: "rgba(16,38,55,0.3)",
  },
  apy: {
    background: "#091620",
    transform: "translateY(-50%)",
  },
  balance: {
    background: "rgba(12, 17, 29, 0.5)",
  },
}));

export default function Dashboard({ className, ...props }: BoxProps) {
  const classes = useStyles();

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
        className={clsx(classes.container, className)}
        {...props}
      >
        <CRatioRange px={2} />
        <Box
          mt={4}
          p={2}
          pt={0}
          pb={3}
          textAlign='center'
          className={classes.stats}
        >
          <StakingApy
            percent={stakingAPR * 100}
            isEstimate={isEstimateAPR}
            className={classes.apy}
          />
          <Box p={2} className={classes.balance}>
            <Balance data={balances} />
          </Box>
        </Box>
        <ClaimCountDown p={2} />
      </Box>
    </>
  );
}
