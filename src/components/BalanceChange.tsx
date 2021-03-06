import { useMemo, useState } from "react";
import { Box, BoxProps, List, ListItem, ListItemIcon, useMediaQuery } from "@mui/material";
import { ellipsisWithLength, formatCRatioToPercent, formatNumber, toBN, zeroBN } from "@utils/number";
import { useTheme } from "@mui/material/styles";

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

  const { breakpoints } = useTheme();
  const downSM = useMediaQuery(breakpoints.down("md"));

  const maxValueLength = useMemo(() => {
    const debtMinimum = downSM ? 14 : 15
    const stakedMinimum = downSM ? 18 : 13
    const transferrableMinimum = downSM ? 14 : 14
    const escrowedMinimum = downSM ? 10 : 14

    const totalDebtLength = formatNumber(debt.from).length + (changed ? formatNumber(debt.to).length : 0)
    const maxDebtLength = totalDebtLength > 2 * debtMinimum ? debtMinimum : 2 * debtMinimum

    const totalStakedLength = (changed ? formatNumber(staked.from).length : 0) + formatNumber(staked.to).length
    const maxStakedLength = totalStakedLength > 2 * stakedMinimum ? stakedMinimum : 2 * stakedMinimum

    const totalTransferrableLength = formatNumber(transferrable.from).length + (changed ? formatNumber(transferrable.to).length : 0)
    const maxTransferrableLength = totalTransferrableLength > 2 * transferrableMinimum ? transferrableMinimum : 2 * transferrableMinimum

    const totalEscrowedLength = formatNumber(escrowed.from).length + (changed ? formatNumber(escrowed.to).length : 0)
    const maxEscrowedLength = totalEscrowedLength > 2 * escrowedMinimum ? escrowedMinimum : 2 * escrowedMinimum

    return {
      maxDebtLength,
      maxStakedLength,
      maxTransferrableLength,
      maxEscrowedLength
    }
  }, [debt, staked, transferrable, escrowed, downSM])

  const data = useMemo(
    () => [
      {
        label: "Current C-Ratio",
        from: `${formatCRatioToPercent(cRatio.from)} %`,
        to: Number(debt.to.toNumber().toFixed(2)) <= 0 ? '--%' : `${formatCRatioToPercent(cRatio.to)} %`,
      },
      {
        label: "Debt",
        from: `$${ellipsisWithLength(formatNumber(debt.from), maxValueLength.maxDebtLength)} zUSD`,
        to: `$${ellipsisWithLength(formatNumber(debt.to), maxValueLength.maxDebtLength)} zUSD`,
      },
      {
        label: "Staked HZN",
        from: `${ellipsisWithLength(formatNumber(staked.from), maxValueLength.maxStakedLength)} HZN`,
        to: `${ellipsisWithLength(formatNumber(staked.to), maxValueLength.maxStakedLength)} HZN`,
      },
      {
        label: "Transferrable HZN",
        from: `${ellipsisWithLength(formatNumber(transferrable.from), maxValueLength.maxTransferrableLength)} HZN`,
        to: `${ellipsisWithLength(formatNumber(transferrable.to), maxValueLength.maxTransferrableLength)} HZN`,
      },
      {
        label: "Escrowed HZN",
        from: `${ellipsisWithLength(formatNumber(escrowed.from), maxValueLength.maxEscrowedLength)} HZN`,
        to: `${ellipsisWithLength(formatNumber(escrowed.to), maxValueLength.maxEscrowedLength)} HZN`,
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
              display: 'flex',
              justifyContent: 'space-between',
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
                fontSize: {
                  xs: 12,
                  md: 14
                },
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
              justifyContent='flex-end'
            >
              <Box component='span' fontSize={{
                xs: 12,
                md: 14
              }} color='rgba(180, 224, 255, 0.5)' lineHeight='16px'>
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
                  <Box component='span' fontSize={{
                    xs: 12,
                    md: 14
                  }} color='rgba(180, 224, 255, 1)' lineHeight='16px'>
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
