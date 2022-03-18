import { useMemo } from "react";
import { Box, Typography, LinearProgress, BoxProps } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { useAtomValue } from "jotai/utils";
import { ratiosPercentAtom } from "@atoms/app";
import { currentCRatioPercentAtom } from "@atoms/debt";
import { formatNumber } from "@utils/number";
import { COLOR } from "@utils/theme/constants";
import Tooltip from "@components/Tooltip";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconRefresh } from "@assets/images/icon-refresh.svg";
import useWallet from "@hooks/useWallet";
import { useIsFetching, useQueryClient } from "react-query";
import { WALLET } from "@utils/queryKeys";
import { useCallback } from "react";

const getColorByRatioPercent = (
  ratioPercent: number,
  liquidationPercent: number,
  targetPercent: number
) => {
  if (ratioPercent <= liquidationPercent) {
    return COLOR.danger;
  }
  if (ratioPercent < targetPercent) {
    return COLOR.warning;
  }
  return COLOR.safe;
};

const getProgressByRatioPercent = (
  ratioPercent: number,
  liquidationPercent: number,
  targetPercent: number
) => {
  let percent = 0;
  if (ratioPercent <= 0) {
    percent = 0;
  } else if (ratioPercent < liquidationPercent) {
    percent = (ratioPercent / liquidationPercent) * 25;
  } else if (ratioPercent < targetPercent) {
    percent =
      25 +
      ((ratioPercent - liquidationPercent) /
        (targetPercent - liquidationPercent)) *
        50;
  } else {
    // ratio >= target
    percent =
      75 + ((ratioPercent - targetPercent) / (1000 - targetPercent)) * 25;
  }

  return Math.min(percent, 100);
};

const Tick = ({
  percent = 0,
  left = 0,
  label,
  color,
}: {
  percent: number;
  left: number | string;
  label: string;
  color?: string;
}) => {
  return (
    <Box position='absolute' top={1} left={left} color={color}>
      <Box height={24} borderLeft={`1px solid ${COLOR.border}`} />
      <Typography
        mt={0.5}
        fontSize={9}
        sx={{
          transform: "translateX(-50%)",
        }}
      >
        <strong>{percent}%</strong>
        <br />
        {label}
      </Typography>
    </Box>
  );
};

export default function CRatioRange(props: BoxProps) {
  const { targetCRatioPercent, liquidationRatioPercent } =
    useAtomValue(ratiosPercentAtom);
  const currentCRatioPercent = useAtomValue(currentCRatioPercentAtom);

  const { account } = useWallet()
  const queryClient = useQueryClient()
  const balacneRefreshing = useIsFetching(WALLET)

  const refreshBalance = useCallback(() => {
    queryClient.refetchQueries([WALLET, account, "balances"], {
      fetching: false,
    });
  }, [queryClient, account])

  const { progress, color } = useMemo(
    () => ({
      color: getColorByRatioPercent(
        currentCRatioPercent,
        liquidationRatioPercent,
        targetCRatioPercent
      ),
      progress: getProgressByRatioPercent(
        currentCRatioPercent,
        liquidationRatioPercent,
        targetCRatioPercent
      ),
    }),
    [currentCRatioPercent, liquidationRatioPercent, targetCRatioPercent]
  );

  return (
    <Box py={3} textAlign='center' {...props} sx={{
      position: "relative"
    }}>
       <SvgIcon
        onClick={refreshBalance}
        sx={{
          cursor:"pointer",
          position:"absolute",
          right: 8,
          top: {md:2, xs:30},
          color: "text.primary",
          width: 14,
          animation: "circular-rotate 4s linear infinite",
          animationPlayState: balacneRefreshing ? "running" : "paused",
          "@keyframes circular-rotate": {
            from: {
              transform: "rotate(0deg)",
              /* 修复 IE11 下的抖动 */
              transformOrigin: "50% 50%",
            },
            to: {
              transform: "rotate(360deg)",
            },
          },
        }}
      >
         <IconRefresh />
      </SvgIcon>
      <Typography
        variant='h6'
        fontSize={22}
        letterSpacing='0.92px'
        lineHeight='26px'
        textAlign='center'
        fontWeight='bold'
        color={currentCRatioPercent ? color : undefined}
      >
        {currentCRatioPercent ? formatNumber(currentCRatioPercent) : "--"}%
      </Typography>
      <Tooltip
        title={
          <>
            Your Current C-Ratio is based on your{" "}
            <code>HZN Balance * HZN Price / Debt</code>. Maintaining a C-Ratio
            of {targetCRatioPercent}% or more will allow you to claim rewards.
            If your C-ratio goes below the liquidation ratio of{" "}
            {liquidationRatioPercent}% for more than 3 days, your account will
            be at risk of liquidation.
          </>
        }
        placement='top'
      >
        <Typography
          variant='subtitle2'
          m='8px 0 16px'
          lineHeight='14px'
          letterSpacing='0.5px'
        >
          Current C-Ratio
          <HelpOutline fontSize='inherit' />
        </Typography>
      </Tooltip>
      <Box position='relative' pb={4}>
        <LinearProgress
          variant='determinate'
          value={progress}
          valueBuffer={currentCRatioPercent}
          sx={{
            height: 24,
            borderRadius: 1,
            border: `1px solid ${COLOR.border}`,
            "&.MuiLinearProgress-colorPrimary": {
              bgcolor: "transparent",
            },
            ".MuiLinearProgress-bar": {
              bgcolor: color,
              borderRadius: 0,
            },
          }}
        />
        {liquidationRatioPercent > 0 && (
          <Tick
            percent={liquidationRatioPercent}
            left='25%'
            label='Liquidation'
            color={COLOR.danger}
          />
        )}
        {targetCRatioPercent > 0 && (
          <Tick
            percent={targetCRatioPercent}
            left='75%'
            label='Target'
            color={COLOR.safe}
          />
        )}
      </Box>
    </Box>
  );
}
