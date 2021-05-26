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
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Close, LinkOff } from "@material-ui/icons";
import { SUPPORTED_WALLETS } from "@utils/constants";
import { openAtom, detailAtom } from "@atoms/wallet";
import useWallet from "@hooks/useWallet";

const useStyles = makeStyles(({ palette, typography }) => ({
  header: {
    minWidth: 350,
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
  },
  closeIcon: {
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
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

const StyledListItemText = withStyles(({ palette }) => ({
  root: {
    paddingRight: 48,
    whiteSpace: "nowrap",
  },
  primary: {
    textAlign: "center",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.88,
  },
}))(ListItemText);

export default function WalletsDialog(
  props: Omit<DialogProps, "open" | "onClose">
) {
  const classes = useStyles();
  const { connectWallet, connected, deactivate } = useWallet();

  const [open, setOpen] = useAtom(openAtom);
  const [detail, setDetail] = useAtom(detailAtom);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const handleSelectWallet = async (wallet: WalletDetail) => {
    if (wallet.key === detail?.key && connected) {
      setOpen(false);
    } else {
      // change wallet
      deactivate();
      setDetail(wallet);
      setTimeout(() => {
        connectWallet(wallet.connectorId);
      }, 50);
    }
  };

  const handleDisconnect = async () => {
    // change wallet
    deactivate();
    setDetail(null);
    setOpen(false);
  };

  useEffect(() => {
    if (connected) {
      setOpen(false);
    }
  }, [connected, setOpen]);

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
