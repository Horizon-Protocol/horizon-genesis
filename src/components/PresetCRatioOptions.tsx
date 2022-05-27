import { useCallback, useMemo } from "react";
import { Box, BoxProps, Link, Typography } from "@mui/material";
import { useAtomValue } from "jotai/utils";
import { presetCRatioPercentsAtom, targetRatioAtom } from "@atoms/app";
import { cRatioToPercent } from "@utils/number";
import { debtAtom } from "@atoms/debt";
import useWallet from "@hooks/useWallet";
import Tooltip from "@components/Tooltip";
import PresetCRatioOption from "./CRatioOption";
import ToolTipContent from "./Tooltip/ToolTipContent";
interface Props extends Omit<BoxProps, "onChange"> {
  color: string;
  isBurn?: boolean;
  value: BN; // cRatio that changed to
  onChange(cRatio: BN): void;
}

export default function PresetCRatioOptions({
  color,
  isBurn = false,
  value,
  onChange,
  ...props
}: Props) {
  const { account } = useWallet();
  const targetRatio = useAtomValue(targetRatioAtom);
  const { currentCRatio } = useAtomValue(debtAtom);
  const presetCRatioPercents = useAtomValue(presetCRatioPercentsAtom);

  const changedCratioPercent = useMemo<number>(
    () => cRatioToPercent(value),
    [value]
  );

  type OptionItem = typeof presetCRatioPercents[number];
  const checkDisabled = useCallback(
    (option: OptionItem) => {
      if (!account) {
        return true;
      }
      // burn
      if (isBurn) {
        return currentCRatio.lte(option.cRatio);
      }
      // mint
      return currentCRatio.gte(option.cRatio);
    },
    [account, currentCRatio, isBurn]
  );

  const checkActive = useCallback(
    (option: OptionItem) => {
      return (
        !currentCRatio.eq(targetRatio) &&
        changedCratioPercent > 0 &&
        option.cRatio.toFixed(6) === value.toFixed(6)
      );
    },
    [changedCratioPercent, currentCRatio, targetRatio, value]
  );

  return (
    <Box width='100%' {...props}>
      <Tooltip
        title={
          <ToolTipContent title='Preset Strategies' conetnt={<>
            Preset strategies help you manage your C-Ratio based on different
            risk tolerances. Maintaining a higher C-Ratio will lower your risk
            of liquidation, but also reduce your rewards from debt. To learn
            more about staking strategies, click{" "}
            <Link
              href='https://academy.horizonprotocol.com/horizon-genesis/staking-on-horizon-genesis/c-ratio-strategies'
              target='_blank'
            >
              here
            </Link>
          </>} />
        }
        placement='top'
      >
        <Typography variant='subtitle2' component='div' align='center' textTransform={'uppercase'} fontWeight='700' letterSpacing="1px" fontSize="12px" sx={{ cursor: 'help', color: "#B4E0FF" }}>
          Preset Strategies
        </Typography>
      </Tooltip>
      <Box mt={1} display='flex' justifyContent='space-between'>
        {presetCRatioPercents.map((option) => (
          <PresetCRatioOption
            key={option.title}
            color={color}
            disabled={checkDisabled(option)}
            active={checkActive(option)}
            onClick={() => onChange(option.cRatio)}
            {...option}
          />
        ))}
      </Box>
    </Box>
  );
}
