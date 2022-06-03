import { rewardsEscrowAtom, tokenSaleEscrowAtom } from "@atoms/record";
import useWallet from "@hooks/useWallet";
import { useAtomValue } from "jotai/utils";
import { useMemo } from "react";
import { BNWithDecimals, formatNumber } from "@utils/number";
import useTokenSaleEscrowQuery from "./useTokenSaleEscrowQuery";
import useEscrowDataQuery from "./useEscrowDataQuery";
import { ethers } from "ethers";

export default function useEscrowCalculations(){
 
    const { account } = useWallet();

	useTokenSaleEscrowQuery()
	useEscrowDataQuery()

	const rewardsEscrow = useAtomValue(rewardsEscrowAtom)
	const tokenSaleEscrow = useAtomValue(tokenSaleEscrowAtom)

	const results = useMemo(() => {
		// formatNumber
		const stakingEscrowBalance = rewardsEscrow?.totalEscrowed
		const stakingClaimableBalance = rewardsEscrow?.claimableAmount
		const stakingVestedBalance = rewardsEscrow?.totalVested
		
		const totalEscrowBalance = BNWithDecimals(stakingEscrowBalance)/* + tokenSaleEscrowBalance;*/
		const totalClaimableBalance = BNWithDecimals(stakingClaimableBalance)/* + tokenSaleClaimableBalance;*/
		const totalVestedBalance = BNWithDecimals(stakingVestedBalance)/* + tokenSaleVestedBalance;*/
		const vestingEntriesId = rewardsEscrow?.vestingEntriesId

		const result = {
			totalEscrowBalance,
			totalClaimableBalance,
			totalVestedBalance,
			vestingEntriesId
		}
		return result
	}, [rewardsEscrow, tokenSaleEscrow]);

	return results;
}