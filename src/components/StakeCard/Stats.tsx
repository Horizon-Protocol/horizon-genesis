import { useMemo } from "react";
import { useAtomValue } from "jotai/utils";
import { Box, BoxProps, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CARD_CONTENT, COLOR } from "@utils/theme/constants";
import { TokenShortName, TokenName } from "@utils/constants";
import { formatNumber } from "@utils/number";
import { formatPrice } from "@utils/formatters";
import { farmInfoFamilyAtom } from "@atoms/staker/farm";

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
  const farmInfo = useAtomValue(farmInfoFamilyAtom(token));

  const priceUSD = useMemo(
    () => formatPrice(farmInfo.price, { mantissa: 4 }),
    [farmInfo.price]
  );

  return (
    <Box p={CARD_CONTENT.padding}>
      {!finished && (
        <Box {...ItemProps}>
          <Typography
            variant="body1"
            color={alpha(COLOR.text, 0.5)}
            fontSize={14}
          >
            APY
          </Typography>
          <Typography
            variant="body1"
            fontSize={14}
            fontWeight={700}
            fontFamily="Rawline"
            color={COLOR.safe}
          >
            {farmInfo.apy ? `${formatNumber(farmInfo.apy)} %` : "- -"}
          </Typography>
        </Box>
      )}
      {!finished && (
        <Box {...ItemProps}>
          <Typography
            variant="body1"
            color={alpha(COLOR.text, 0.5)}
            fontSize={14}
          >
            {TokenName[token]} Value
          </Typography>
          <Typography
            variant="body1"
            fontSize={14}
            fontFamily="Rawline"
            color={COLOR.text}
          >
            ${priceUSD}
          </Typography>
        </Box>
      )}
      <Box {...ItemProps}>
        <Typography
          variant="body1"
          color={alpha(COLOR.text, 0.5)}
          fontSize={14}
        >
          Total Staked
        </Typography>
        <Typography
          variant="body1"
          fontSize={14}
          fontFamily="Rawline"
          color={COLOR.text}
        >
          {formatNumber(farmInfo.totalStaked)}
          <Typography
            component="span"
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
