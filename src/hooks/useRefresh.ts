import { CONTRACT, PUBLIC } from "@utils/queryKeys";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import useWallet from "./useWallet";

export default function useRefresh() {
  const { account } = useWallet();
  const queryClient = useQueryClient();

  const refreshPublic = useCallback(() => {
    queryClient.refetchQueries([CONTRACT, PUBLIC], {
      fetching: false,
    });
  }, [queryClient]);

  const refreshUser = useCallback(() => {
    if (account) {
      queryClient.refetchQueries([CONTRACT, account], {
        fetching: false,
      });
    }
  }, [account, queryClient]);

  const refresh = useCallback(() => {
    refreshPublic();
    refreshUser();
  }, [refreshPublic, refreshUser]);

  return refresh;
}
