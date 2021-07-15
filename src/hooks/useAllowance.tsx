import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { Erc20, HZN } from "@abis/types";
import { tokenAllowanceAtomFamily } from "@atoms/staker/balance";
import { Token } from "@utils/constants";
import { etherToBN } from "@utils/number";
import {
  usePHB,
  useHZN,
  useLP,
  useDeprecatedLP,
  useLegacyLP,
} from "./useContract";
import useWallet from "./useWallet";

export const useTokenAllowance = (token: TokenEnum, spenderAddress: string) => {
  const { account } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [allowance, setAllowance] = useAtom(tokenAllowanceAtomFamily(token));

  const phbContract = usePHB(true);
  const hznContract = useHZN(true);
  const lpContract = useLP(true);
  const deprecatedLpContract = useDeprecatedLP(true);
  const legacyLpContract = useLegacyLP(true);

  const tokenContract: Erc20 | HZN | null = useMemo(() => {
    switch (token) {
      case Token.PHB:
        return phbContract!;
      case Token.HZN:
        return hznContract!;
      case Token.HZN_BNB_LP:
        return lpContract!;
      case Token.HZN_BNB_LP_DEPRECATED:
        return deprecatedLpContract!;
      case Token.HZN_BNB_LP_LEGACY:
        return legacyLpContract!;
      default:
        break;
    }
    return null;
  }, [
    token,
    phbContract,
    hznContract,
    lpContract,
    deprecatedLpContract,
    legacyLpContract,
  ]);

  const fetchAllowance = useCallback(async () => {
    if (account && tokenContract) {
      setLoading(true);
      const allowance = await tokenContract.allowance(account, spenderAddress);
      console.log("allowance", token, allowance.toString());
      setAllowance(etherToBN(allowance));
      setLoading(false);
    }
  }, [account, tokenContract, setAllowance, spenderAddress, token]);

  const handleApprove = useCallback(async () => {
    if (account && tokenContract) {
      setLoading(true);
      try {
        const total = await tokenContract.totalSupply();
        const tx = await tokenContract.approve(spenderAddress, total);
        enqueueSnackbar(
          <>
            Approval request has been sent to blockchain,
            <br />
            waiting for confirmation...
          </>,
          { variant: "info" }
        );
        const res = await tx.wait(1);
        console.log("approve", res);
        setAllowance(etherToBN(total));
      } catch (e) {
        enqueueSnackbar(e?.message || "Operation failed"!, {
          variant: "error",
        });
      }
      setLoading(false);
    }
  }, [account, tokenContract, spenderAddress, enqueueSnackbar, setAllowance]);

  const checkApprove = useCallback(
    async (amount: BN) => {
      if (amount.lte(allowance)) {
        console.log("already approved", allowance.toString());
        return;
      }

      handleApprove();
    },
    [allowance, handleApprove]
  );

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  return {
    loading,
    needApprove: allowance.lte(0),
    allowance,
    handleApprove,
    checkApprove,
  };
};
