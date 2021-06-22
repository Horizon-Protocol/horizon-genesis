import { Contract, Provider } from "@horizon-protocol/ethcall";
import useRpcProvider from "./useRpcProvider";

export { Contract };

export default async function useMultiCallProvider() {
  const rpcProvider = useRpcProvider();

  const ethcallProvider = new Provider();
  await ethcallProvider.init(rpcProvider);

  return ethcallProvider;
}
