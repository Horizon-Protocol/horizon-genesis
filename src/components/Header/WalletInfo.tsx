import { useUpdateAtom, useAtomValue } from "jotai/utils";
import { Button, Box, BoxProps, Avatar } from "@mui/material";
import { openAtom, openLinkDropDownAtom } from "@atoms/wallet";
import useWallet from "@hooks/useWallet";
import Network from "./Network";
import { detailAtom } from "@atoms/wallet";
import { COLOR } from "@utils/theme/constants";

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
      sx={{
        backgroundColor: 'rgba(16, 38, 55, 0.4)',
        ":hover":{
          backgroundColor: 'rgba(16, 38, 55, 1)',
        }
      }}
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
          color: COLOR.text,
          p: "4px 0px 4px 12px",
          height:'36px',
          textTransform: "lowercase",
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
        <Box sx={{
          ml:'10px',
          height:"34px",
          width:"34px",
          borderRadius:'3px',
          backgroundColor:'rgba(26, 46, 71, 0.3)',
          display:'flex',
          justifyContent:"center"
        }}>
        <Box
          alignSelf='center'
          component='i'
          height={6}
          width={6}
          borderRadius='50%'
          bgcolor={connected ? "#2AD4B7" : "gray"}
          boxShadow='0px 0px 4px rgba(42, 212, 183, 0.5)'
        />
        </Box>
      </Button>
    </Box>
  );
}
