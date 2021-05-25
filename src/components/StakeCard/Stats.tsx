import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAtomValue } from "jotai/utils";
import { CARD_CONTENT } from "@utils/theme/constants";
import { Token, TokenShortName } from "@utils/constants";
import { formatBalance, formatNumber } from "@utils/formatters";
import { getApy } from "@utils/apy";
import { tokenStatAtomFamily } from "@atoms/staker/stat";
import { useMemo } from "react";
import { tokenPriceAtomFamily } from "@atoms/price";

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
  },
  total: {
    fontSize: 14,
  },
});

export default function Stats({ token }: { token: TokenEnum }) {
  const classes = useStyles();

  const hznPrice = useAtomValue(tokenPriceAtomFamily(Token.HZN));
  const stakeTokenPrice = useAtomValue(tokenPriceAtomFamily(token));
  const { total, rewardsPerBlock, isRoundActive } = useAtomValue(
    tokenStatAtomFamily(token)
  );

  const apy = useMemo(() => {
    if (!isRoundActive) {
      return 0;
    }

    if (token === Token.HZN) {
      return getApy(1, 1, total, rewardsPerBlock);
    }

    return getApy(stakeTokenPrice, hznPrice, total, rewardsPerBlock);
  }, [isRoundActive, token, stakeTokenPrice, hznPrice, total, rewardsPerBlock]);

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
          {`${formatBalance(total)} ${TokenShortName[token]}`}
        </Typography>
      </div>
    </Box>
  );
}