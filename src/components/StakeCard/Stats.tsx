import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CARD_CONTENT, COLOR } from "@utils/theme/constants";
import { Token, TokenShortName, TokenName } from "@utils/constants";
import { formatNumber } from "@utils/number";
import { getApy } from "@utils/apy";
import { hznRateAtom } from "@atoms/exchangeRates";
import { tokenPriceAtomFamily } from "@atoms/staker/price";
import { poolStateAtomFamily } from "@atoms/staker/pool";

const ItemProps: BoxProps = {
  p: "4px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default function Stats({
  token,
  finished,
}: {
  token: TokenEnum;
  finished?: boolean;
}) {
  const hznRate = useAtomValue(hznRateAtom);
  const stakeTokenPrice = useAtomValue(tokenPriceAtomFamily(token));
  const { totalStaked, rewardsPerBlock, isRoundActive } = useAtomValue(
    poolStateAtomFamily(token)
  );

  const apy = useMemo(() => {
    if (!isRoundActive) {
      return 0;
    }

    if (token === Token.HZN) {
      return getApy(1, 1, totalStaked, rewardsPerBlock);
    }

    const hznPrice = hznRate.toNumber();
    if (token === Token.ZUSD_BUSD_LP) {
      // a zUSD/BUSD lp token price is always $2
      return getApy(2, hznPrice, totalStaked, rewardsPerBlock);
    }
    return getApy(stakeTokenPrice, hznPrice, totalStaked, rewardsPerBlock);
  }, [
    isRoundActive,
    token,
    stakeTokenPrice,
    hznRate,
    totalStaked,
    rewardsPerBlock,
  ]);

  return (
    <Box p={CARD_CONTENT.padding}>
      {!finished && (
        <Box {...ItemProps}>
          <Typography
            variant='body1'
            color={alpha(COLOR.text, 0.5)}
            fontSize={14}
          >
            APY
          </Typography>
          <Typography
            variant='body1'
            fontSize={14}
            fontWeight={700}
            fontFamily='Rawline'
            color={COLOR.safe}
          >
            {apy ? `${formatNumber(apy)} %` : "- -"}
          </Typography>
        </Box>
      )}
      {!finished && (
        <Box {...ItemProps}>
          <Typography
            variant='body1'
            color={alpha(COLOR.text, 0.5)}
            fontSize={14}
          >
            {TokenName[token]} Value
          </Typography>
          <Typography
            variant='body1'
            fontSize={14}
            fontWeight={700}
            fontFamily='Rawline'
            color={COLOR.text}
          >
            $0.01
          </Typography>
        </Box>
      )}
      <Box {...ItemProps}>
        <Typography
          variant='body1'
          color={alpha(COLOR.text, 0.5)}
          fontSize={14}
        >
          Total Staked
        </Typography>
        <Typography
          variant='body1'
          fontSize={14}
          fontFamily='Rawline'
          color={COLOR.text}
        >
          {formatNumber(totalStaked)}
          <Typography
            component='span'
            fontSize={14}
            color={alpha(COLOR.text, 0.5)}
          >
            {" "}
            {TokenShortName[token]}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
