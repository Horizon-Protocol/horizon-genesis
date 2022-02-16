import { useUpdateAtom, useAtomValue } from "jotai/utils";
import { Button, Box, BoxProps, Avatar } from "@mui/material";
import { openAtom, openLinkDropDownAtom } from "@atoms/wallet";
import useWallet from "@hooks/useWallet";
import Network from "./Network";
import { detailAtom } from "@atoms/wallet";

export default function WalletInfo(props: BoxProps) {
  const { shortAccount, connected } = useWallet();
  const setOpen = useUpdateAtom(openAtom);
  const setOpenLinkDropDown = useUpdateAtom(openLinkDropDownAtom);
  const wallet = useAtomValue(detailAtom);

  return (
    <Box
      display='flex'
      alignItems='center'
      whiteSpace='nowrap'
      textAlign='center'
      {...props}
    >
      {/* <Network /> */}
      <Button
        size='small'
        onClick={() => {
          setOpen(true)
          setOpenLinkDropDown(false)
        }}
        sx={{
          color: "text.primary",
          borderRadius: 1,
          p: "4px 12px",
          border: "1px solid rgba(55,133,185,0.25)",
        }}
        startIcon={
          <Avatar
            variant="circular"
            src={wallet?.logo}
            alt={wallet?.label}
            sx={{
              width: 20,
              height: 20,
              ".MuiAvatar-img": {
                width: 18,
                height: 18,
                objectFit: "contain",
              },
            }}
          />
        }
      >
        {shortAccount}
        <Box
          component='i'
          display='inline-block'
          ml={1.5}
          height={12}
          width={12}
          borderRadius='50%'
          bgcolor={connected ? "#2AD4B7" : "gray"}
        />
      </Button>
    </Box>
  );
}
