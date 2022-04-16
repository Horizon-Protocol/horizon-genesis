import { StakingAddresses } from "@utils/constants";
import abi from "@contracts/abis/Staking.json";
import { Staking } from "@contracts/typings";
import useContract from "../useContract";

export default function useStaking(token: TokenEnum, writable = true) {
  const contract = useContract<Staking>(StakingAddresses[token], abi, writable);

  return contract;
}
