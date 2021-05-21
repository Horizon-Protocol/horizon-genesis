import { useUpdateAtom } from "jotai/utils";
import { Button, Box, BoxProps, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { openAtom } from "@atoms/wallet";
import useWallet from "@hooks/useWallet";
import Network from "./Network";

const useStyles = makeStyles({
  root: {
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  address: {
    borderRadius: 4,
    padding: "6px 12px",
    border: "1px solid rgba(55,133,185,0.25)",
  },
  dot: {
    display: "inline-block",
    marginLeft: 12,
    height: 12,
    width: 12,
    borderRadius: "50%",
    backgroundColor: ({ connected }: { connected: boolean }) =>
      connected ? "#2AD4B7" : "gray",
  },
});

export default function WalletInfo({ className, ...props }: BoxProps) {
  const { shortAccount, connected } = useWallet();
  const classes = useStyles({ connected });
  const setOpen = useUpdateAtom(openAtom);

  return (
    <Box
      display='flex'
      alignItems='center'
      className={clsx(classes.root, className)}
      {...props}
    >
      <Network />
      <Button variant='text' size='small' className={classes.address}>
        <Typography variant='body2' onClick={() => setOpen(true)}>
          {shortAccount}
          <i className={classes.dot} />
        </Typography>
      </Button>
    </Box>
  );
}
