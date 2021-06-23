import { EARN, PUBLIC } from "@utils/queryKeys";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import useWallet from "./useWallet";

export default function useRefresh() {
  const { account } = useWallet();
  const queryClient = useQueryClient();

  const refreshPublic = useCallback(() => {
    queryClient.refetchQueries([EARN, PUBLIC], {
      fetching: false,
    });
  }, [queryClient]);

  const refreshUser = useCallback(() => {
    if (account) {
      queryClient.refetchQueries([EARN, account], {
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
