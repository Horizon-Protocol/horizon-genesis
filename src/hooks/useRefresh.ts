import { useCallback } from "react";
import { useQueryClient, QueryKey, RefetchOptions } from "react-query";
import { QueryFilters } from "react-query/types/core/utils";
import { CONTRACT } from "@utils/queryKeys";

const ContractFilter = [CONTRACT];

export default function useRefresh(
  defaultQueryKey: QueryKey = ContractFilter,
  filters?: QueryFilters,
  options?: RefetchOptions
) {
  const queryClient = useQueryClient();

  const refresh = useCallback(
    (queryKey?: QueryKey) => {
      queryClient.refetchQueries(
        queryKey || defaultQueryKey,
        {
          fetching: false,
          ...filters,
        },
        options
      );
    },
    [defaultQueryKey, filters, options, queryClient]
  );

  return refresh;
}
