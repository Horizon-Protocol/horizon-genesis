import { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Close, LinkOff } from "@material-ui/icons";
import { SUPPORTED_WALLETS } from "@utils/constants";
import { waitForGlobal } from "@utils/helper";
import { appDataReadyAtom } from "@atoms/app";
import { openAtom, detailAtom, prevWalletNameAtom } from "@atoms/wallet";
import useWallet from "@hooks/useWallet";
import { injectorByName } from "@utils/web3React";

const useStyles = makeStyles(({ breakpoints, typography }) => ({
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...typography.h6,
    fontSize: 24,
    letterSpacing: "3px",
    textTransform: "uppercase",
    lineHeight: "28px",
    [breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  closeIcon: {
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
    [breakpoints.down("sm")]: {
      width: 28,
      height: 28,
    },
  },
}));

const StyledDialog = withStyles(({ palette }) => ({
  paper: {
    border: `1px solid ${palette.divider}`,
    borderRadius: 10,
  },
}))(Dialog);

const StyledListItem = withStyles(({ palette }) => ({
  root: {
    padding: 12,
    marginBottom: 24,
    borderRadius: 6,
    backgroundColor: "rgba(28, 57, 95, 0.6)",
    "&:hover": {
      backgroundColor: "rgba(28, 57, 95, 1)",
    },
  },
  selected: {
    border: `1px solid ${palette.secondary.main}`,
  },
}))(ListItem);

const StyledListItemText = withStyles(({ breakpoints }) => ({
  root: {
    paddingRight: 48,
    whiteSpace: "nowrap",
  },
  primary: {
    textAlign: "center",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.88,
    [breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
}))(ListItemText);

export default function WalletsDialog(
  props: Omit<DialogProps, "open" | "onClose">
) {
  const classes = useStyles();
  const { connectWallet, connected, deactivate } = useWallet();

  const appDataReady = useAtomValue(appDataReadyAtom);
  const [prevWalletName, setPrevWalletName] = useAtom(prevWalletNameAtom);

  const [open, setOpen] = useAtom(openAtom);
  const [detail, setDetail] = useAtom(detailAtom);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const handleSelectWallet = useCallback(
    async (wallet: WalletDetail) => {
      if (wallet.key === detail?.key && connected) {
        setOpen(false);
      } else {
        // change wallet
        deactivate();
        setDetail(wallet);
        setTimeout(() => {
          const injectorName = injectorByName[wallet.connectorId];
          waitForGlobal(injectorName, () => {
            connectWallet(wallet);
          });
        }, 50);
      }
    },
    [connectWallet, connected, deactivate, detail?.key, setDetail, setOpen]
  );

  const handleDisconnect = useCallback(() => {
    // disconnect wallet
    deactivate();
    setDetail(null);
    setOpen(false);
    setPrevWalletName("");
  }, [deactivate, setDetail, setOpen, setPrevWalletName]);

  useEffect(() => {
    if (connected) {
      setOpen(false);
    }
  }, [connected, setOpen]);

  // Auto connect last connected wallet.
  useEffect(() => {
    if (prevWalletName && appDataReady) {
      const wallet = SUPPORTED_WALLETS.find(
        (item) => item.key === prevWalletName
      );
      if (wallet) {
        setDetail(wallet);
        const injectorName = injectorByName[wallet.connectorId];
        waitForGlobal(injectorName, () => {
          connectWallet(wallet);
        });
      }
    }
  }, [appDataReady, connectWallet, prevWalletName, setDetail]);

  return (
    <StyledDialog open={open} onClose={handleClose} {...props}>
      <DialogTitle disableTypography classes={{ root: classes.header }}>
        <span className={classes.title}>Connect wallet</span>
        <IconButton
          color='inherit'
          onClick={handleClose}
          classes={{ root: classes.closeIcon }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List component='nav'>
          {SUPPORTED_WALLETS.map((wallet) => (
            <StyledListItem
              key={wallet.key}
              button
              selected={connected && detail?.key === wallet.key}
              onClick={() => handleSelectWallet(wallet)}
            >
              <ListItemIcon>
                <img
                  src={wallet.logo}
                  alt={wallet.label}
                  className={classes.logo}
                />
              </ListItemIcon>
              <StyledListItemText primary={wallet.label} />
            </StyledListItem>
          ))}
          {connected && (
            <StyledListItem
              key='disconnect'
              button
              onClick={() => handleDisconnect()}
            >
              <ListItemIcon>
                <LinkOff color='error' className={classes.logo} />
              </ListItemIcon>
              <StyledListItemText primary='Disconnect Wallet' />
            </StyledListItem>
          )}
        </List>
      </DialogContent>
    </StyledDialog>
  );
}
