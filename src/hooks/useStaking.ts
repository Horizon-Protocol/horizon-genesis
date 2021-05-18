import { StakingAddresses } from "@utils/constants";
import abi from "@abis/staking.json";
import { Staking } from "@abis/types";
import useContract, { useRpcContract } from "./useContract";

export default function useStaking(token: TokenEnum, writable = true) {
  const contract = useContract(StakingAddresses[token], abi, writable);

  return contract as Staking;
}

export function useRpcStaking(token: TokenEnum) {
  const contract = useRpcContract(StakingAddresses[token], abi);

  return contract as Staking;
}
