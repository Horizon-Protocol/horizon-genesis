import { useMemo, useCallback, useState } from "react";
import { useAtomValue } from "jotai/utils";
import { Box } from "@mui/material";
import { ethers, utils } from "ethers";
import { useSnackbar } from "notistack";
import horizon from "@lib/horizon";
import { PAGE_COLOR } from "@utils/theme/constants";
import { Token } from "@utils/constants";
import {
  formatCRatioToPercent,
  formatNumber,
  toBN,
  zeroBN,
} from "@utils/number";
import {
  getStakingAmount,
  getMintAmount,
  getTransferableAmountFromMint,
  getWalletErrorMsg,
} from "@utils/helper";
import useWallet from "@hooks/useWallet";
import { targetRatioAtom } from "@atoms/app";
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
  isExceedMax,
} from "@components/TokenPair";
import BalanceChange, {
  Props as BalanceChangeProps,
} from "@components/BalanceChange";
import PrimaryButton from "@components/PrimaryButton";
import useRefresh from "@hooks/useRefresh";
import ConnectButton from "@components/ConnectButton";

const THEME_COLOR = PAGE_COLOR.mint;

export default function Mint() {
  const { connected } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const targetRatio = useAtomValue(targetRatioAtom);
  const hznRate = useAtomValue(hznRateAtom);
  const { currentCRatio, balance, collateral, transferable, debtBalance } =
    useAtomValue(debtAtom);
  const { stakedCollateral, unstakedCollateral, dashboardEscrowed } =
    useAtomValue(collateralDataAtom);

  const unstakedCollateralUSD = useMemo(
    () => getMintAmount(targetRatio, unstakedCollateral, hznRate),
    [hznRate, targetRatio, unstakedCollateral]
  );

  const { state, setState } = useInputState();

  const fromToken: TokenProps = useMemo(
    () => ({
      disabled: !connected,
      token: Token.HZN,
      label: "STAKE",
      amount: toBN(0),
      balanceLabel: `Balance: ${formatNumber(unstakedCollateral)} ${Token.HZN}`,
      max: unstakedCollateral,
      maxButtonLabel: "Mint Max",
      color: THEME_COLOR,
      labelColor: THEME_COLOR,
      toPairInput: (amount) =>
        getMintAmount(targetRatio, amount, hznRate).toString(),
    }),
    [connected, hznRate, targetRatio, unstakedCollateral]
  );

  const toToken: TokenProps = useMemo(
    () => ({
      disabled: !connected,
      token: Token.ZUSD,
      label: "MINT",
      color: THEME_COLOR,
      bgColor: "#0A1624",
      amount: toBN(0),
      max: unstakedCollateralUSD,
      balanceLabel: `Minted at ${formatCRatioToPercent(targetRatio)}% C-Ratio`,
      inputPrefix: "$",
      toPairInput: (amount) =>
        getStakingAmount(targetRatio, amount, hznRate).toString(),
    }),
    [connected, hznRate, targetRatio, unstakedCollateralUSD]
  );

  const handleSelectPresetCRatio = useCallback(
    (presetCRatio: BN) => {
      // console.log("preset c-ratio:", presetCRatio.toNumber());
      const isMax = presetCRatio.eq(targetRatio);
      const { toPairInput, max } = fromToken;
      let inputHZN: string;
      if (isMax) {
        inputHZN = max!.toString();
      } else {
        // console.log({
        //   balance: balance.toString(),
        //   collateral: collateral.toString(),
        //   presetCRatio: presetCRatio.toString(),
        //   targetRatio: targetRatio.toString(),
        //   stakedCollateral: stakedCollateral.toString(),
        // });
        inputHZN = collateral
          .multipliedBy(presetCRatio)
          .div(targetRatio)
          .minus(stakedCollateral)
          .toString();
        // console.log("input HZN", inputHZN.toString());
      }

      setState(() => ({
        fromInput: formatInputValue(inputHZN),
        toInput: formatInputValue(toPairInput(inputHZN)),
        isMax,
        error: isExceedMax(inputHZN, max) ? "Insufficient balance" : "",
      }));
    },
    [targetRatio, fromToken, setState, balance, collateral, stakedCollateral]
  );

  const fromAmount = useMemo(
    () => (state.isMax ? fromToken.max! : toBN(state.fromInput || 0)),
    [fromToken.max, state.fromInput, state.isMax]
  );

  const changedBalance: Omit<BalanceChangeProps, "changed"> = useMemo(() => {
    const changedStaked = stakedCollateral.plus(fromAmount);

    const changedDebt = changedStaked
      .multipliedBy(targetRatio)
      .multipliedBy(hznRate);

    const changedTransferable = transferable.isZero()
      ? zeroBN
      : getTransferableAmountFromMint(collateral, changedStaked, dashboardEscrowed);

    const changedCRatio = fromAmount.gt(0)
      ? currentCRatio.isLessThan(targetRatio)
        ? changedDebt.div(
            unstakedCollateral.plus(stakedCollateral).multipliedBy(hznRate)
          )
        : changedDebt.div(changedStaked.multipliedBy(hznRate))
      : currentCRatio;

    const changedEscrowed = dashboardEscrowed.isZero()
    ? zeroBN
    : fromAmount.gt(transferable) ? transferable.plus(dashboardEscrowed).minus(fromAmount) : dashboardEscrowed;

    // console.log({
    //   fromAmount: fromAmount.toString(),
    //   balance: balance.toString(),
    //   debt: debtBalance.toString(),
    //   changedDebt: changedDebt.toString(),
    //   stakedCollateral: stakedCollateral.toNumber(),
    //   unstakedCollateral: unstakedCollateral.toNumber(),
    //   transferable: transferable.toNumber(),
    //   hznRate: hznRate.toString(),
    //   changedStaked: changedStaked.toString(),
    //   targetRatio: targetRatio.toString(),
    //   currentCRatio: currentCRatio.toString(),
    //   changedCRatio: changedCRatio.toString(),
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
      escrowed: {
        from: dashboardEscrowed,
        to: changedEscrowed,
      },
      gapImg: arrowRightImg,
    };
  }, [
    stakedCollateral,
    fromAmount,
    targetRatio,
    hznRate,
    transferable,
    collateral,
    currentCRatio,
    unstakedCollateral,
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
        // console.log("mint max");
        tx = await Synthetix.issueMaxSynths();
      } else {
        // console.log("mint", state.toInput);
        tx = await Synthetix.issueSynths(utils.parseEther(state.toInput));
      }
      const res = await tx.wait(1);
      // console.log("res", res);
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
  }, [state.isMax, state.toInput, setState, refresh, enqueueSnackbar]);

  const mintDisabled = useMemo(() => {
    if (fromAmount.eq(0) || fromAmount.gt(fromToken.max!)) {
      return true;
    }
    return false;
  }, [fromAmount, fromToken.max]);

  return (
    <PageCard
      mx="auto"
      color={THEME_COLOR}
      headerBg={headerBg}
      title="Mint"
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
        mt={1}
        fromToken={fromToken}
        toToken={toToken}
        arrowImg={arrowImg}
        state={state}
        setState={setState}
      />
      <BalanceChange my={2} changed={!!state.fromInput} {...changedBalance} />
      <Box>
        {connected && (
          <PrimaryButton
            loading={loading}
            disabled={mintDisabled}
            size="large"
            fullWidth
            onClick={handleMint}
          >
            Mint Now
          </PrimaryButton>
        )}
        {!connected && (
          <ConnectButton
            size='large'
            fullWidth
          />
        )}
      </Box>
    </PageCard>
  );
}
