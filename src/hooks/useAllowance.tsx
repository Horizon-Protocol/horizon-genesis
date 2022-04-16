import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { StakingAddresses, TokenAddresses } from "@utils/constants";
import { BNToEther, etherToBN, toBN } from "@utils/number";
import { getWalletErrorMsg } from "@utils/helper";
import { poolStateAtomFamily } from "@atoms/staker/pool";
import useWallet from "./useWallet";
import { useERC20 } from "./useContract";

const minAllowance = toBN(1_000_000);

export default function useTokenAllowance(token: TokenEnum) {
  const { account } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const [{ allowance }, setPoolState] = useAtom(poolStateAtomFamily(token));

  const tokenContract = useERC20(TokenAddresses[token], true);

  const handleApprove = useCallback(async () => {
    if (account && tokenContract) {
      setLoading(true);
      try {
        const total = await tokenContract.totalSupply();
        const totalBN = etherToBN(total);
        const approveAmountBN = totalBN.lt(minAllowance)
          ? minAllowance
          : totalBN;
        const tx = await tokenContract.approve(
          StakingAddresses[token],
          BNToEther(approveAmountBN)
        );
        enqueueSnackbar(
          <>
            Approval request has been sent to blockchain,
            <br />
            waiting for confirmation...
          </>,
          { variant: "info" }
        );
        const res = await tx.wait(1);
        // console.log("approve", res);
        setPoolState({ allowance: etherToBN(total) });
      } catch (e: any) {
        enqueueSnackbar(getWalletErrorMsg(e), {
          variant: "error",
        });
      }
      setLoading(false);
    }
  }, [account, tokenContract, token, enqueueSnackbar, setPoolState]);

  const checkApprove = useCallback(
    async (amount: BN) => {
      if (allowance && amount.lte(allowance)) {
        // console.log("already approved", allowance.toString());
        return;
      }

      handleApprove();
    },
    [allowance, handleApprove]
  );

  return {
    loading: loading || !allowance,
    needApprove: !allowance || allowance.lte(0),
    allowance,
    handleApprove,
    checkApprove,
  };
}
