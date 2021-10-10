import { useCallback, useState, useMemo } from "react";
import { Box, Button, Collapse, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useAtomValue } from "jotai/utils";
import { DEPRECATED_TOKENS, Action } from "@utils/constants";
import { CARD_CONTENT, COLOR } from "@utils/theme/constants";
import useRefresh from "@hooks/useRefreshEarn";
import useTokenAllowance from "@hooks/useAllowance";
import useStaking from "@hooks/staker/useStaking";
import PrimaryButton from "@components/PrimaryButton";
import { poolStateAtomFamily } from "@atoms/staker/pool";
import { TokenName } from "@utils/constants";
import { BNToEther, toBN, zeroBN, formatNumber } from "@utils/number";
import AmountInput from "./AmountInput";

interface Props {
  token: TokenEnum;
  finished?: boolean;
  logo?: string;
  disabledActions?: ActionEnum[];
}

const Actions = [
  {
    key: Action.Stake,
    label: "+",
    disabled: false,
  },
  {
    key: Action.Unstake,
    label: "-",
    disabled: false,
  },
];

export default function AmountStake({
  token,
  finished,
  logo,
  disabledActions,
}: Props) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<Action>();
  const [input, setInput] = useState<string>();
  const [isMax, setIsMax] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const actions = useMemo(() => {
    if (finished) {
      return [];
    }
    if (disabledActions) {
      return Actions.map(({ key, ...item }) => ({
        ...item,
        key,
        disabled: disabledActions.indexOf(key) > -1,
      }));
    }
    return Actions;
  }, [finished, disabledActions]);

  const refresh = useRefresh();

  const stakingContract = useStaking(token);
  const { loading, needApprove, handleApprove, checkApprove } =
    useTokenAllowance(token);

  const { lockDownSeconds, isRoundActive, available, staked, withdrawable } =
    useAtomValue(poolStateAtomFamily(token));

  const inputMax: BN = useMemo(() => {
    if (currentAction === Action.Stake) {
      return available;
    } else if (currentAction === Action.Unstake) {
      return withdrawable;
    }
    return zeroBN;
  }, [currentAction, available, withdrawable]);

  const amount: BN = useMemo(
    () => (isMax ? inputMax : toBN((input || "0").replace(/[^0-9.]/g, ""))),
    [input, isMax, inputMax]
  );

  const handleInput = useCallback<(val: string, max?: boolean) => void>(
    (val, max = false) => {
      setIsMax(max);
      setInput(val);
    },
    []
  );

  const handleAction = useCallback<(action: Action) => void>((action) => {
    setCurrentAction((prevAction) =>
      prevAction === action ? undefined : action
    );
    setInput("0");
  }, []);

  const resetInput = useCallback(() => {
    setInput("0");
  }, []);

  const handleStake = useCallback(
    async (amount: BN) => {
      await checkApprove(amount);
      const tx = await stakingContract!.stake(BNToEther(amount));
      enqueueSnackbar(
        <>
          Transaction has been sent to blockchain,
          <br />
          waiting for confirmation...
        </>,
        { variant: "info" }
      );
      const res = await tx.wait(1);
      console.log("Stake:", res);
      enqueueSnackbar(`Successfully staked ${formatNumber(amount)} ${token}`, {
        variant: "success",
      });
      refresh();
      resetInput();
    },
    [checkApprove, stakingContract, enqueueSnackbar, token, refresh, resetInput]
  );

  const handleUnstake = useCallback(
    async (amount: BN) => {
      const tx = await stakingContract!.withdraw(BNToEther(amount));
      enqueueSnackbar(
        <>
          Transaction has been sent to blockchain,
          <br />
          waiting for confirmation...
        </>,
        { variant: "info" }
      );
      const res = await tx.wait(1);
      console.log("Unstake:", res);
      enqueueSnackbar(
        `Successfully unstaked ${formatNumber(amount)} ${token}`,
        {
          variant: "success",
        }
      );
      refresh();
      resetInput();
    },
    [stakingContract, enqueueSnackbar, token, refresh, resetInput]
  );

  const handleSubmit = useCallback(async () => {
    try {
      if (token && stakingContract) {
        setSubmitting(true);
        if (finished && withdrawable.gt(0)) {
          console.log("Unstake all", withdrawable.toNumber());
          await handleUnstake(withdrawable);
        } else if (currentAction && amount.gt(0)) {
          if (currentAction === Action.Stake) {
            console.log("Stake", amount.toNumber());
            await handleStake(amount);
          } else if (currentAction === Action.Unstake) {
            console.log("Unstake", amount.toNumber());
            await handleUnstake(amount);
          }
        }
      }
    } catch (e: any) {
      console.log(e.error);
      enqueueSnackbar(e.error ?? "Operation Failed", { variant: "error" });
    }
    setSubmitting(false);
  }, [
    token,
    stakingContract,
    finished,
    withdrawable,
    currentAction,
    amount,
    handleUnstake,
    handleStake,
    enqueueSnackbar,
  ]);

  const { btnLabel, btnDisabled } = useMemo(() => {
    const stakedNotStarted = currentAction === Action.Stake && !isRoundActive;
    return {
      btnLabel: stakedNotStarted
        ? "Not Started"
        : currentAction
        ? Action?.[currentAction]
        : "",
      btnDisabled: stakedNotStarted,
    };
  }, [currentAction, isRoundActive]);

  return (
    <>
      <Box {...CARD_CONTENT}>
        {needApprove ? (
          <PrimaryButton
            size='large'
            fullWidth
            loading={loading}
            onClick={handleApprove}
            disabled={DEPRECATED_TOKENS.indexOf(token) > -1}
            sx={{
              my: 0.75,
            }}
          >
            Approve Contract
          </PrimaryButton>
        ) : (
          <>
            <Typography
              variant='caption'
              color={alpha(COLOR.text, 0.5)}
              fontSize={12}
              fontWeight={900}
              letterSpacing='1px'
              sx={{ textTransform: "uppercase" }}
            >
              {TokenName[token]} Staked
            </Typography>
            <Box display='flex' alignItems='center'>
              <Box flex='1' overflow='hidden'>
                <Typography
                  variant='body1'
                  pr={1}
                  fontSize={22}
                  fontFamily='Rawline'
                  fontWeight={500}
                  textOverflow='ellipsis'
                  overflow='hidden'
                >
                  {formatNumber(staked)}
                </Typography>
              </Box>
              <Box
                flex='0 0 120px'
                display='flex'
                justifyContent='space-between'
                color='primary'
              >
                {actions.map(({ key, label, disabled }) =>
                  disabled ? (
                    <i key={key} />
                  ) : (
                    <Button
                      key={key}
                      disabled={disabled}
                      color={currentAction === key ? "primary" : "secondary"}
                      size='small'
                      onClick={() => handleAction(key)}
                      sx={{
                        p: "0 20px",
                        width: 50,
                        minWidth: 50,
                        lineHeight: "30px",
                        fontSize: 24,
                        fontWeight: 700,
                        color: COLOR.text,
                        boxShadow: "none",
                        bgcolor: "rgba(16, 38, 55, 0.6)",
                        "&.MuiButton-textPrimary": {
                          bgcolor: COLOR.safe,
                          color: "#1E1F25",
                        },
                      }}
                    >
                      {label}
                    </Button>
                  )
                )}
              </Box>
            </Box>
            {finished && (
              <PrimaryButton
                size='large'
                fullWidth
                loading={loading}
                onClick={handleSubmit}
                disabled={withdrawable.eq(0)}
                sx={{
                  mt: 2,
                }}
              >
                UNSTAKE ALL
              </PrimaryButton>
            )}
          </>
        )}
      </Box>
      <Collapse in={!!currentAction}>
        <Box position='relative' p={CARD_CONTENT.padding}>
          <AmountInput
            token={token}
            logo={logo}
            input={input}
            onInput={handleInput}
            amount={amount}
            max={inputMax}
            lockDownSeconds={lockDownSeconds}
            btnLabel={btnLabel}
            onSubmit={handleSubmit}
            loading={submitting}
            disabled={btnDisabled}
          />
        </Box>
      </Collapse>
    </>
  );
}
