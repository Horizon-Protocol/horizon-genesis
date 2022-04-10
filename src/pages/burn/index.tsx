import { useMemo, useCallback, useState, useEffect } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, Typography } from "@mui/material";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import horizon from "@lib/horizon";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import {
  BNToEther,
  formatNumber,
  maxBN,
  minBN,
  toBN,
  zeroBN,
} from "@utils/number";
import { targetRatioAtom } from "@atoms/app";
import { hznRateAtom } from "@atoms/exchangeRates";
import {
  debtAtom,
  collateralDataAtom,
  zUSDBalanceAtom,
  burnAmountToFixCRatioAtom,
} from "@atoms/debt";
import useWallet from "@hooks/useWallet";
import useRefresh from "@hooks/useRefresh";
import useFetchBurnStatus from "@hooks/useFetchBurnStatus";
import headerBg from "@assets/images/burn.svg";
import arrowImg from "@assets/images/burn-arrow.svg";
import arrowRightImg from "@assets/images/burn-arrow-right.svg";
import PageCard from "@components/PageCard";
import PresetCRatioOptions from "@components/PresetCRatioOptions";
import TokenPair, {
  useInputState,
  formatInputValue,
  TokenProps,
  isExceedMax,
} from "@components/TokenPair";
import BalanceChange, {
  Props as BalanceChangeProps,
} from "@components/BalanceChange";
import PrimaryButton from "@components/PrimaryButton";
import {
  getTransferableAmountFromBurn,
  getWalletErrorMsg,
} from "@utils/helper";
import { toFutureDate } from "@utils/date";

const THEME_COLOR = PAGE_COLOR.burn;

