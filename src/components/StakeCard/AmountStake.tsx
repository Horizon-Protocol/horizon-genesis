import { useCallback, useState, useMemo } from "react";
import { Box, Button, Collapse, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { useAtomValue } from "jotai/utils";
import { DEPRECATED_TOKENS, StakingAddresses, Action } from "@utils/constants";
import { CARD_CONTENT } from "@utils/theme/constants";
import useRefresh from "@hooks/useRefreshEarn";
import { useTokenAllowance } from "@hooks/useAllowance";
import useStaking from "@hooks/staker/useStaking";
import PrimaryButton from "@components/PrimaryButton";
import {
  availableAtomFamily,
  stakedAtomFamily,
  withdrawableAtomFamily,
} from "@atoms/staker/balance";
import { tokenStatAtomFamily } from "@atoms/staker/stat";
import { TokenName } from "@utils/constants";
import { BNToEther, toBN, zeroBN, formatNumber } from "@utils/number";
import AmountInput from "./AmountInput";

const useStyles = makeStyles(({ palette }) => ({
  root: {
    ...CARD_CONTENT,
    minHeight: 54,
  },
  amountBox: {
    display: "flex",
    alignItems: "center",
  },
  staked: {
    flex: 1,
    overflow: "hidden",
  },
  buttons: {
    flex: "0 0 120px",
    display: "flex",
    justifyContent: "space-between",
    color: palette.text.primary,
  },
  inputBox: {
    position: "relative",
    padding: CARD_CONTENT.padding,
  },
}));

const AmountLabel = withStyles({
  root: {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
})(Typography);

const Amount = withStyles({
  root: {
    paddingRight: 8,
    fontSize: 22,
    fontFamily: "Rawline",
    fontWeight: 500,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
})(Typography);

const InputButton = withStyles(({ palette }) => ({
  root: {
    width: 50,
    minWidth: 50,
    fontWeight: 700,
    color: palette.text.primary,
    boxShadow: "none",
  },
}))(Button);

interface Props {
  token: TokenEnum;
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

export default function AmountStake({ token, logo, disabledActions }: Props) {
  const classes = useStyles();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<Action>();
  const [input, setInput] = useState<string>();
  const [isMax, setIsMax] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const actions = useMemo(() => {
    if (disabledActions) {
      return Actions.map(({ key, ...item }) => ({
        ...item,
        key,
        disabled: disabledActions.indexOf(key) > -1,
      }));
    }
    return Actions;
  }, [disabledActions]);

  const refresh = useRefresh();

  const stakingContract = useStaking(token);
  const { loading, needApprove, handleApprove, checkApprove } =
    useTokenAllowance(token, StakingAddresses[token]);

  const available = useAtomValue(availableAtomFamily(token));
  const staked = useAtomValue(stakedAtomFamily(token));
  const withdrawable = useAtomValue(withdrawableAtomFamily(token));

  const { lockDownSeconds, isRoundActive } = useAtomValue(
    tokenStatAtomFamily(token)
  );

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

  const handleStake = useCallback(async () => {
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
  }, [
    checkApprove,
    amount,
    stakingContract,
    enqueueSnackbar,
    token,
    refresh,
    resetInput,
  ]);

  const handleUnstake = useCallback(async () => {
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
    enqueueSnackbar(`Successfully unstaked ${formatNumber(amount)} ${token}`, {
      variant: "success",
    });
    refresh();
    resetInput();
  }, [stakingContract, amount, enqueueSnackbar, token, refresh, resetInput]);

  const handleSubmit = useCallback(async () => {
    try {
      if (currentAction && token && stakingContract && amount.gt(0)) {
        setSubmitting(true);
        if (currentAction === Action.Stake) {
          await handleStake();
        } else if (currentAction === Action.Unstake) {
          await handleUnstake();
        }
      }
    } catch (e) {
      console.log(e.error);
      enqueueSnackbar(e.error ?? "Operation Failed", { variant: "error" });
    }
    setSubmitting(false);
  }, [
    currentAction,
    token,
    stakingContract,
    amount,
    handleStake,
    handleUnstake,
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
      <Box className={classes.root}>
        {needApprove ? (
          <PrimaryButton
            size='large'
            fullWidth
            loading={loading}
            onClick={handleApprove}
            disabled={DEPRECATED_TOKENS.indexOf(token) > -1}
          >
            Approve Contract
          </PrimaryButton>
        ) : (
          <>
            <AmountLabel variant='caption' color='primary'>
              {TokenName[token]} Staked
            </AmountLabel>
            <Box className={classes.amountBox}>
              <Box className={classes.staked}>
                <Amount variant='body1'>{formatNumber(staked)}</Amount>
              </Box>
              <Box className={classes.buttons}>
                {actions.map(({ key, label, disabled }) =>
                  disabled ? (
                    <i key={key} />
                  ) : (
                    <InputButton
                      key={key}
                      disabled={disabled}
                      variant='contained'
                      color={currentAction === key ? "primary" : "secondary"}
                      size='small'
                      onClick={() => handleAction(key)}
                    >
                      {label}
                    </InputButton>
                  )
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
      <Collapse in={!!currentAction}>
        <Box className={classes.inputBox}>
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
