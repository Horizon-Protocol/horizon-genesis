import { useMemo, useCallback, useState } from "react";
import { useSetState } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Box } from "@material-ui/core";
import { ethers, utils } from "ethers";
import { useSnackbar } from "notistack";
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
import useWallet from "@hooks/useWallet";
import { balanceChangedAtom, targetCRatioAtom } from "@atoms/app";
import { hznRateAtom } from "@atoms/exchangeRates";
import { debtAtom, collateralDataAtom } from "@atoms/debt";
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
  const { connected } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const targetCRatio = useAtomValue(targetCRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const { collateral, currentCRatio, balance, transferable, debtBalance } =
    useAtomValue(debtAtom);
  const { stakedCollateral, unstakedCollateral } =
    useAtomValue(collateralDataAtom);

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
      max: unstakedCollateral,
      maxButtonLabel: "Mint Max",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPairInput: (amount) =>
        getMintAmount(targetCRatio, amount, hznRate).toString(),
    }),
    [hznRate, targetCRatio, unstakedCollateral]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      token: zAssets.zUSD,
      label: "MINT",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBigNumber(0),
      balanceLabel: `Minted at ${formatCRatioToPercent(targetCRatio)}% C-Ratio`,
      inputPrefix: "$",
      toPairInput: (amount) =>
        getStakingAmount(targetCRatio, amount, hznRate).toString(),
    }),
    [hznRate, targetCRatio]
  );

  const handleSelectPresetCRatio = useCallback(
    (presetCRatio: BN) => {
      console.log("preset c-ratio:", presetCRatio.toNumber());
      const isMax = presetCRatio.eq(targetCRatio);
      const { toPairInput, max } = fromToken;
      let inputHZN: string;
      if (isMax) {
        inputHZN = max!.toString();
      } else {
        inputHZN = balance
          .multipliedBy(presetCRatio)
          .div(targetCRatio)
          .minus(stakedCollateral)
          .toString();
      }

      setState({
        fromInput: formatInputValue(inputHZN.toString()),
        fromMax: isMax,
        toInput: formatInputValue(toPairInput(inputHZN)),
        toMax: false,
      });
    },
    [balance, targetCRatio, stakedCollateral, fromToken, setState]
  );

  const fromAmount = useMemo(
    () => (state.fromMax ? fromToken.max! : toBigNumber(state.fromInput || 0)),
    [fromToken.max, state.fromInput, state.fromMax]
  );

  const changedBalance: Omit<BalanceChangeProps, "changed"> = useMemo(() => {
    const changedStaked = stakedCollateral.plus(fromAmount);

    const changedDebt = changedStaked
      .multipliedBy(targetCRatio)
      .multipliedBy(hznRate);

    const changedTransferable = transferable.isZero()
      ? zeroBN
      : getTransferableAmountFromMint(balance, changedStaked);

    const changedCRatio = currentCRatio.isLessThan(targetCRatio)
      ? changedDebt.div(
          unstakedCollateral.plus(stakedCollateral).multipliedBy(hznRate)
        )
      : changedDebt.div(changedStaked.multipliedBy(hznRate));

    console.log({
      balance: balance.toString(),
      //   debt: debtBalance.toString(),
      changedDebt: changedDebt.toString(),
      //   stakedCollateral: stakedCollateral.toNumber(),
      //   transferable: transferable.toNumber(),
      hznRate: hznRate.toString(),
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
        from: stakedCollateral,
        to: changedStaked,
      },
      transferrable: {
        from: transferable,
        to: changedTransferable,
      },
      gapImg: arrowRightImg,
    };
  }, [
    stakedCollateral,
    fromAmount,
    targetCRatio,
    hznRate,
    transferable,
    balance,
    currentCRatio,
    unstakedCollateral,
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
        console.log("mint", state.toInput);
        tx = await Synthetix.issueSynths(utils.parseEther(state.toInput));
      }
      const res = await tx.wait(1);
      console.log("res", res);
      setState({
        fromInput: "",
        fromMax: false,
        toInput: "",
        toMax: false,
      });
      setBalanceChanged(true);
    } catch (e) {
      console.log(e);
      console.log(e.error);
      const detail = `${e.error?.code}: ${e.error?.reason}`;
      enqueueSnackbar(e.error ? detail : "Operation Failed", {
        variant: "error",
      });
    }
    setLoading(false);
  }, [
    state.fromMax,
    state.toInput,
    setState,
    setBalanceChanged,
    enqueueSnackbar,
  ]);

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
      <BalanceChange my={3} changed={!!state.fromInput} {...changedBalance} />
      <Box>
        {connected && (
          <PrimaryButton
            loading={loading}
            disabled={fromAmount.eq(0)}
            size='large'
            fullWidth
            onClick={handleMint}
          >
            Mint Now
          </PrimaryButton>
        )}
      </Box>
    </PageCard>
  );
}
