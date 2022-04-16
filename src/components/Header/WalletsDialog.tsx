import { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close, LinkOff } from "@mui/icons-material";
import { useAtom } from "jotai";
import { SUPPORTED_WALLETS } from "@utils/constants";
import { waitForGlobal } from "@utils/helper";
import { openAtom, detailAtom, prevWalletNameAtom } from "@atoms/wallet";
import useWallet from "@hooks/useWallet";
import { injectorByName } from "@utils/web3React";

const Span = styled("span")``;
const Img = styled("img")``;

const StyledDialog = styled(Dialog)({
  ".MuiDialog-paper": {
    padding: "24px 32px 32px",
    borderRadius: "24px",
  },
});

const StyledListItem = styled(ListItemButton)({
  padding: "8px",
  marginTop: "24px",
  borderRadius: "6px",
  background: "rgba(217, 230, 255, 0.25)",
  ":hover": {
    background: "rgba(217, 230, 255, 0.5)",
  },
  ".Mui-selected": {
    color: "rgba(255, 255, 255, 0.3)",
    background: "rgba(52,129,183,0.1)",
    boxShadow: "none",
  },
});

const StyledListItemText = styled(ListItemText)({
  paddingRight: "48px",
  whiteSpace: "nowrap",
  ".MuiListItemText-primary": {
    textAlign: "center",
    fontWeight: 500,
    textTransform: "lowercase",
  },
});

export default function WalletsDialog(
  props: Omit<DialogProps, "open" | "onClose">
) {
  const { connectWallet, connected, deactivate } = useWallet();

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
    if (prevWalletName) {
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
  }, [connectWallet, prevWalletName, setDetail]);

  return (
    <StyledDialog open={open} onClose={handleClose} {...props}>
      <DialogTitle
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Span
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            textTransform: "lowercase",
            lineHeight: "28px",
          }}
        >
          Connect wallet
        </Span>
        <IconButton
          color='inherit'
          onClick={handleClose}
          sx={{
            p: "4px",
          }}
          size='large'
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
        }}
      >
        <List component='nav' disablePadding>
          {SUPPORTED_WALLETS.map((wallet) => (
            <StyledListItem
              key={wallet.key}
              selected={connected && detail?.key === wallet.key}
              onClick={() => handleSelectWallet(wallet)}
            >
              <ListItemIcon>
                <Img
                  src={wallet.logo}
                  alt={wallet.label}
                  sx={{
                    width: "32px",
                    height: "32px",
                  }}
                />
              </ListItemIcon>
              <StyledListItemText primary={wallet.label} />
            </StyledListItem>
          ))}
          {connected && (
            <StyledListItem key='disconnect' onClick={() => handleDisconnect()}>
              <ListItemIcon>
                <LinkOff
                  color='error'
                  sx={{
                    width: "32px",
                    height: "32px",
                  }}
                />
              </ListItemIcon>
              <StyledListItemText primary='Disconnect' />
            </StyledListItem>
          )}
        </List>
      </DialogContent>
    </StyledDialog>
  );
}
