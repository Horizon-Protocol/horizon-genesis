import { useMemo, useCallback, useState } from "react";
import { useAtomValue } from "jotai/utils";
import { Box } from "@material-ui/core";
import { ethers, utils } from "ethers";
import { useSnackbar } from "notistack";
import horizon from "@lib/horizon";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import {
  formatCRatioToPercent,
  formatNumber,
  toBigNumber,
  zeroBN,
} from "@utils/number";
import {
  getStakingAmount,
  getMintAmount,
  getTransferableAmountFromMint,
} from "@utils/helper";
import useWallet from "@hooks/useWallet";
import { targetCRatioAtom } from "@atoms/app";
import { hznRateAtom } from "@atoms/exchangeRates";
import { debtAtom, collateralDataAtom } from "@atoms/debt";
import headerBg from "@assets/images/mint.svg";
import arrowImg from "@assets/images/mint-arrow.svg";
import arrowRightImg from "@assets/images/mint-arrow-right.svg";
import PageCard from "@components/PageCard";
import PresetCRatioOptions from "@components/PresetCRatioOptions";
import TokenPair, {
  useInputState,
  formatInputValue,
  TokenProps,
} from "@components/TokenPair";
import BalanceChange, {
  Props as BalanceChangeProps,
} from "@components/BalanceChange";
import PrimaryButton from "@components/PrimaryButton";
import useRefresh from "@hooks/useRefresh";

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

  const unstakedCollateralUSD = useMemo(
    () => getMintAmount(targetCRatio, unstakedCollateral, hznRate),
    [hznRate, targetCRatio, unstakedCollateral]
  );

  const { state, setState } = useInputState();

  const fromToken: TokenProps = useMemo(
    () => ({
      disabled: !connected,
      token: Token.HZN,
      label: "STAKE",
      amount: toBigNumber(0),
      balanceLabel: `Balance: ${formatNumber(unstakedCollateral)} ${Token.HZN}`,
      max: unstakedCollateral,
      maxButtonLabel: "Mint Max",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPairInput: (amount) =>
        getMintAmount(targetCRatio, amount, hznRate).toString(),
    }),
    [connected, hznRate, targetCRatio, unstakedCollateral]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      disabled: !connected,
      token: zAssets.zUSD,
      label: "MINT",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBigNumber(0),
      max: unstakedCollateralUSD,
      balanceLabel: `Minted at ${formatCRatioToPercent(targetCRatio)}% C-Ratio`,
      inputPrefix: "$",
      toPairInput: (amount) =>
        getStakingAmount(targetCRatio, amount, hznRate).toString(),
    }),
    [connected, hznRate, targetCRatio, unstakedCollateralUSD]
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

      setState(() => ({
        fromInput: formatInputValue(inputHZN.toString()),
        toInput: formatInputValue(toPairInput(inputHZN)),
        isMax,
      }));
    },
    [balance, targetCRatio, stakedCollateral, fromToken, setState]
  );

  const fromAmount = useMemo(
    () => (state.isMax ? fromToken.max! : toBigNumber(state.fromInput || 0)),
    [fromToken.max, state.fromInput, state.isMax]
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

    // console.log({
    //   balance: balance.toString(),
    //   //   debt: debtBalance.toString(),
    //   changedDebt: changedDebt.toString(),
    //   //   stakedCollateral: stakedCollateral.toNumber(),
    //   //   transferable: transferable.toNumber(),
    //   hznRate: hznRate.toString(),
    //   collateral: collateral.toString(),
    //   changedStaked: changedStaked.toString(),
    //   targetCRatio: targetCRatio.toString(),
    //   currentCRatio: currentCRatio.toString(),
    //   changedCRatio: changedCRatio.toString(),
    //   //   changedTransferable: changedTransferable.toNumber(),
    // });
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

  const refresh = useRefresh();
  const [loading, setLoading] = useState<boolean>(false);
  const handleMint = useCallback(async () => {
    try {
      const {
        contracts: { Synthetix },
      } = horizon.js!;
      setLoading(true);
      let tx: ethers.ContractTransaction;
      if (state.isMax) {
        console.log("mint max");
        tx = await Synthetix.issueMaxSynths();
      } else {
        console.log("mint", state.toInput);
        tx = await Synthetix.issueSynths(utils.parseEther(state.toInput));
      }
      const res = await tx.wait(1);
      console.log("res", res);
      setState(() => ({
        fromInput: "",
        toInput: "",
        isMax: false,
      }));
      refresh();
    } catch (e) {
      console.log(e);
      console.log(e.error);
      const detail = `${e.error?.code}: ${e.error?.reason}`;
      enqueueSnackbar(e.error ? detail : "Operation Failed", {
        variant: "error",
      });
    }
    setLoading(false);
  }, [state.isMax, state.toInput, setState, refresh, enqueueSnackbar]);

  const mintDisabled = useMemo(() => {
    if (fromAmount.eq(0) || fromAmount.gt(fromToken.max!)) {
      return true;
    }
    return false;
  }, [fromAmount, fromToken.max]);

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
        mt={2}
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
            disabled={mintDisabled}
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
