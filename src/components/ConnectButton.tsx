import { useUpdateAtom } from "jotai/utils";
import { Button, ButtonProps } from "@mui/material";
import { openAtom } from "@atoms/wallet";

interface Props extends ButtonProps {
  rounded?: boolean;
}

const isAvailable = true;

export default function ConnectButton({ rounded, sx, ...props }: Props) {
  const setOpen = useUpdateAtom(openAtom);

  return (
    <Button
      variant='contained'
      color='primary'
      size='small'
      onClick={() => setOpen(true)}
      disabled={!isAvailable}
      sx={{
        fontWeight: 700,
        color: "text.primary",
        borderRadius: rounded ? 1.5 : 1,
        background: rounded
          ? "linear-gradient(180deg, #64B7DC 0%, #3785B9 100%)"
          : undefined,
        boxShadow: rounded ? "0 4px 12px 0 #050C11" : undefined,
        "&:hover": {
          background: rounded
            ? "linear-gradient(180deg, #477e97 0%, #25597c 100%)"
            : undefined,
        },
        ...sx,
      }}
      {...props}
    >
      {isAvailable ? "Connect Wallet" : "Available Soon"}
    </Button>
  );
}
