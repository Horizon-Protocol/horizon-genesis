import { StakingAddresses } from "@utils/constants";
import abi from "@abis/staking.json";
import { Staking } from "@abis/types";
import useContract, { useRpcContract } from "../useContract";
import useMultiCall, { useMultiCallContract } from "../useMultiCall";

export default function useStaking(token: TokenEnum, writable = true) {
  const contract = useContract<Staking>(StakingAddresses[token], abi, writable);

  return contract;
}

export function useRpcStaking(token: TokenEnum) {
  const contract = useRpcContract<Staking>(StakingAddresses[token], abi);

  return contract;
}

export function useMultiCallStaking(token: TokenEnum) {
  const contract = useMultiCallContract<Staking>(StakingAddresses[token], abi);

  const getProvider = useMultiCall();

  return { contract, getProvider };
}
