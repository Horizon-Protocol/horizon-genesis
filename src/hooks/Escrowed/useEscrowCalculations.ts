import { rewardsEscrowAtom, tokenSaleEscrowAtom } from "@atoms/record";
import useWallet from "@hooks/useWallet";
import { useAtomValue } from "jotai/utils";
import { useMemo } from "react";
import { formatBNWithDecimals } from "@utils/number";
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

		// const tokenSaleEscrowBalance = formatUnitsWithDecimals(tokenSaleEscrow?.totalEscrowed)
		// const tokenSaleClaimableBalance = formatUnitsWithDecimals(tokenSaleEscrow?.claimableAmount)
		// const tokenSaleVestedBalance = formatUnitsWithDecimals(tokenSaleEscrow?.totalVested)

		const totalEscrowBalance = formatBNWithDecimals(stakingEscrowBalance)/* + tokenSaleEscrowBalance;*/
		const totalClaimableBalance = formatBNWithDecimals(stakingClaimableBalance)/* + tokenSaleClaimableBalance;*/
		const totalVestedBalance = formatBNWithDecimals(stakingVestedBalance)/* + tokenSaleVestedBalance;*/

		const result = {
			totalEscrowBalance,
			totalClaimableBalance,
			totalVestedBalance
		}
		return result
	}, [rewardsEscrow, tokenSaleEscrow]);

	return results;
}