import { useMemo } from "react";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Button, Box, BoxProps, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { openAtom } from "@atoms/wallet";
import { availableAtomFamily } from "@atoms/balance";
import useWallet from "@hooks/useWallet";
import { Token } from "@utils/constants";
import { formatBalance } from "@utils/formatters";

const useStyles = makeStyles({
  root: {
    borderRadius: 16,
    background: "rgba(16,38,55,0.3)",
    border: "1px solid #11263B",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  button: {
    padding: "6px 12px",
  },
  dot: {
    display: "inline-block",
    marginRight: 12,
    height: 12,
    width: 12,
    borderRadius: "50%",
    backgroundColor: ({ connected }: { connected: boolean }) =>
      connected ? "#2AD4B7" : "gray",
  },
  balance: {
    borderTop: "1px solid #11263B",
    padding: "6px 12px",
    textAlign: "right",
  },
});

const StyledUnit = withStyles(() => ({
  root: {
    paddingLeft: 12,
    color: "#88ABC3",
  },
}))(Typography);

export default function WalletInfo({ className, ...props }: BoxProps) {
  const { shortAccount, connected } = useWallet();
  const classes = useStyles({ connected });
  const setOpen = useUpdateAtom(openAtom);

  const availablePHB = useAtomValue(availableAtomFamily(Token.PHB));
  const availableHZN = useAtomValue(availableAtomFamily(Token.HZN));

  const balances = useMemo(() => {
    return [
      {
        token: Token.HZN,
        amount: availableHZN,
      },
      {
        token: Token.PHB,
        amount: availablePHB,
      },
    ];
  }, [availablePHB, availableHZN]);

  return (
    <Box className={clsx(classes.root, className)} {...props}>
      <Button variant='text' size='small' className={classes.button}>
        <Typography variant='body2' onClick={() => setOpen(true)}>
          <i className={classes.dot} />
          {shortAccount}
        </Typography>
      </Button>
      <Box className={classes.balance}>
        {balances.map(({ token, amount }) => (
          <Box key={token}>
            <Typography variant='caption'>{formatBalance(amount)}</Typography>
            <StyledUnit variant='caption'>{token} Balance</StyledUnit>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
