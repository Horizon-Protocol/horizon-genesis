import { BORDER_COLOR } from "@utils/theme/constants";
import { Box, BoxProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Header from "./Header";

declare global {
  interface CardProps {
    color?: string;
    title?: string;
    description?: string | JSX.Element;
    headerBg?: string;
  }
}

const useStyles = makeStyles(({ breakpoints }) => ({
  container: {
    overflow: "hidden",
    backgroundColor: "rgba(16,38,55,0.3)",
  },
  headerWrap: {
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#0C111D",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 180px",
    backgroundPosition: "top -18px left -18px",
    // backgroundImage: ({ bg }: { bg?: string }) => `url(${bg})`,
  },
  headerBg: {
    opacity: 0.1,
    position: "absolute",
    left: -8,
    top: -8,
    height: "100%",
  },
  contentWrap: {
    padding: "24px 56px 32px",
    [breakpoints.down("xs")]: {
      padding: "24px 12px 32px",
    },
  },
}));

export default function PageCard({
  color,
  headerBg,
  title,
  description,
  className,
  children,
  ...props
}: BoxProps & CardProps) {
  const classes = useStyles({ bg: headerBg });

  return (
    <Box
      width='100%'
      maxWidth={640}
      border={1}
      borderRadius={10}
      borderColor={BORDER_COLOR}
      className={clsx(classes.container, className)}
      {...props}
    >
      <Box
        display='flex'
        justifyContent='center'
        className={classes.headerWrap}
      >
        <img src={headerBg} alt='' className={classes.headerBg} />
        <Header
          color={color}
          title={title}
          description={description}
          maxWidth={420}
          py={3}
        />
      </Box>
      <Box
        py={3}
        display='flex'
        justifyContent='center'
        alignItems='stretch'
        flexDirection='column'
        className={classes.contentWrap}
      >
        {children}
      </Box>
    </Box>
  );
}
