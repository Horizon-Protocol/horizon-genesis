import { useMemo, useCallback, useState, useEffect } from "react";
import { useSetState } from "ahooks";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Box, Typography } from "@material-ui/core";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import horizon from "@lib/horizon";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import { zAssets } from "@utils/zAssets";
import { maxBN, minBN, toBigNumber, zeroBN } from "@utils/number";
import { targetCRatioAtom, balanceChangedAtom } from "@atoms/app";
import { hznRateAtom } from "@atoms/exchangeRates";
import {
  debtAtom,
  collateralDataAtom,
  zUSDBalanceAtom,
  burnAmountToFixCRatioAtom,
} from "@atoms/debt";
import useWallet from "@hooks/useWallet";
import useFetchBurnStatus from "@hooks/useFetchBurnStatus";
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
import { getTransferableAmountFromBurn } from "@utils/helper";
import { toFutureDate } from "@utils/date";

const THEME_COLOR = PAGE_COLOR.burn;

export default function Earn() {
  const { account, connected } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const targetCRatio = useAtomValue(targetCRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const hznRateBN = useMemo(() => toBigNumber(hznRate), [hznRate]);
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
    () => collateral.multipliedBy(hznRateBN),
    [collateral, hznRateBN]
  );

  const [state, setState] = useSetState<InputState>({
    fromInput: "",
    fromMax: false,
    toInput: "",
    toMax: false,
  });

  const [waitingPeriod, setWaitingPeriod] = useState<number>();
  const [issuanceDelay, setIssuanceDelay] = useState<number>();
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
      token: zAssets.zUSD,
      label: "BURN",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBigNumber(0),
      max: minBN(zUSDBalance, debtBalance),
      maxButtonLabel: "Burn Max",
      inputPrefix: "$",
      toPairInput: (amount) =>
        toBigNumber(amount)
          .minus(burnAmountToFixCRatio)
          .div(hznRate)
          .div(targetCRatio)
          .toString(),
    }),
    [burnAmountToFixCRatio, debtBalance, hznRate, targetCRatio, zUSDBalance]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      token: Token.HZN,
      label: "UNSTAKE",
      amount: toBigNumber(0),
      balanceLabel: `Staked:`,
      max: stakedCollateral,
      maxButtonLabel: "Unstake Max",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPairInput: (amount) => {
        const tmpAmount = toBigNumber(amount)
          .multipliedBy(hznRate)
          .multipliedBy(targetCRatio);
        const toAmount = burnAmountToFixCRatio.gt(zeroBN)
          ? burnAmountToFixCRatio.minus(tmpAmount)
          : tmpAmount;
        return toAmount.toString();
      },
    }),
    [burnAmountToFixCRatio, hznRate, stakedCollateral, targetCRatio]
  );

  const handleSelectPresetCRatio = useCallback(
    (presetCRatio: BN) => {
      const fromInput =
        maxBN(
          debtBalance.minus(collateralUSD.multipliedBy(presetCRatio)),
          zeroBN
        ).toString() || "0";
      const { toPairInput } = fromToken;
      setState({
        fromInput: formatInputValue(fromInput),
        fromMax: false,
        toInput: formatInputValue(toPairInput(fromInput)),
        toMax: false,
      });
    },
    [debtBalance, collateralUSD, fromToken, setState]
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
    const changedDebt = debtBalance.minus(fromAmount);

    const changedStaked = changedDebt.div(targetCRatio).div(hznRateBN);

    // debtBalance + (escrowedReward * hznRate * targetCRatio) - issuableSynths
    const debtEscrowBalance = maxBN(
      debtBalance
        .plus(escrowedReward.multipliedBy(hznRateBN).multipliedBy(targetCRatio))
        .minus(issuableSynths),
      zeroBN
    );
    const changedTransferable = getTransferableAmountFromBurn(
      fromAmount,
      debtEscrowBalance,
      targetCRatio,
      hznRateBN,
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
    //   hznRate: hznRateBN.toString(),
    //   targetCRatio: targetCRatio.toNumber(),
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
    targetCRatio,
    hznRateBN,
    escrowedReward,
    issuableSynths,
    transferable,
    collateralUSD,
    stakedCollateral,
    currentCRatio,
  ]);

  const setBalanceChanged = useUpdateAtom(balanceChangedAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const handleBurn = useCallback(async () => {
    try {
      const {
        contracts: { Synthetix, Issuer },
        utils,
      } = horizon.js!;
      setLoading(true);
      const burnToTarget = changedBalance.cRatio.to.eq(targetCRatio);
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
        console.log("burn amount:", state.fromInput);
        tx = await Synthetix.burnSynths(utils.parseEther(state.fromInput));
      }
      const res = await tx.wait(1);
      console.log("res", res);
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
    account,
    changedBalance.cRatio.to,
    enqueueSnackbar,
    setBalanceChanged,
    state.fromInput,
    targetCRatio,
  ]);

  const burnDisabled = useMemo(() => {
    if (waitingPeriod || issuanceDelay) {
      return true;
    }
    if (fromAmount.eq(0) || fromAmount.gt(fromToken.max)) {
      return true;
    }
    return false;
  }, [fromAmount, fromToken.max, issuanceDelay, waitingPeriod]);

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
        isBurn
        value={changedBalance.cRatio.to}
        onChange={handleSelectPresetCRatio}
      />
      <Box mt={3}>
        {waitingPeriod || issuanceDelay ? (
          <Typography variant='h6' align='center'>
            Burning blocked until: <br />
            {toFutureDate((waitingPeriod || issuanceDelay)!)}
          </Typography>
        ) : null}
      </Box>
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
        {connected && (
          <PrimaryButton
            loading={loading}
            disabled={burnDisabled}
            size='large'
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
