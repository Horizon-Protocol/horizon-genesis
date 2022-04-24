import { useMemo } from "react";
import { Box, BoxProps, List, ListItem, ListItemIcon } from "@mui/material";
import { formatCRatioToPercent, formatNumber } from "@utils/number";

export interface Props {
  changed: boolean;
  cRatio: {
    from: BN;
    to: BN;
  };
  debt: {
    from: BN;
    to: BN;
  };
  staked: {
    from: BN;
    to: BN;
  };
  transferrable: {
    from: BN;
    to: BN;
  };
  escrowed: {
    from: BN;
    to: BN;
  };
  gapImg?: string;
}

export default function BalanceChange({
  changed = false,
  cRatio,
  debt,
  staked,
  transferrable,
  escrowed,
  gapImg,
  ...props
}: Props & BoxProps) {
  const data = useMemo(
    () => [
      {
        label: "Current C-Ratio",
        from: `${formatCRatioToPercent(cRatio.from)} %`,
        to: `${formatCRatioToPercent(cRatio.to)} %`,
      },
      {
        label: "Debt",
        from: `$${formatNumber(debt.from)} zUSD`,
        to: `$${formatNumber(debt.to)} zUSD`,
      },
      {
        label: "Staked HZN",
        from: `${formatNumber(staked.from)} HZN`,
        to: `${formatNumber(staked.to)} HZN`,
      },
      {
        label: "Transferrable HZN",
        from: `${formatNumber(transferrable.from)} HZN`,
        to: `${formatNumber(transferrable.to)} HZN`,
      },
      {
        label: "Escrowed HZN",
        from: `${formatNumber(escrowed.from)} HZN`,
        to: `${formatNumber(escrowed.to)} HZN`,
      },
    ],
    [cRatio, debt, staked, transferrable]
  );

  return (
    <Box
      pt={2.5}
      pb={1.25}
      px={{
        xs: 1,
        sm: 3.75,
      }}
      bgcolor='rgba(8, 12, 22, 0.3)'
      borderRadius={'4px'}
      {...props}
    >
      <List dense disablePadding>
        {data.map(({ label, from, to }) => (
          <ListItem
            key={label}
            disableGutters
            sx={{
              p: "0 0 10px 0",
              flexWrap: {
                xs: "wrap",
                sm: "nowrap",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "rgba(180, 224, 255, 0.5)",
                fontSize: 14,
                lineHeight: "16px",
                mb: {
                  xs: 1,
                  sm: 0,
                },
              }}
            >
              {label}
            </ListItemIcon>
            <Box
              mb={{
                xs: 1,
                sm: 0,
              }}
              display='flex'
              width='100%'
              justifyContent='flex-end'
            >
              <Box component='span' fontSize={14} color='rgba(180, 224, 255, 0.5)' lineHeight='16px'>
                {from}
              </Box>
              {changed && (
                <>
                  <Box
                    component='span'
                    display='inline-block'
                    width={36}
                    sx={{
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "60%",
                      backgroundImage: gapImg && `url(${gapImg})`,
                      transform: "rotateZ(180deg)",
                    }}
                  >
                    {gapImg ? "" : "=>"}
                  </Box>
                  <Box component='span' fontSize={14} color='rgba(180, 224, 255, 1)' lineHeight='16px'>
                    {to}
                  </Box>
                </>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
