import { BoxProps } from "@material-ui/core";
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
      content='Horizon Dashboard is now live! View real-time network statistics for Horizon Protocol'
      onClose={() => setDismissed(true)}
      {...props}
    >
      <ActionLink href='https://dashboard.horizonprotocol.com/' target='_blank'>
        View Now
      </ActionLink>
    </BaseAlert>
  );
}
