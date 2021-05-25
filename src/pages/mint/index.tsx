import { useState, useMemo, useEffect } from "react";
import { useSetState } from "ahooks";
import { useAtomValue } from "jotai/utils";
import { Box } from "@material-ui/core";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import {
  formatNumber,
  toBigNumber,
  zeroBN,
  cRatioToPercent,
} from "@utils/number";
import {
  getStakingAmount,
  getMintAmount,
  getTransferableAmountFromMint,
} from "@utils/helper";
import { targetCRatioAtom } from "@atoms/app";
import { hznRateAtom } from "@atoms/exchangeRates";
import { debtAtom, hznStakedAtom } from "@atoms/debt";
import bgMint from "@assets/images/mint.png";
import arrowImg from "@assets/images/mint-arrow.png";
import arrowRightImg from "@assets/images/mint-arrow-right.png";
import PageCard from "@components/PageCard";
import PresetCRatioOptions from "@components/PresetCRatioOptions";
import TokenPair, { InputState, TokenProps } from "@components/TokenPair";
import BalanceChange, {
  Props as BalanceChangeProps,
} from "@components/BalanceChange";
import PrimaryButton from "@components/PrimaryButton";

const THEME_COLOR = PAGE_COLOR.mint;

export default function Earn() {
  const targetCRatio = useAtomValue(targetCRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const hznRateBN = useMemo(() => toBigNumber(hznRate), [hznRate]);
  const { currentCRatio, balance, transferable, debtBalance } =
    useAtomValue(debtAtom);
  const staked = useAtomValue(hznStakedAtom);

  const [cRatio, setCRatio] = useState<BN>(targetCRatio);

  const [state, setState] = useSetState<InputState>({
    fromInput: "",
    fromMax: false,
    toInput: "",
    toMax: false,
  });

  useEffect(() => {
    setCRatio(targetCRatio);
    if (targetCRatio) {
    }
  }, [targetCRatio]);

  const cRatioPercent = useMemo(() => toBigNumber(100).div(cRatio), [cRatio]);

  const fromToken: TokenProps = useMemo(
    () => ({
      token: Token.HZN,
      label: "Stake",
      amount: toBigNumber(0),
      max: transferable,
      maxButtonLabel: "Max Mint",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPair: getMintAmount,
    }),
    [transferable]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      token: zAssets.zUSD,
      label: "Mint",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBigNumber(0),
      balanceLabel: `Minted at ${formatNumber(cRatioPercent)}% C-Ratio`,
      inputPrefix: "$",
      toPair: getStakingAmount,
    }),
    [cRatioPercent]
  );

  const mockBalanceChange: BalanceChangeProps = useMemo(() => {
    const fromAmount = toBigNumber(state.fromInput || 0);
    const toAmount = toBigNumber(state.toInput || 0);

    console.log("fromAmount", fromAmount.toNumber());
    console.log("toAmount", toAmount.toNumber());

    const changedStaked = staked.plus(fromAmount);

    const changedDebt = changedStaked
      .multipliedBy(targetCRatio)
      .multipliedBy(hznRateBN);

    const changedTransferable = transferable.isZero()
      ? zeroBN
      : getTransferableAmountFromMint(balance, changedStaked);

    console.log("lt", currentCRatio.isLessThan(targetCRatio));
    const changedCRatio = currentCRatio.isLessThan(targetCRatio)
      ? balance.multipliedBy(hznRateBN).dividedBy(changedDebt)
      : changedStaked.multipliedBy(hznRateBN).dividedBy(changedDebt);

    console.log({
      balance: balance.toNumber(),
      debt: debtBalance.toNumber(),
      staked: staked.toNumber(),
      transferable: transferable.toNumber(),
      hznRate: hznRateBN.toNumber(),
      targetCRatio: targetCRatio.toNumber(),
      currentCRatio: currentCRatio.toNumber(),
      changedStaked: changedStaked.toNumber(),
      changedDebt: changedDebt.toNumber(),
      changedTransferable: changedTransferable.toNumber(),
    });
    return {
      cRatio: {
        from: cRatioToPercent(currentCRatio),
        to: cRatioToPercent(changedCRatio),
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
    state.fromInput,
    state.toInput,
    staked,
    targetCRatio,
    hznRateBN,
    transferable,
    balance,
    currentCRatio,
    debtBalance,
  ]);

  return (
    <PageCard
      mx='auto'
      color={THEME_COLOR}
      headerBg={bgMint}
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
        value={cRatio}
        onChange={setCRatio}
      />
      <TokenPair
        mt={3}
        rate={hznRateBN}
        fromToken={fromToken}
        toToken={toToken}
        cRatio={cRatio}
        arrowImg={arrowImg}
        state={state}
        setState={setState}
      />
      <BalanceChange my={3} {...mockBalanceChange} />
      <Box>
        <PrimaryButton size='large' fullWidth>
          Mint Now
        </PrimaryButton>
      </Box>
    </PageCard>
  );
}
