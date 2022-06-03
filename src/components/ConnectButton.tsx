import { useUpdateAtom, } from "jotai/utils";
import { ButtonProps } from "@mui/material";
import { openAtom, openLinkDropDownAtom } from "@atoms/wallet";
import PrimaryButton from "./PrimaryButton";

const isAvailable = true;

export default function ConnectButton(props: ButtonProps) {
  const setOpen = useUpdateAtom(openAtom);
  const setOpenLinkDropDown = useUpdateAtom(openLinkDropDownAtom);

  return (
    <PrimaryButton
      color='primary'
      onClick={() => {
        setOpen(true)
        setOpenLinkDropDown(false)
      }}
      disabled={!isAvailable}
      {...props}
    >
      {isAvailable ? "Connect Wallet" : "Available Soon"}
    </PrimaryButton>
  );
}
