import { useMemo, useCallback, useState } from "react";
import { useSetState } from "ahooks";
import { useAtomValue } from "jotai/utils";
import { Box } from "@material-ui/core";
import { ethers, utils } from "ethers";
import horizon from "@lib/horizon";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import {
  formatCRatioToPercent,
  minBN,
  toBigNumber,
  zeroBN,
} from "@utils/number";
import {
  getStakingAmount,
  getMintAmount,
  getTransferableAmountFromBurn,
} from "@utils/helper";
import { targetCRatioAtom } from "@atoms/app";
import { hznRateAtom } from "@atoms/exchangeRates";
import { debtAtom, hznStakedAtom, zUSDBalanceAtom } from "@atoms/debt";
import headerBg from "@assets/images/burn.png";
import arrowImg from "@assets/images/burn-arrow.png";
import arrowRightImg from "@assets/images/burn-arrow-right.png";
import PageCard from "@components/PageCard";
import PresetCRatioOptions from "@components/PresetCRatioOptions";
import TokenPair, {
  formatInputValue,
  InputState,
  TokenProps,
} from "@components/TokenPair";
import BalanceChange, {
  Props as BalanceChangeProps,
} from "@components/BalanceChange";
import PrimaryButton from "@components/PrimaryButton";

const THEME_COLOR = PAGE_COLOR.burn;

export default function Earn() {
  const targetCRatio = useAtomValue(targetCRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const hznRateBN = useMemo(() => toBigNumber(hznRate), [hznRate]);
  const { currentCRatio, balance, transferable, debtBalance, escrowedReward } =
    useAtomValue(debtAtom);
  const zUSDBalance = useAtomValue(zUSDBalanceAtom);
  const staked = useAtomValue(hznStakedAtom);

  const [state, setState] = useSetState<InputState>({
    fromInput: "",
    fromMax: false,
    toInput: "",
    toMax: false,
  });

  const fromToken: TokenProps = useMemo(
    () => ({
      token: zAssets.zUSD,
      label: "BURN",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBigNumber(0),
      max: minBN(zUSDBalance, debtBalance),
      maxButtonLabel: "Burn Max",
      inputPrefix: "$",
      toPairInput: (amount) =>
        getStakingAmount(targetCRatio, amount, hznRateBN).toString(),
    }),
    [debtBalance, hznRateBN, targetCRatio, zUSDBalance]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      token: Token.HZN,
      label: "UNSTAKE",
      amount: toBigNumber(0),
      balanceLabel: `Staked:`,
      max: staked,
      maxButtonLabel: "Unstake Max",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPairInput: (amount) =>
        getMintAmount(targetCRatio, amount, hznRateBN).toString(),
    }),
    [hznRateBN, staked, targetCRatio]
  );

  const handleSelectPresetCRatio = useCallback(
    (presetCRatio: BN) => {
      const fromInput = balance
        .multipliedBy(presetCRatio)
        .div(targetCRatio)
        .minus(staked);
      const { toPairInput } = fromToken;
      const toPairAmount = fromInput.toString() || "0";
      setState({
        fromInput: formatInputValue(fromInput.toString()),
        fromMax: false,
        toInput: formatInputValue(toPairInput(toPairAmount)),
        toMax: false,
      });
    },
    [balance, targetCRatio, staked, fromToken, setState]
  );

  const fromAmount = useMemo(
    () => toBigNumber(state.fromInput || 0),
    [state.fromInput]
  );
  // const toAmount = useMemo(
  //   () => toBigNumber(state.toInput || 0),
  //   [state.toInput]
  // );
  const changedBalance: BalanceChangeProps = useMemo(() => {
    const changedStaked = staked.plus(fromAmount);

    const changedDebt = changedStaked
      .multipliedBy(targetCRatio)
      .multipliedBy(hznRateBN);

    const changedTransferable = getTransferableAmountFromBurn(
      fromAmount,
      escrowedReward,
      targetCRatio,
      hznRateBN,
      transferable
    );

    const changedCRatio = changedStaked.multipliedBy(targetCRatio).div(balance);

    console.log({
      balance: balance.toNumber(),
      escrowedReward: escrowedReward.toNumber(),
      debt: debtBalance.toString(),
      changedDebt: changedDebt.toString(),
      staked: staked.toNumber(),
      transferable: transferable.toNumber(),
      hznRate: hznRateBN.toString(),
      targetCRatio: targetCRatio.toNumber(),
      currentCRatio: currentCRatio.toString(),
      changedCRatio: changedCRatio.toString(),
      changedStaked: changedStaked.toNumber(),
      changedTransferable: changedTransferable.toNumber(),
    });
    return {
      cRatio: {
        from: currentCRatio,
        to: changedCRatio,
      },
      debt: {
        from: debtBalance,
        to: changedDebt,
      },
      staked: {
        from: staked,
        to: changedStaked,
      },
      transferrable: {
        from: transferable,
        to: changedTransferable,
      },
      gapImg: arrowRightImg,
    };
  }, [
    fromAmount,
    staked,
    targetCRatio,
    hznRateBN,
    transferable,
    balance,
    currentCRatio,
    debtBalance,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const handleBurn = useCallback(async () => {
    try {
      const {
        contracts: { Synthetix },
      } = horizon.js!;
      setLoading(true);
      let tx: ethers.ContractTransaction;
      if (state.fromMax) {
        console.log("mint max");
        tx = await Synthetix.issueMaxSynths();
      } else {
        console.log("mint", state.fromInput);
        tx = await Synthetix.issueSynths(utils.parseEther(state.fromInput));
      }
      const res = await tx.wait(1);
      console.log("res", res);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, [state.fromInput, state.fromMax]);

  return (
    <PageCard
      mx='auto'
      color={THEME_COLOR}
      headerBg={headerBg}
      title='Burn'
      description={
        <>
          Burn zUSD to unlock your staked HZN. This increases your
          Collateralization Ratio and reduces your debt, allowing you to
          transfer your non-escrowed HZN.
        </>
      }
    >
      <PresetCRatioOptions
        color={THEME_COLOR}
        value={changedBalance.cRatio.to}
        onChange={handleSelectPresetCRatio}
      />
      <TokenPair
        mt={3}
        fromToken={fromToken}
        toToken={toToken}
        arrowImg={arrowImg}
        state={state}
        setState={setState}
      />
      <BalanceChange my={3} {...changedBalance} />
      <Box>
        <PrimaryButton
          loading={loading}
          disabled={fromAmount.eq(0)}
          size='large'
          fullWidth
          onClick={handleBurn}
        >
          Burn Now
        </PrimaryButton>
      </Box>
    </PageCard>
  );
}
