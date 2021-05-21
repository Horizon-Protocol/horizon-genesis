import { Button, ButtonProps, Link } from "@material-ui/core";
import { CallMade } from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const StyledLink = withStyles(({ palette }) => ({
  root: {
    display: "block",
    width: "100%",
  },
}))(Link);

const StyledButton = withStyles(({ palette }) => ({
  root: {
    color: palette.primary.main,
    height: 32,
    borderRadius: "16px",
    backgroundColor: palette.secondary.main,
    boxShadow: "none",
  },
}))(Button);

const useStyles = makeStyles(() => ({
  logo: {
    flex: 0,
    height: 18,
  },
  text: {
    flex: 1,
    padding: "0 10px",
    textAlign: "left",
  },
  endIcon: {
    flex: "0 0 18px",
    color: "#FFF",
  },
}));

interface Props extends ButtonProps {
  href?: string;
  logo?: string;
}

export default function ExternalLink({
  href = "/",
  logo,
  children,
  ...props
}: Props) {
  const classes = useStyles();

  return (
    <StyledLink href={href} target='_blank' color='primary' underline='none'>
      <StyledButton
        variant='contained'
        color='secondary'
        fullWidth
        size='small'
        {...props}
      >
        {logo ? <img src={logo} alt='logo' className={classes.logo} /> : null}
        <span className={classes.text}>{children}</span>
        <CallMade className={classes.endIcon} />
      </StyledButton>
    </StyledLink>
  );
}
