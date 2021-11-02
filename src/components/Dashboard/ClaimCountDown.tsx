import { Box, BoxProps, Typography } from "@mui/material";
import { useAtomValue } from "jotai/utils";
import { nextClaimCountDownAtom } from "@atoms/feePool";
import useNextClaimCountDown from "@hooks/useNextClaimTimer";
import { COLOR } from "@utils/theme/constants";

export default function ClaimCountDown(props: BoxProps) {
  useNextClaimCountDown();

  const nextClaimCountDown = useAtomValue(nextClaimCountDownAtom);

  return (
    <Box textAlign='center' {...props}>
      <Typography
        variant='caption'
        fontWeight={700}
        letterSpacing='0.43px'
        color='#62B5DB'
      >
        NEXT REWARD CLAIM
      </Typography>
      <Typography
        variant='h5'
        mt={1}
        color={COLOR.text}
        fontFamily='Rawline'
        fontSize='24px'
        fontWeight={700}
        letterSpacing='0.86px'
        lineHeight='28px'
      >
        {nextClaimCountDown}
      </Typography>
    </Box>
  );
}
