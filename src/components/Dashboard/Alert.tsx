import { Box, BoxProps, Typography, Link } from "@material-ui/core";
import { ErrorOutline, ArrowRightAlt } from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useMemo } from "react";
import { COLOR } from "@utils/theme/constants";

const useStyles = makeStyles(({ palette }) => ({
  container: {
    borderRadius: 4,
    borderTop: `2px solid ${COLOR.tip}`,
    backgroundColor: "rgba(16, 38, 55, 0.5)",
    color: ({ color }: { color?: string }) => color,
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.43px",
    lineHeight: "18px",
  },
  content: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: "18px",
    color: palette.text.secondary,
  },
  actions: {},
}));

const path = "/";

const AlertIcon = withStyles({
  root: {
    fontSize: 18,
  },
})(ErrorOutline);

const ArrowIcon = withStyles({
  root: {
    fontSize: 16,
    fontWeight: 700,
    color: COLOR.safe,
  },
})(ArrowRightAlt);

const ActionLink = withStyles({
  root: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 10,
    fontWeight: 700,
    color: COLOR.safe,
    cursor: "pointer",
  },
})(Link);

export default function Alert({ className, ...props }: BoxProps & {}) {
  const classes = useStyles({ color: COLOR.tip });

  const { title, content, actions } = useMemo(() => {
    return {
      title: "Tip",
      content: <>Sttake your HZN to start earning yield!</>,
      actions: (
        <ActionLink>
          Stake Now <ArrowIcon />
        </ActionLink>
      ),
    };
  }, []);

  return (
    <Box
      display='flex'
      className={clsx(className, classes.container)}
      {...props}
    >
      <Box mr={1}>
        <AlertIcon color='inherit' />
      </Box>
      <Box>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.content}>{content}</Typography>
        <Typography className={classes.actions}>{actions}</Typography>
      </Box>
    </Box>
  );
}
