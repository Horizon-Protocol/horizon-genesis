import { BigNumber } from "@ethersproject/bignumber";
import { Box, BoxProps, List, ListItem, ListItemIcon } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core";
import { formatBalance } from "@utils/formatters";
import clsx from "clsx";
import { useMemo } from "react";

const Label = withStyles({
  root: {
    color: "#5897C1",
    fontSize: 14,
  },
})(ListItemIcon);

const useStyles = makeStyles({
  container: {
    padding: "16px 24px",
    background: "#091320",
  },
  listItem: {
    padding: "6px 0",
  },
  value: {
    fontSize: 14,
    color: "#88ABC3",
  },
  gap: {
    display: "inline-block",
    width: 50,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "60%",
    backgroundImage: ({ gapImg }: { gapImg?: string }) =>
      gapImg && `url(${gapImg})`,
  },
});

export interface Props {
  cRatio: {
    from: number;
    to: number;
  };
  debt: {
    from: BigNumber;
    to: BigNumber;
  };
  staked: {
    from: BigNumber;
    to: BigNumber;
  };
  transferrable: {
    from: BigNumber;
    to: BigNumber;
  };
  gapImg?: string;
}

export default function BalanceChange({
  cRatio,
  debt,
  staked,
  transferrable,
  gapImg,
  className,
  ...props
}: Props & BoxProps) {
  const classes = useStyles({ gapImg });

  const data = useMemo(
    () => [
      {
        label: "C-Ratio",
        from: `${cRatio.from} %`,
        to: `${cRatio.to} %`,
      },
      {
        label: "Debt",
        from: `$${formatBalance(debt.from)} zUSD`,
        to: `$${formatBalance(debt.to)} zUSD`,
      },
      {
        label: "Staked",
        from: `${formatBalance(staked.from)} HZN`,
        to: `${formatBalance(staked.to)} HZN`,
      },
      {
        label: "Transferrable",
        from: `${formatBalance(transferrable.from)} HZN`,
        to: `${formatBalance(transferrable.to)} HZN`,
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
            <Box display='flex' width='100%' justifyContent='flex-end'>
              <span className={classes.value}>{from}</span>
              <span className={classes.gap}>{gapImg ? "" : "=>"}</span>
              <span className={classes.value}>{to}</span>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
