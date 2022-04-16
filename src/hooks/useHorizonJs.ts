import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";
import { useAtomValue } from "jotai/utils";

export default function useHorizonJs() {
  const ready = useAtomValue(readyAtom);

  if (ready) {
    return horizon?.js;
  }

  return null;
}
