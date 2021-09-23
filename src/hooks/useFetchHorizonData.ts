import { useCallback } from "react";
import { useQuery, QueryFunction } from "react-query";
import { useUpdateAtom } from "jotai/utils";
import hznData from "@horizon-protocol/data";
import { HORIZON_DATA } from "@utils/queryKeys";
import { top1000HoldersAtom } from "@atoms/summary";

export default function useFetchHorizonData() {
  const setTop1000Holders = useUpdateAtom(top1000HoldersAtom);

  const fetcher = useCallback<QueryFunction>(async () => {
    const top1000Holders = await hznData.hzn.holders({ max: 1000 });

    if (import.meta.env.DEV) {
      console.log({
        top1000Holders,
      });
    }
    setTop1000Holders(top1000Holders);
  }, [setTop1000Holders]);

  useQuery(HORIZON_DATA, fetcher, {
    refetchInterval: 60000,
  });
}
