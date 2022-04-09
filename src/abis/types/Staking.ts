/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
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
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface StakingInterface extends utils.Interface {
  functions: {
    "balanceOf(address)": FunctionFragment;
    "earned(address)": FunctionFragment;
    "exit()": FunctionFragment;
    "feeCollector()": FunctionFragment;
    "getReward()": FunctionFragment;
    "getRewardForDuration()": FunctionFragment;
    "lastTimeRewardApplicable()": FunctionFragment;
    "lockDownDuration()": FunctionFragment;
    "notifyRewardAmount(uint256)": FunctionFragment;
    "periodFinish()": FunctionFragment;
    "rewardPerToken()": FunctionFragment;
    "rewardRate()": FunctionFragment;
    "rewardsDistribution()": FunctionFragment;
    "rewardsDuration()": FunctionFragment;
    "setFeeCollector(address)": FunctionFragment;
    "setLockDownDuration(uint256)": FunctionFragment;
    "setRewardsDuration(uint256)": FunctionFragment;
    "setWithdrawRate(uint256)": FunctionFragment;
    "stake(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
    "withdrawRate()": FunctionFragment;
    "withdrawableAmount(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "earned", values: [string]): string;
  encodeFunctionData(functionFragment: "exit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "feeCollector",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRewardForDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastTimeRewardApplicable",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lockDownDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "notifyRewardAmount",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "periodFinish",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsDistribution",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeCollector",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setLockDownDuration",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardsDuration",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setWithdrawRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawableAmount",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "feeCollector",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRewardForDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastTimeRewardApplicable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockDownDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "notifyRewardAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "periodFinish",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardsDistribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardsDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeCollector",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLockDownDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardsDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setWithdrawRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawableAmount",
    data: BytesLike
  ): Result;

  events: {
    "LockDownDurationUpdated(uint256)": EventFragment;
    "Recovered(address,uint256)": EventFragment;
    "RewardAdded(uint256)": EventFragment;
    "RewardPaid(address,uint256)": EventFragment;
    "RewardsDurationUpdated(uint256)": EventFragment;
    "Staked(address,uint256)": EventFragment;
    "Withdrawn(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LockDownDurationUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Recovered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardsDurationUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export type LockDownDurationUpdatedEvent = TypedEvent<
  [BigNumber],
  { newLockDownDuration: BigNumber }
>;

export type LockDownDurationUpdatedEventFilter =
  TypedEventFilter<LockDownDurationUpdatedEvent>;

export type RecoveredEvent = TypedEvent<
  [string, BigNumber],
  { token: string; amount: BigNumber }
>;

export type RecoveredEventFilter = TypedEventFilter<RecoveredEvent>;

export type RewardAddedEvent = TypedEvent<[BigNumber], { reward: BigNumber }>;

export type RewardAddedEventFilter = TypedEventFilter<RewardAddedEvent>;

export type RewardPaidEvent = TypedEvent<
  [string, BigNumber],
  { user: string; reward: BigNumber }
>;

export type RewardPaidEventFilter = TypedEventFilter<RewardPaidEvent>;

export type RewardsDurationUpdatedEvent = TypedEvent<
  [BigNumber],
  { newDuration: BigNumber }
>;

export type RewardsDurationUpdatedEventFilter =
  TypedEventFilter<RewardsDurationUpdatedEvent>;

export type StakedEvent = TypedEvent<
  [string, BigNumber],
  { user: string; amount: BigNumber }
>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export type WithdrawnEvent = TypedEvent<
  [string, BigNumber],
  { user: string; amount: BigNumber }
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface Staking extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StakingInterface;

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
    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    earned(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    feeCollector(overrides?: CallOverrides): Promise<[string]>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getRewardForDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<[BigNumber]>;

    lockDownDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    periodFinish(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardPerToken(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardsDistribution(overrides?: CallOverrides): Promise<[string]>;

    rewardsDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    setFeeCollector(
      _feeCollector: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setLockDownDuration(
      _lockdownDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRewardsDuration(
      _rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setWithdrawRate(
      _rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stake(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    withdrawableAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  exit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  feeCollector(overrides?: CallOverrides): Promise<string>;

  getReward(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getRewardForDuration(overrides?: CallOverrides): Promise<BigNumber>;

  lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

  lockDownDuration(overrides?: CallOverrides): Promise<BigNumber>;

  notifyRewardAmount(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

  rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

  rewardsDistribution(overrides?: CallOverrides): Promise<string>;

  rewardsDuration(overrides?: CallOverrides): Promise<BigNumber>;

  setFeeCollector(
    _feeCollector: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setLockDownDuration(
    _lockdownDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRewardsDuration(
    _rewardsDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setWithdrawRate(
    _rate: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stake(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  withdraw(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawRate(overrides?: CallOverrides): Promise<BigNumber>;

  withdrawableAmount(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    exit(overrides?: CallOverrides): Promise<void>;

    feeCollector(overrides?: CallOverrides): Promise<string>;

    getReward(overrides?: CallOverrides): Promise<void>;

    getRewardForDuration(overrides?: CallOverrides): Promise<BigNumber>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

    lockDownDuration(overrides?: CallOverrides): Promise<BigNumber>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    rewardsDistribution(overrides?: CallOverrides): Promise<string>;

    rewardsDuration(overrides?: CallOverrides): Promise<BigNumber>;

    setFeeCollector(
      _feeCollector: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setLockDownDuration(
      _lockdownDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setRewardsDuration(
      _rewardsDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setWithdrawRate(
      _rate: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stake(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdrawRate(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawableAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "LockDownDurationUpdated(uint256)"(
      newLockDownDuration?: null
    ): LockDownDurationUpdatedEventFilter;
    LockDownDurationUpdated(
      newLockDownDuration?: null
    ): LockDownDurationUpdatedEventFilter;

    "Recovered(address,uint256)"(
      token?: null,
      amount?: null
    ): RecoveredEventFilter;
    Recovered(token?: null, amount?: null): RecoveredEventFilter;

    "RewardAdded(uint256)"(reward?: null): RewardAddedEventFilter;
    RewardAdded(reward?: null): RewardAddedEventFilter;

    "RewardPaid(address,uint256)"(
      user?: string | null,
      reward?: null
    ): RewardPaidEventFilter;
    RewardPaid(user?: string | null, reward?: null): RewardPaidEventFilter;

    "RewardsDurationUpdated(uint256)"(
      newDuration?: null
    ): RewardsDurationUpdatedEventFilter;
    RewardsDurationUpdated(
      newDuration?: null
    ): RewardsDurationUpdatedEventFilter;

    "Staked(address,uint256)"(
      user?: string | null,
      amount?: null
    ): StakedEventFilter;
    Staked(user?: string | null, amount?: null): StakedEventFilter;

    "Withdrawn(address,uint256)"(
      user?: string | null,
      amount?: null
    ): WithdrawnEventFilter;
    Withdrawn(user?: string | null, amount?: null): WithdrawnEventFilter;
  };

  estimateGas: {
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    feeCollector(overrides?: CallOverrides): Promise<BigNumber>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getRewardForDuration(overrides?: CallOverrides): Promise<BigNumber>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

    lockDownDuration(overrides?: CallOverrides): Promise<BigNumber>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    rewardsDistribution(overrides?: CallOverrides): Promise<BigNumber>;

    rewardsDuration(overrides?: CallOverrides): Promise<BigNumber>;

    setFeeCollector(
      _feeCollector: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setLockDownDuration(
      _lockdownDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRewardsDuration(
      _rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setWithdrawRate(
      _rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stake(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawRate(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawableAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    earned(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    feeCollector(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getRewardForDuration(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastTimeRewardApplicable(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockDownDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    notifyRewardAmount(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    periodFinish(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardPerToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardsDistribution(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardsDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setFeeCollector(
      _feeCollector: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setLockDownDuration(
      _lockdownDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRewardsDuration(
      _rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setWithdrawRate(
      _rate: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stake(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawableAmount(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
