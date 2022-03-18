import { Box, BoxProps, LinearProgress, Typography } from "@mui/material";
import { useAtomValue } from "jotai/utils";
import { nextClaimCountDownAtom, feePeriodDatesAtom } from "@atoms/feePool";
import useNextClaimCountDown from "@hooks/useNextClaimTimer";
import { COLOR } from "@utils/theme/constants";
import dayjs from "dayjs";

export default function ClaimCountDown(props: BoxProps) {
  useNextClaimCountDown();

  const nextClaimCountDown = useAtomValue(nextClaimCountDownAtom);
  const { nextClaimProgress, nextFeePeriodStarts } = useAtomValue(feePeriodDatesAtom);

  return (
    <Box textAlign='center' {...props}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center'
      }}>
        <Typography
          variant='caption'
          fontWeight={700}
          letterSpacing='0.43px'
          fontSize='12px'
          color={COLOR.text}
        >
          NEXT REWARD CLAIM
        </Typography>
        <Typography
          variant='h5'
          color={COLOR.safe}
          fontFamily='Rawline'
          fontSize='12px'
          fontWeight={700}
          letterSpacing='0.5px'
        >
          {nextClaimCountDown}
        </Typography>
      </Box>
      <LinearProgress
        variant='determinate'
        value={nextClaimProgress}
        valueBuffer={100}

        sx={{
          height: 10,
          mt: '3px',
          // borderRadius: 1,
          // border: `1px solid ${COLOR.border}`,
          "&.MuiLinearProgress-colorPrimary": {
            bgcolor: "#080C16",
          },
          ".MuiLinearProgress-bar": {
            background: `linear-gradient(-45deg,#03BB9C 25%,#2AD4B7 0,#2AD4B7 50%,#03BB9C 0,#03BB9C 75%,#2AD4B7 0)`,
            backgroundSize: '10px 10px',
            borderRadius: 0,
          },
        }}
      />
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
        mt: '3px'
      }}>
        <Typography
          variant='caption'
          fontSize='12px'
          letterSpacing='0.43px'
          color={COLOR.text}
        >
          {nextClaimProgress > 0 ? nextClaimProgress.toFixed() : 0}%
        </Typography>
        <Typography
          color='#5D6588'
          fontSize='12px'
          letterSpacing='0.5px'
        >
          {nextFeePeriodStarts ? dayjs(nextFeePeriodStarts).format('DD/MM/YYYY hh:mm') + 'UTC' : ""}
          {/* {nextFeePeriodStarts} */}
        </Typography>
      </Box>
    </Box>
  );
}
