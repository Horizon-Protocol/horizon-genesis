import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import logo from "@assets/tokens/hzn.png";

const useStyles = makeStyles(({ breakpoints, palette }) => ({
  root: {
    minWidth: 132,
    height: 32,
    marginRight: 10,
    // paddingRight: 8,
    fontSize: 13,
    color: palette.text.primary,
    borderRadius: 4,
    backgroundColor: "#091620",
    border: "1px solid rgba(55,133,185,0.25)",
    [breakpoints.down("xs")]: {
      marginRight: 0,
    },
  },
  startIcon: {
    height: 16,
    width: 16,
  },
  new: {
    position: "absolute",
    top: -10,
    right: 0,
    fontSize: 12,
    fontWeight: "bold",
    transform: "scale(0.8)",
    color: "#FCB000",
  },
}));

export default function DashboardLink() {
  const classes = useStyles();
  return (
    <Button
      variant='outlined'
      startIcon={<img src={logo} alt='' />}
      href='https://dashboard.horizonprotocol.com'
      target='_blank'
      classes={classes}
    >
      Dashboard
      <span className={classes.new}>NEW!</span>
    </Button>
  );
}
