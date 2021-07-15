import { CONTRACT, PUBLIC } from "@utils/queryKeys";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import useWallet from "./useWallet";
import useIsEarnPage from "./useIsEarnPage";
import useRefreshEarn from "./useRefreshEarn";

export default function useRefresh() {
  const { account } = useWallet();
  const queryClient = useQueryClient();
  const isEarnPage = useIsEarnPage();

  const refreshEarnPage = useRefreshEarn();

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
    if (isEarnPage) {
      refreshEarnPage();
    } else {
      refreshPublic();
      refreshUser();
    }
  }, [isEarnPage, refreshEarnPage, refreshPublic, refreshUser]);

  return refresh;
}
