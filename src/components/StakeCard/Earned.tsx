import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useCountUp } from "react-countup";
import { CARD_CONTENT, COLOR } from "@utils/theme/constants";
import useRefreshEarn from "@hooks/useRefreshEarn";
import PrimaryButton from "@components/PrimaryButton";
import { formatNumber } from "@utils/number";
import { getWalletErrorMsg } from "@utils/helper";
import useStaking from "@hooks/staker/useStaking";

interface Props {
  token: TokenEnum;
  earned: number;
}

export default function Earned({ token, earned }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useRefreshEarn();

  const stakingContract = useStaking(token);

  const end: number = useMemo(
    () => parseFloat(formatNumber(earned).replace(/,/g, "")),
    [earned]
  );

  const countUpRef = useRef<HTMLElement>(null);
  const { start } = useCountUp({
    ref: countUpRef,
    end,
    decimals: 2,
    duration: 1,
  });
  useEffect(start, [end, start]);

  const handleHarvest = useCallback(async () => {
    if (stakingContract) {
      try {
        setLoading(true);
        const tx = await stakingContract.getReward();
        enqueueSnackbar(
          <>
            Transaction has been sent to blockchain,
            <br />
            waiting for confirmation...
          </>,
          { variant: "info" }
        );
        const res = await tx.wait(1);
        console.log("Harvest:", res);
        enqueueSnackbar(`Successfully harvested ${formatNumber(earned)} HZN`, {
          variant: "success",
        });
        refresh();
      } catch (e: any) {
        enqueueSnackbar(getWalletErrorMsg(e), { variant: "error" });
      }
      setLoading(false);
    }
  }, [earned, enqueueSnackbar, refresh, stakingContract]);

  return (
    <Box {...CARD_CONTENT} display="flex" alignItems="center">
      <Box flex="1" overflow="hidden">
        <Typography
          variant="caption"
          color={alpha(COLOR.text, 0.5)}
          fontSize={12}
          fontWeight={900}
          letterSpacing="1px"
        >
          HZN EARNED
        </Typography>

        <Typography
          ref={countUpRef}
          variant="body1"
          paddingRight={8}
          fontSize={24}
          fontFamily="Rawline"
          fontWeight={500}
          textOverflow="ellipsis"
          overflow="hidden"
          color={earned ? COLOR.safe : undefined}
        />
      </Box>
      <PrimaryButton
        loading={loading}
        size="large"
        disabled={earned <= 0}
        onClick={handleHarvest}
      >
        Harvest
      </PrimaryButton>
    </Box>
  );
}
