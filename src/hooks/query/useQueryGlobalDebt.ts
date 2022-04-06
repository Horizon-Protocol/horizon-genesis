import { GRAPH_DEBT } from "@utils/queryKeys";
import { useQuery } from "react-query";
import requset, { gql } from "graphql-request";
import { GRAPH_ENDPOINT } from "@utils/constants";
import useWallet from "@hooks/useWallet";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { debtAtom } from "@atoms/debt";
import { useAtom } from "jotai";
import { globalDebtAtom } from "@atoms/record";

export type GloablDebt = {
  id: string;
  totalDebt: string;
  value: string;
};

export default function useQueryGlobalDebt() {
  const { account } = useWallet();
  const { debtBalance } = useAtomValue(debtAtom);

  // const setGlobalDebtAtom = useUpdateAtom(globalDebtAtom);
  const [globalDebt, setGlobalDebt] = useAtom(globalDebtAtom);

  const globalDebts = async () => {
    try {
      const globalDebtsReponse = await requset(
        // GRAPH_ENDPOINT,
        "https://api.thegraph.com/subgraphs/name/rout-horizon/bsc4-issuance",
        gql`
          query {
            dailyIssueds(first: 1000, orderBy: id, orderDirection: desc) {
              id
              value
              totalDebt
            }
          }
        `
      );
      console.log("===globalDebts", globalDebtsReponse);
      return globalDebtsReponse;
    } catch (e) {
      return [];
    }
  };

  useQuery([GRAPH_DEBT, "globalDebts"], globalDebts, {
    initialData: [],
    onSuccess(debts) {
      if (globalDebt?.length != debts.dailyIssueds.length) {
        setGlobalDebt(debts.dailyIssueds ?? []);
      }
    },
  });
}
