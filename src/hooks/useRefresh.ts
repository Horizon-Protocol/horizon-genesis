import { CONTRACT, PUBLIC, EARN, WALLET, CONTRACT_ALL_PUBLIC, CONTRACT_ALL_PRIVATE } from "@utils/queryKeys";
import { useCallback, useState, useEffect } from "react";
import { useQueryClient, useIsFetching } from "react-query";
import useWallet from "./useWallet";
import useIsEarnPage from "./useIsEarnPage";
import useRefreshEarn from "./useRefreshEarn";
import dayjs from "dayjs";

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

const getTimeNow = () => dayjs().format("MMM DD, YYYY HH:mm:ss");
export function useIsRefrshing() {
  const isEarnFetching = useIsFetching(EARN);
  const isContractFetching = useIsFetching(CONTRACT);
  const isUserFetching = useIsFetching(WALLET);
  const isCombinePublic = useIsFetching(CONTRACT_ALL_PUBLIC);
  const isCombinePrivate = useIsFetching(CONTRACT_ALL_PRIVATE);

  const refreshing = isEarnFetching || isContractFetching || isUserFetching || isCombinePublic || isCombinePrivate;

  const [time, setTime] = useState(getTimeNow());

  useEffect(() => {
    if (!refreshing) {
      setTime(getTimeNow());
    }
  }, [refreshing]);

  return { refreshing, time };
}

