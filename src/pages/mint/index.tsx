import { useMemo, useCallback, useState } from "react";
import { useSetState } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Box } from "@material-ui/core";
import { ethers, utils } from "ethers";
import horizon from "@lib/horizon";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import { formatCRatioToPercent, toBigNumber, zeroBN } from "@utils/number";
import {
  getStakingAmount,
  getMintAmount,
  getTransferableAmountFromMint,
} from "@utils/helper";
import { balanceChangedAtom, targetCRatioAtom } from "@atoms/app";
import { hznRateAtom } from "@atoms/exchangeRates";
import { debtAtom, hznStakedAtom } from "@atoms/debt";
import headerBg from "@assets/images/mint.png";
import arrowImg from "@assets/images/mint-arrow.png";
import arrowRightImg from "@assets/images/mint-arrow-right.png";
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

const THEME_COLOR = PAGE_COLOR.mint;

export default function Earn() {
  const targetCRatio = useAtomValue(targetCRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const hznRateBN = useMemo(() => toBigNumber(hznRate), [hznRate]);
  const {
    collateral,
    currentCRatio,
    balance,
    transferable,
    escrowedReward,
    debtBalance,
  } = useAtomValue(debtAtom);
  const staked = useAtomValue(hznStakedAtom);

  const [state, setState] = useSetState<InputState>({
    fromInput: "",
    fromMax: false,
    toInput: "",
    toMax: false,
  });

  const fromToken: TokenProps = useMemo(
    () => ({
      token: Token.HZN,
      label: "STAKE",
      amount: toBigNumber(0),
      max: transferable.plus(escrowedReward),
      maxButtonLabel: "Mint Max",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPairInput: (amount) =>
        getMintAmount(targetCRatio, amount, hznRateBN).toString(),
    }),
    [hznRateBN, targetCRatio, transferable, escrowedReward]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      token: zAssets.zUSD,
      label: "MINT",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBigNumber(0),
      max: toBigNumber(0),
      balanceLabel: `Minted at ${formatCRatioToPercent(targetCRatio)}% C-Ratio`,
      inputPrefix: "$",
      toPairInput: (amount) =>
        getStakingAmount(targetCRatio, amount, hznRateBN).toString(),
    }),
    [hznRateBN, targetCRatio]
  );

  const handleSelectPresetCRatio = useCallback(
    (presetCRatio: BN) => {
      const fromInput = balance
        .multipliedBy(presetCRatio)
        .div(targetCRatio)
        .minus(staked);
      const isMax = presetCRatio.eq(targetCRatio);
      const { toPairInput, max } = fromToken;
      const toPairAmount =
        (isMax ? max?.toString() : fromInput.toString()) || "0";
      setState({
        fromInput: formatInputValue(fromInput.toString()),
        fromMax: isMax,
        toInput: formatInputValue(toPairInput(toPairAmount)),
        toMax: false,
      });
    },
    [balance, targetCRatio, staked, fromToken, setState]
  );

  const fromAmount = useMemo(
    () => (state.fromMax ? fromToken.max : toBigNumber(state.fromInput || 0)),
    [fromToken.max, state.fromInput, state.fromMax]
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

    const changedTransferable = transferable.isZero()
      ? zeroBN
      : getTransferableAmountFromMint(balance, changedStaked);

    const changedCRatio = currentCRatio.isLessThan(targetCRatio)
      ? changedDebt.div(collateral.multipliedBy(hznRateBN))
      : changedStaked.multipliedBy(targetCRatio).div(balance);

    console.log({
      balance: balance.toString(),
      //   debt: debtBalance.toString(),
      changedDebt: changedDebt.toString(),
      //   staked: staked.toNumber(),
      //   transferable: transferable.toNumber(),
      hznRate: hznRateBN.toString(),
      collateral: collateral.toString(),
      changedStaked: changedStaked.toString(),
      targetCRatio: targetCRatio.toString(),
      currentCRatio: currentCRatio.toString(),
      changedCRatio: changedCRatio.toString(),
      //   changedTransferable: changedTransferable.toNumber(),
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
    collateral,
    debtBalance,
  ]);

  const setBalanceChanged = useUpdateAtom(balanceChangedAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const handleMint = useCallback(async () => {
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
        const mintAmount = fromToken.toPairInput(state.fromInput);
        console.log("mint", mintAmount);
        tx = await Synthetix.issueSynths(utils.parseEther(mintAmount));
      }
      const res = await tx.wait(1);
      console.log("res", res);
      setBalanceChanged(true);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, [state.fromMax, state.fromInput, setBalanceChanged, fromToken]);

  return (
    <PageCard
      mx='auto'
      color={THEME_COLOR}
      headerBg={headerBg}
      title='Mint'
      description={
        <>
          Mint zUSD by staking your HZN. <br />
          This gives you a Collateralization Ratio (C-Ratio) and a debt,
          allowing you to earn weekly staking rewards.
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
          onClick={handleMint}
        >
          Mint Now
        </PrimaryButton>
      </Box>
    </PageCard>
  );
}
