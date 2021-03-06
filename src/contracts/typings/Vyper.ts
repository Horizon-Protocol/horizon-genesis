import type {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PopulatedTransaction,
    Signer,
    utils,
  } from "ethers";
  import type {
    FunctionFragment,
    Result,
    EventFragment,
  } from "@ethersproject/abi";
  import type { Listener, Provider } from "@ethersproject/providers";
  import type {
    TypedEventFilter,
    TypedEvent,
    TypedListener,
    OnEvent,
  } from "./common";
  
  export interface VyperInterface extends utils.Interface {
    functions: {
        "get_balances()": FunctionFragment,
        "balances(uint)": FunctionFragment;
    };
  
    getFunction(
      nameOrSignatureOrTopic:
        | "get_balances"
        | "balances"
    ): FunctionFragment;
  
    encodeFunctionData(functionFragment: "get_balances", values?: undefined): string;
    encodeFunctionData(functionFragment: "balance", values: [string]): string;
    decodeFunctionResult(functionFragment: "get_balances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balance", data: BytesLike): Result;
  }
  
  export interface ApprovalEventObject {
    owner: string;
    spender: string;
    value: BigNumber;
  }
  
  export interface Vyper extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
  
    interface: VyperInterface;
  
    queryFilter<TEvent extends TypedEvent>(
      event: TypedEventFilter<TEvent>,
      fromBlockOrBlockhash?: string | number | undefined,
      toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>;
  
    listeners<TEvent extends TypedEvent>(
      eventFilter?: TypedEventFilter<TEvent>
    ): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(
      eventFilter: TypedEventFilter<TEvent>
    ): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
  
    functions: {
      get_balances(overrides?: CallOverrides): Promise<[BigNumber]>;
      balances(
        arg0: number,
        overrides?: CallOverrides
      ): Promise<[BigNumber]>;
    };
  
    get_balances(overrides?: CallOverrides): Promise<BigNumber>;
    balances(arg0: number, overrides?: CallOverrides): Promise<BigNumber>;
  
    callStatic: {
        get_balances(overrides?: CallOverrides): Promise<BigNumber>;
        balances(arg0: number, overrides?: CallOverrides): Promise<BigNumber>;
    }
  
    filters: {}
  
    estimateGas: {
        get_balances(overrides?: CallOverrides): Promise<BigNumber>;
        balances(arg0: number, overrides?: CallOverrides): Promise<BigNumber>;
    }
  
    populateTransaction: {
        get_balances(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balances(
            arg0: number,
            overrides?: CallOverrides
          ): Promise<PopulatedTransaction>;
    }
  }