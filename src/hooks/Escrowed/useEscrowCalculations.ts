import { rewardsEscrowAtom, tokenSaleEscrowAtom } from "@atoms/record";
import useWallet from "@hooks/useWallet";
import { formatUnitsWithDecimals, toBN, zeroBN } from "@utils/number";
import { useAtomValue } from "jotai/utils";
import { useMemo } from "react";
import { formatNumber } from "@utils/number";
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
		const stakingEscrowBalance = formatUnitsWithDecimals(rewardsEscrow?.totalEscrowed)
		const stakingClaimableBalance = formatUnitsWithDecimals(rewardsEscrow?.claimableAmount)
		const stakingVestedBalance = formatUnitsWithDecimals(rewardsEscrow?.totalVested)

		const tokenSaleEscrowBalance = formatUnitsWithDecimals(tokenSaleEscrow?.totalEscrowed)
		const tokenSaleClaimableBalance = formatUnitsWithDecimals(tokenSaleEscrow?.claimableAmount)
		const tokenSaleVestedBalance = formatUnitsWithDecimals(tokenSaleEscrow?.totalVested)

		const totalEscrowBalance = stakingEscrowBalance + tokenSaleEscrowBalance;
		const totalClaimableBalance = stakingClaimableBalance + tokenSaleClaimableBalance;
		const totalVestedBalance = stakingVestedBalance + tokenSaleVestedBalance;

		const result = {
			totalEscrowBalance,
			totalClaimableBalance,
			totalVestedBalance
		}
		return result
	}, [rewardsEscrow, tokenSaleEscrow]);

	return results;
}