import { openAtom } from "@atoms/wallet";
import { useUpdateAtom } from "jotai/utils";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

export default function Disconnected() {
  const openWalletDialog = useUpdateAtom(openAtom);

  return (
    <BaseAlert
      title='Tip'
      content='To get started, please connect to a wallet.'
    >
      <ActionLink onClick={() => openWalletDialog(true)}>
        Connect Now
      </ActionLink>
    </BaseAlert>
  );
}
