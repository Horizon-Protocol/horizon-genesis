import { useUpdateAtom } from "jotai/utils";
import { Button, Box, BoxProps } from "@mui/material";
import { openAtom } from "@atoms/wallet";
import useWallet from "@hooks/useWallet";
import Network from "./Network";

export default function WalletInfo(props: BoxProps) {
  const { shortAccount, connected } = useWallet();
  const setOpen = useUpdateAtom(openAtom);

  return (
    <Box
      display='flex'
      alignItems='center'
      whiteSpace='nowrap'
      textAlign='center'
      {...props}
    >
      <Network />
      <Button
        variant='text'
        size='small'
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 1,
          p: "4px 12px",
          border: "1px solid rgba(55,133,185,0.25)",
        }}
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
