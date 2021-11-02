import { useUpdateAtom } from "jotai/utils";
import { ButtonProps } from "@mui/material";
import { openAtom } from "@atoms/wallet";
import PrimaryButton from "./PrimaryButton";

const isAvailable = true;

export default function ConnectButton(props: ButtonProps) {
  const setOpen = useUpdateAtom(openAtom);

  return (
    <PrimaryButton
      color='primary'
      onClick={() => setOpen(true)}
      disabled={!isAvailable}
      {...props}
    >
      {isAvailable ? "Connect Wallet" : "Available Soon"}
    </PrimaryButton>
  );
}
