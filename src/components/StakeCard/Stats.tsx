import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps, Typography } from "@mui/material";
import { CARD_CONTENT } from "@utils/theme/constants";
import { Token, TokenShortName } from "@utils/constants";
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

export default function Stats({ token }: { token: TokenEnum }) {
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
      <Box {...ItemProps}>
        <Typography variant='body1' color='primary' fontSize={14}>
          APY
        </Typography>
        <Typography
          variant='body1'
          fontSize={14}
          fontWeight={700}
          fontFamily='Rawline'
        >
          {apy ? `${formatNumber(apy)} %` : "- -"}
        </Typography>
      </Box>
      <Box {...ItemProps}>
        <Typography variant='body1' color='primary' fontSize={14}>
          Total Staked
        </Typography>
        <Typography variant='body1' fontSize={14} fontFamily='Rawline'>
          {`${formatNumber(totalStaked)} ${TokenShortName[token]}`}
        </Typography>
      </Box>
    </Box>
  );
}
