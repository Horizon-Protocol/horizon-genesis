import { useCallback } from "react";
import { useQuery } from "react-query";
import { BigNumber, constants } from "ethers";
import chunk from "lodash/chunk";
import zipWith from "lodash/zipWith";
import { useUpdateAtom } from "jotai/utils";
import { State, lpStateAtom } from "@atoms/staker/lp";
import useMultiCall from "@hooks/useMultiCall";
import { Token } from "@utils/constants";
import { tokenContractMap } from "@utils/multiContracts";
import { etherToBN } from "@utils/number";
import { EARN, LP } from "./queryKeys";

const LpContracts = [
  {
    token: Token.HZN_BNB_LP,
    token1: Token.HZN,
    token2: Token.HZN   //useless token2 is for placeholder
  },
  {
    token: Token.ZUSD_BUSD_LP,
    token1: Token.ZUSD,
    token2: 'BUSD'
  },
];

export default async function useFetchLpPrice() {
  const setLpState = useUpdateAtom(lpStateAtom);

  const getMultiCallProvider = useMultiCall();

  const staticFetcher = useCallback(async () => {
    const multiCallProvider = await getMultiCallProvider();

    const calls: any[] = [];
    for (const { token, token1, token2 } of LpContracts) {
      const lpContract = tokenContractMap[token];
      const token1Contract = tokenContractMap[token1];
      const token2Contract = tokenContractMap[token2];
      calls.push(
        lpContract ? lpContract.totalSupply() : constants.Zero,
        lpContract && token1Contract
          ? token1Contract.balanceOf(lpContract.address)
          : constants.Zero,
        lpContract && token2Contract
        ? token2Contract.balanceOf(lpContract.address)
        : constants.Zero
      );
    }

    const res = (await multiCallProvider.all(calls)) as BigNumber[];
    const resBN = res.map(etherToBN);

    const lpState: State = {};
    zipWith(
      LpContracts,
      chunk(resBN, 3),
      ({ token }, [totalSupply, token1Balance, token2Balance]) => {
        lpState[token] = { totalSupply, token1Balance, token2Balance };
      }
    );

    setLpState(lpState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMultiCallProvider]);

  useQuery([EARN, LP, "pool-static"], staticFetcher);
}
