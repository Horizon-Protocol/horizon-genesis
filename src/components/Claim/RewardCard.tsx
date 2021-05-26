import { Box, BoxProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TokenLogo from "@components/TokenLogo";
import { COLOR, BORDER_COLOR } from "@utils/theme/constants";
import { formatNumber } from "@utils/number";

interface Props {
  label: string;
  amount: BN;
  disabled?: boolean;
  help?: string | JSX.Element;
}

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0C111D",
  },
  wrap: {
    opacity: ({ disabled }: { disabled?: boolean }) => (disabled ? 0.5 : 1),
  },
  label: {
    margin: "8px 0",
    color: "#88ABC3",
    fontSize: 12,
    letterSpacing: "0.43px",
    lineHeight: "14px",
  },
  amount: {
    fontFamily: "Rawline",
    color: "#B4E0FF",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "0.86px",
    lineHeight: "28px",
  },
  help: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 14,
    color: COLOR.safe,
    fontSize: 10,
    fontWeight: 300,
    letterSpacing: "0.36px",
    lineHeight: "14px",
    textAlign: "center",
    whiteSpace: "pre-line",
  },
});

export default function RewardCard({
  label = "reward",
  amount,
  disabled,
  help,
  className,
  ...props
}: Props & BoxProps) {
  const classes = useStyles({ disabled });

  return (
    <Box
      width={225}
      height={244}
      position='relative'
      className={clsx(classes.root, className)}
      {...props}
    >
      <Box
        height='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        borderColor={BORDER_COLOR}
        className={classes.wrap}
      >
        <TokenLogo />
        <span className={classes.label}>{label}</span>
        <span className={classes.amount}>{formatNumber(amount)} HZN</span>
      </Box>
      {help ? (
        <Box position='absolute' className={classes.help}>
          {help}
        </Box>
      ) : null}
    </Box>
  );
}
