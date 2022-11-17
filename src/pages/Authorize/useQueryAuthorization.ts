import { CONTRACT, GRAPH_AUTHORIZATION, GRAPH_DEBT } from "@utils/queryKeys";
import { useQuery } from "react-query";
import requset, { gql } from "graphql-request";
import { GRAPH_ENDPOINT } from "@utils/constants";
import useWallet from "@hooks/useWallet";
import { atomWithReset, useResetAtom, useUpdateAtom } from "jotai/utils";
import { useAtom } from "jotai";
import { useCallback } from "react";
import useDisconnected from "@hooks/useDisconnected";
import horizon from "@lib/horizon";

export type Authorization = {
  id: string,
  delegate: string,
  canBurn: boolean,
  canClaim: boolean,
  canExchange: boolean,
  canMint: boolean,
  //ext
  all?: boolean
};

export const authorizationRecordAtom = atomWithReset<Authorization[]>([])

export default function useQueryAuthorization() {
  console.log('request')
  const { account } = useWallet();

  const updateAuthorizationRecord = useUpdateAtom(authorizationRecordAtom);
  const resetRewards = useResetAtom(authorizationRecordAtom);
  useDisconnected(resetRewards);

  const authorization = useCallback(async () => {
    try {
      const authorizationReponse = await requset(
        GRAPH_ENDPOINT('bsc2-delegation'),
        gql`
          query {
            delegatedWallets(first: 10, where: {authoriser: "${account}"}) {
              id
              delegate
              canBurn
              canClaim
              canExchange
              canMint,
            }
          }
        `
      );
      console.log('account',account)
      return authorizationReponse;
    } catch (e) {
      return [];
    }
  },[account]);

  useQuery([CONTRACT, account], authorization, {
    initialData: [],
    enabled: !!account && !!horizon.js,
    onSuccess(authorization) {
      updateAuthorizationRecord(authorization.delegatedWallets)
    },
  });
}
