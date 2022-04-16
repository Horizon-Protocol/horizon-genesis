import { readyAtom } from "@atoms/app";
import horizon from "@lib/horizon";
import { formatNumber, toBN, zeroBN } from "@utils/number";
import { GRAPH_DEBT, CONTRACT, PUBLIC } from "@utils/queryKeys";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { utils, BigNumberish } from "ethers";
import useWallet from "@hooks/useWallet";
import { tokenSaleEscrowAtom } from "@atoms/record";
import useDisconnected from "@hooks/useDisconnected";

export type TokenSaleEscrowProps = {
    claimableAmount: BN;
    totalEscrowed: BN;
    totalVested: BN;
}

export default function useTokenSaleEscrowQuery() {

    const setTokenSaleEscrow = useUpdateAtom(tokenSaleEscrowAtom)
    const resetTokenSaleEscrow = useResetAtom(tokenSaleEscrowAtom);
    useDisconnected(resetTokenSaleEscrow);

    const appReady = useAtomValue(readyAtom);
    const { account } = useWallet();

    const fetcher = useCallback(async () => {
        if (appReady && account) {
            const {
                contracts: { EscrowChecker, SynthetixEscrow },
            } = horizon.js!;
            const [accountSchedule, totalEscrowed] = await Promise.all([
                EscrowChecker.checkAccountSchedule(account),
                SynthetixEscrow.balanceOf(account),
            ])
            return {
                accountSchedule,
                totalEscrowed
            }
        }
    }, [appReady, account])

    useQuery([CONTRACT, account, "EscrowChecker", "SynthetixEscrow"], fetcher, {
        enabled: !!account && !!horizon.js,
        onSuccess(data) {
            const currentUnixTime = new Date().getTime();
            const dataReversed = data?.accountSchedule.slice().reverse()
            let hasVesting = false;
            let lastVestTime;
            const claimableAmount = zeroBN;
            let totalVested = zeroBN;
            for (let i = 0; i < dataReversed.length - 1; i += 2) {
                const parsedQuantity = (dataReversed[i]);
                const parsedDate = parseInt(dataReversed[i + 1]) * 1000;

                if (parsedDate !== 0) {
                    hasVesting = true;
                }
                if (parsedDate > 0 && parsedDate < currentUnixTime) {
                    claimableAmount.plus(parsedQuantity);
                }
                if (parsedDate !== 0 && !lastVestTime) {
                    lastVestTime = dataReversed[i + 1];
                }
                if (lastVestTime) {
                    totalVested = totalVested ? totalVested.plus(dataReversed[i]) : dataReversed[i];
                }
            }

            const result = hasVesting
                ? {
                    claimableAmount: claimableAmount,
                    totalEscrowed: data?.totalEscrowed,
                    totalVested: totalVested,
                }
                : null;
            setTokenSaleEscrow(result)
        }, onError(e) {

        }
    })
}
