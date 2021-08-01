import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CARD_CONTENT } from "@utils/theme/constants";
import { Token, TokenShortName } from "@utils/constants";
import { formatNumber } from "@utils/number";
import { getApy } from "@utils/apy";
import { hznRateAtom } from "@atoms/exchangeRates";
import { tokenPriceAtomFamily } from "@atoms/staker/price";
import { poolStateAtomFamily } from "@atoms/staker/pool";

const useStyles = makeStyles({
  root: {
    padding: CARD_CONTENT.padding,
  },
  item: {
    padding: "4px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
  },
  apy: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "Rawline",
  },
  total: {
    fontSize: 14,
    fontFamily: "Rawline",
  },
});

export default function Stats({ token }: { token: TokenEnum }) {
  const classes = useStyles();

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
    <Box className={classes.root}>
      <div className={classes.item}>
        <Typography
          variant='body1'
          color='primary'
          classes={{ root: classes.label }}
        >
          APY
        </Typography>
        <Typography variant='body1' classes={{ root: classes.apy }}>
          {apy ? `${formatNumber(apy)} %` : "- -"}
        </Typography>
      </div>
      <div className={classes.item}>
        <Typography
          variant='body1'
          color='primary'
          classes={{ root: classes.label }}
        >
          Total Staked
        </Typography>
        <Typography variant='body1' classes={{ root: classes.total }}>
          {`${formatNumber(totalStaked)} ${TokenShortName[token]}`}
        </Typography>
      </div>
    </Box>
  );
}
