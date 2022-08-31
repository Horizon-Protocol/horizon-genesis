import { GRAPH_AUTHORIZATION, GRAPH_DEBT } from "@utils/queryKeys";
import { useQuery } from "react-query";
import requset, { gql } from "graphql-request";
import { GRAPH_ENDPOINT } from "@utils/constants";
import useWallet from "@hooks/useWallet";
import { atomWithReset } from "jotai/utils";
import { useAtom } from "jotai";
import { useCallback } from "react";

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

  const [authorizationRecord, setAuthorizationRecord] = useAtom(authorizationRecordAtom);

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
      // console.log('===useQueryAuthorization Error',e)
      return [];
    }
  },[account]);

  useQuery([GRAPH_AUTHORIZATION], authorization, {
    initialData: [],
    enabled: !!account,
    onSuccess(authorization) {
      // console.log('===useQueryAuthorization',authorization.delegatedWallets)
      setAuthorizationRecord(authorization.delegatedWallets)
    },
  });
}
