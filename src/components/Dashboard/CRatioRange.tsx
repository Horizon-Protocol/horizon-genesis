import { useMemo } from "react";
import { Box, Typography, LinearProgress, BoxProps } from "@mui/material";
import { useAtomValue } from "jotai/utils";
import { ratiosPercentAtom } from "@atoms/app";
import { currentCRatioPercentAtom, debtAtom } from "@atoms/debt";
import { formatNumber } from "@utils/number";
import { COLOR } from "@utils/theme/constants";
import Tooltip from "@components/Tooltip";
import useWallet from "@hooks/useWallet";
import { useIsFetching, useQueryClient } from "react-query";
import { WALLET } from "@utils/queryKeys";
import { useCallback } from "react";
import ActionLink from "@components/Alerts/ActionLink";
import ToolTipContent from "@components/Tooltip/ToolTipContent";
import useCRactioProgress from "@hooks/useCRactioProgress";

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

  const { account, connected } = useWallet()
  const queryClient = useQueryClient()
  const balacneRefreshing = useIsFetching(WALLET)

  const { progress, color } = useCRactioProgress()

  const refreshBalance = useCallback(() => {
    queryClient.refetchQueries([WALLET, account, "balances"], {
      fetching: false,
    });
  }, [queryClient, account])

  const { collateral, debtBalance } = useAtomValue(debtAtom);

  const { liquidationPrice, targetPrice } = useMemo(() => {
    let liquidationPrice = (liquidationRatioPercent * debtBalance.toNumber()) / (collateral.toNumber() * 100)
    let targetPrice = (targetCRatioPercent * debtBalance.toNumber()) / (collateral.toNumber() * 100)
    return ({
      liquidationPrice,
      targetPrice
    })
  }, [liquidationRatioPercent, targetCRatioPercent, debtBalance, collateral])

  return (
    <Box pt={3.5} pb={2.25} textAlign='center' {...props} sx={{
      position: "relative"
    }}>
      <Typography
        variant='h6'
        fontSize={26}
        letterSpacing='1px'
        lineHeight='26px'
        textAlign='center'
        fontWeight='bold'
        color={currentCRatioPercent ? color : undefined}
      >
        {currentCRatioPercent ? formatNumber(currentCRatioPercent) : "--"}%
      </Typography>
      <Tooltip
        tooltipWidth={261}
        title={<ToolTipContent title='Current C-Ratio' conetnt={
          <>
            This is based on{" "}
            <code>HZN Balance * HZN Price / Debt</code>. Maintaining a C-Ratio
            of {targetCRatioPercent}% or more will allow you to claim rewards.
            If your C-ratio goes below the liquidation ratio of{" "}
            {liquidationRatioPercent}% for more than 3 days, a liquidation penalty may incur. <ActionLink fontSize='12px !important' letterSpacing='1px' href="https://academy.horizonprotocol.com/horizon-genesis/staking-on-horizon-genesis/collaterialization-and-c-ratio" target='_blank' showArrow={false}>Learn More.</ActionLink>
          </>
        } />}
        placement='top'
      >
        <Typography
          variant='subtitle2'
          m='8px 0 0px'
          lineHeight='14px'
          letterSpacing='0.5px'
          color="#B4E0FF"
          fontSize="14px"
          fontWeight="400"
          sx={{ cursor: "help" }}
        >
          Current C-Ratio
        </Typography>
      </Tooltip>
      {[liquidationPrice, targetPrice].map((item, index) => {
        return (
          <Typography key={index} sx={{
            opacity: .5,
            color: COLOR.text,
            fontSize: '8px',
            letterSpacing: '0.5px',
            width: "40%",
            ml: index == 0 ? "25%" : "75%",
            transform: index == 0 ? "translateX(-50%) translateY(100%)" : "translateX(-50%)",
          }}>${connected ? formatNumber(item, { mantissa: 3 }) : "--"}</Typography>
        )
      })}
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
