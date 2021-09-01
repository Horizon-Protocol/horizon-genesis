import { useMemo } from "react";
import { Box, BoxProps, List, ListItem, ListItemIcon } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { formatCRatioToPercent, formatNumber } from "@utils/number";

const Label = withStyles(({ breakpoints }) => ({
  root: {
    color: "#5897C1",
    fontSize: 14,
    [breakpoints.down("xs")]: {
      marginBottom: 8,
    },
  },
}))(ListItemIcon);

interface StyleProps {
  changed?: boolean;
  gapImg?: string;
}
const useStyles = makeStyles(({ breakpoints }) => ({
  container: {
    padding: "16px 24px",
    background: "#091320",
    [breakpoints.down("xs")]: {
      padding: "16px 8px",
    },
  },
  listItem: {
    padding: "6px 0",
    [breakpoints.down("xs")]: {
      flexWrap: "wrap",
    },
  },
  content: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    [breakpoints.down("xs")]: {
      marginBottom: 8,
      // justifyContent: "flex-start",
    },
  },
  value: {
    fontSize: 14,
    color: "#88ABC3",
  },
  gap: {
    display: "inline-block",
    width: 48,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "60%",
    backgroundImage: ({ gapImg }: StyleProps) => gapImg && `url(${gapImg})`,
    transform: "rotateZ(180deg)",
  },
}));

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
  gapImg?: string;
}

export default function BalanceChange({
  changed = false,
  cRatio,
  debt,
  staked,
  transferrable,
  gapImg,
  className,
  ...props
}: Props & BoxProps) {
  const classes = useStyles({ gapImg, changed });

  const data = useMemo(
    () => [
      {
        label: "C-Ratio",
        from: `${formatCRatioToPercent(cRatio.from)} %`,
        to: `${formatCRatioToPercent(cRatio.to)} %`,
      },
      {
        label: "Debt",
        from: `$${formatNumber(debt.from)} zUSD`,
        to: `$${formatNumber(debt.to)} zUSD`,
      },
      {
        label: "Staked",
        from: `${formatNumber(staked.from)} HZN`,
        to: `${formatNumber(staked.to)} HZN`,
      },
      {
        label: "Transferrable",
        from: `${formatNumber(transferrable.from)} HZN`,
        to: `${formatNumber(transferrable.to)} HZN`,
      },
    ],
    [cRatio, debt, staked, transferrable]
  );

  return (
    <Box {...props} className={clsx(classes.container, className)}>
      <List dense disablePadding>
        {data.map(({ label, from, to }) => (
          <ListItem
            key={label}
            disableGutters
            classes={{ root: classes.listItem }}
          >
            <Label>{label}</Label>
            <Box className={classes.content}>
              <span className={classes.value}>{from}</span>
              {changed && (
                <>
                  <span className={classes.gap}>{gapImg ? "" : "=>"}</span>
                  <span className={classes.value}>{to}</span>
                </>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
