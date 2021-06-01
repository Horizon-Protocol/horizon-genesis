import { useCallback } from "react";
import { useQueryClient, QueryKey, RefetchOptions } from "react-query";
import { QueryFilters } from "react-query/types/core/utils";
import { CONTRACT } from "@utils/queryKeys";

const ContractFilter = [CONTRACT];

export default function useRefresh(
  queryKey: QueryKey = ContractFilter,
  filters?: QueryFilters,
  options?: RefetchOptions
) {
  const queryClient = useQueryClient();

  const refresh = useCallback(() => {
    queryClient.refetchQueries(
      queryKey,
      {
        fetching: false,
        ...filters,
      },
      options
    );
  }, [filters, options, queryClient, queryKey]);

  return refresh;
}
