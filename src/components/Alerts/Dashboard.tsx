import { BoxProps } from "@mui/material";
import { LINK_EXCHANGE } from "@utils/constants";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

const dismissAtom = atomWithStorage("alert:stats", false);

export default function Dashboard(props: BoxProps) {
  const [dismissed, setDismissed] = useAtom(dismissAtom);

  if (dismissed) {
    return null;
  }

  return (
    <BaseAlert
      title='Tip'
      content='Horizon Exchange is now Live! Trade your zUSD for a wide range of assets!'
      onClose={() => setDismissed(true)}
      {...props}
    >
      <ActionLink href={LINK_EXCHANGE} target='_blank'>
        TRADE NOW
      </ActionLink>
    </BaseAlert>
  );
}
