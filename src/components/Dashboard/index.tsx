import { useMemo } from "react";
import { formatEther } from "@ethersproject/units";
import { hznRateAtom } from "@atoms/exchangeRates";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { debtAtom } from "@atoms/debt";
import { formatBalance, formatNumber } from "@utils/formatters";
import { BORDER_COLOR, COLOR } from "@utils/theme/constants";
import CRatioRange from "./CRatioRange";
import StakingApy from "./StakingApy";
import Balance from "./Balance";
import ClaimCountDown from "./ClaimCountDown";

const useStyles = makeStyles(({ palette }) => ({
  container: {
    width: "100%",
    maxWidth: 320,
    background: "#0C111D",
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

  const { balance, transferable, debtBalance } = useAtomValue(debtAtom);

  const hznRate = useAtomValue(hznRateAtom);

  const balances = useMemo(
    () => [
      {
        label: "HZN Price",
        value: `$${formatNumber(hznRate)}`,
        color: COLOR.safe,
      },
      {
        label: "HZN Balance",
        value: `${formatBalance(balance)} HZN`,
      },
      {
        label: "zUSD Balance",
        value: `${formatBalance(balance)} zUSD`,
      },
      {
        label: "",
      },
      {
        label: "Debt",
        value: `$ ${formatBalance(debtBalance)}`,
      },
      {
        label: "Staked",
        value: `${formatBalance(balance)} HZN`,
      },
      {
        label: "Transferrable",
        value: `${formatBalance(transferable)} HZN`,
      },
    ],
    [hznRate, balance, debtBalance, transferable]
  );

  return (
    <Box
      border={1}
      borderRadius={10}
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
        <StakingApy percent={105.34} className={classes.apy} />
        <Box p={1} className={classes.balance}>
          <Balance data={balances} />
        </Box>
      </Box>
      <ClaimCountDown p={2} />
    </Box>
  );
}
