import { StakingAddresses } from "@utils/constants";
import abi from "@abis/staking.json";
import { Staking } from "@abis/types";
import useContract, { useRpcContract } from "../useContract";

export default function useStaking(token: TokenEnum, writable = true) {
  const contract = useContract<Staking>(StakingAddresses[token], abi, writable);

  return contract;
}

export function useRpcStaking(token: TokenEnum) {
  const contract = useRpcContract<Staking>(StakingAddresses[token], abi);

  return contract;
}
