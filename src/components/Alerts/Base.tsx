import { ReactNode } from "react";
import clsx from "clsx";
import { Box, BoxProps, Typography } from "@material-ui/core";
import { ErrorOutline } from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { COLOR } from "@utils/theme/constants";

const useStyles = makeStyles(({ palette }) => ({
  container: {
    borderRadius: 4,
    borderTop: ({ color = COLOR.tip }: { color?: string }) =>
      `2px solid ${color}`,
    backgroundColor: "#102637",
    color: ({ color = COLOR.tip }: { color?: string }) => color,
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.43px",
    lineHeight: "18px",
    textTransform: "uppercase",
  },
  content: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: "18px",
    color: palette.text.secondary,
  },
  actions: {
    "& > *": {
      marginLeft: 16,
    },
    "& > *:first-child": {
      marginLeft: 0,
    },
  },
}));

const AlertIcon = withStyles({
  root: {
    fontSize: 18,
  },
})(ErrorOutline);

export interface AlertProps extends Omit<BoxProps, "title"> {
  color?: string;
  title: ReactNode;
  content: ReactNode;
  children?: ReactNode;
}

export default function BaseAlert({
  color,
  title,
  content,
  children,
  className,
  ...props
}: AlertProps) {
  const classes = useStyles({ color });

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
        <Box mt={1} display='flex' className={classes.actions}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