export default function Burn() {
  const { account, connected } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const targetRatio = useAtomValue(targetRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const {
    currentCRatio,
    transferable,
    debtBalance,
    escrowedReward,
    collateral,
    issuableSynths,
  } = useAtomValue(debtAtom);
  const zUSDBalance = useAtomValue(zUSDBalanceAtom);
  const { stakedCollateral } = useAtomValue(collateralDataAtom);
  const burnAmountToFixCRatio = useAtomValue(burnAmountToFixCRatioAtom);

  const collateralUSD = useMemo(
    () => collateral.multipliedBy(hznRate),
    [collateral, hznRate]
  );

  const { state, setState } = useInputState();

  const [waitingPeriod, setWaitingPeriod] = useState<number>();
  const [issuanceDelay, setIssuanceDelay] = useState<number>();

  const refresh = useRefresh();
  const fetchBurnStatus = useFetchBurnStatus();

  useEffect(() => {
    if (connected) {
      fetchBurnStatus().then(({ waitingPeriod, issuanceDelay }) => {
        setWaitingPeriod(waitingPeriod);
        setIssuanceDelay(issuanceDelay);
      });
    }
  }, [connected, fetchBurnStatus]);

  const fromToken: TokenProps = useMemo(
    () => ({
      disabled: !connected,
      token: zAssets.zUSD,
      label: "BURN",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBN(0),
      max: minBN(zUSDBalance, debtBalance),
      maxButtonLabel: "Burn Max",
      inputPrefix: "$",
      toPairInput: (amount) =>
        toBN(amount)
          .minus(burnAmountToFixCRatio)
          .div(hznRate)
          .div(targetRatio)
          .toString(),
    }),
    [
      burnAmountToFixCRatio,
      connected,
      debtBalance,
      hznRate,
      targetRatio,
      zUSDBalance,
    ]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      disabled: !connected,
      token: Token.HZN,
      label: "UNSTAKE",
      amount: toBN(0),
      balanceLabel: `Staked: ${formatNumber(stakedCollateral)} ${Token.HZN}`,
      max: stakedCollateral,
      maxButtonLabel: "Unstake Max",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPairInput: (amount) => {
        const tmpAmount = toBN(amount)
          .multipliedBy(hznRate)
          .multipliedBy(targetRatio);
        const toAmount = burnAmountToFixCRatio.gt(zeroBN)
          ? burnAmountToFixCRatio.minus(tmpAmount)
          : tmpAmount;
        return toAmount.toString();
      },
    }),
    [burnAmountToFixCRatio, connected, hznRate, stakedCollateral, targetRatio]
  );

  const handleSelectPresetCRatio = useCallback(
    (presetCRatio: BN) => {
      const fromInput =
        maxBN(
          debtBalance.minus(collateralUSD.multipliedBy(presetCRatio)),
          zeroBN
        ).toString() || "0";
      const { toPairInput, max } = fromToken;
      setState(() => ({
        fromInput: formatInputValue(fromInput),
        toInput: formatInputValue(toPairInput(fromInput)),
        isMax: false,
        error: isExceedMax(fromInput, max) ? "Insufficient balance" : "",
      }));
    },
    [debtBalance, collateralUSD, fromToken, setState]
  );

  const fromAmount = useMemo(
    () => toBN(state.fromInput || 0),
    [state.fromInput]
  );
  // const toAmount = useMemo(
  //   () => toBN(state.toInput || 0),
  //   [state.toInput]
  // );
  const changedBalance: Omit<BalanceChangeProps, "changed"> = useMemo(() => {
    const changedDebt = debtBalance.minus(fromAmount);

    const changedStaked = changedDebt.div(targetRatio).div(hznRate);

    // debtBalance + (escrowedReward * hznRate * targetRatio) - issuableSynths
    const debtEscrowBalance = maxBN(
      debtBalance
        .plus(escrowedReward.multipliedBy(hznRate).multipliedBy(targetRatio))
        .minus(issuableSynths),
      zeroBN
    );
    const changedTransferable = getTransferableAmountFromBurn(
      fromAmount,
      debtEscrowBalance,
      targetRatio,
      hznRate,
      transferable
    );

    const changedCRatio = debtBalance.minus(fromAmount).div(collateralUSD);

    // console.log({
    //   balance: balance.toNumber(),
    //   burnAmountToFixCRatio: burnAmountToFixCRatio.toNumber(),
    //   escrowedReward: escrowedReward.toNumber(),
    //   debt: debtBalance.toString(),
    //   changedDebt: changedDebt.toString(),
    //   staked: staked.toNumber(),
    //   transferable: transferable.toNumber(),
    //   hznRate: hznRate.toString(),
    //   targetRatio: targetRatio.toNumber(),
    //   currentCRatio: currentCRatio.toString(),
    //   changedCRatio: changedCRatio.toString(),
    //   changedStaked: changedStaked.toNumber(),
    //   changedTransferable: changedTransferable.toNumber(),
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
    debtBalance,
    fromAmount,
    targetRatio,
    hznRate,
    escrowedReward,
    issuableSynths,
    transferable,
    collateralUSD,
    stakedCollateral,
    currentCRatio,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const handleBurn = useCallback(async () => {
    try {
      const {
        contracts: { Synthetix, Issuer },
        utils,
      } = horizon.js!;
      setLoading(true);
      const burnToTarget = changedBalance.cRatio.to.eq(targetRatio);
      const zUSDBytes = utils.formatBytes32String("zUSD");
      const isWaitingPeriod: boolean = await Synthetix.isWaitingPeriod(
        zUSDBytes
      );
      console.log("isWaitingPeriod", isWaitingPeriod);
      if (isWaitingPeriod) {
        throw new Error("Waiting period for zUSD is still ongoing");
      }

      if (!burnToTarget && !(await Issuer.canBurnSynths(account))) {
        throw new Error("Waiting period to burn is still ongoing");
      }

      let tx: ethers.ContractTransaction;
      if (burnToTarget) {
        console.log("burn to target");
        tx = await Synthetix.burnSynthsToTarget();
      } else {
        const burnAmount = state.isMax
          ? BNToEther(fromToken.max!)
          : utils.parseEther(state.fromInput);
        console.log("burn amount:", burnAmount.toString());
        tx = await Synthetix.burnSynths(burnAmount);
      }
      const res = await tx.wait(1);
      console.log("res", res);
      setState(() => ({
        fromInput: "",
        toInput: "",
        isMax: false,
      }));
      refresh();
    } catch (e: any) {
      enqueueSnackbar(getWalletErrorMsg(e), {
        variant: "error",
      });
    }
    setLoading(false);
  }, [
    account,
    changedBalance.cRatio.to,
    enqueueSnackbar,
    fromToken.max,
    refresh,
    setState,
    state.fromInput,
    state.isMax,
    targetRatio,
  ]);

  const burnDisabled = useMemo(() => {
    if (waitingPeriod || issuanceDelay) {
      return true;
    }
    if (fromAmount.eq(0) || fromAmount.gt(fromToken.max!)) {
      return true;
    }
    return false;
  }, [fromAmount, fromToken.max, issuanceDelay, waitingPeriod]);

  return (
    <PageCard
      mx="auto"
      color={THEME_COLOR}
      headerBg={headerBg}
      title="Burn"
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
        isBurn
        value={changedBalance.cRatio.to}
        onChange={handleSelectPresetCRatio}
      />
      {waitingPeriod || issuanceDelay ? (
        <Box mt={3}>
          <Typography variant="h6" align="center">
            Burning blocked until: <br />
            {toFutureDate((waitingPeriod || issuanceDelay)!)}
          </Typography>
        </Box>
      ) : null}
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
            disabled={burnDisabled}
            size="large"
            fullWidth
            onClick={handleBurn}
          >
            Burn Now
          </PrimaryButton>
        )}
      </Box>
    </PageCard>
  );
}
