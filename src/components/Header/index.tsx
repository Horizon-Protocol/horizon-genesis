import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ConnectButton from "@components/ConnectButton";
import logo from "@assets/logo.png";
import useWallet from "@hooks/useWallet";
import NavTabs from "./NavTabs";
import WalletInfo from "./WalletInfo";
import WalletsDialog from "./WalletsDialog";

const useStyles = makeStyles(({ breakpoints }) => ({
  container: {
    padding: 16,
    borderBottom: "1px solid #11263B",
  },
  logo: {
    height: 40,
    [breakpoints.down("xs")]: {
      margin: "auto",
    },
  },
  nav: {
    height: 40,
    [breakpoints.between("sm", "md")]: {},
    [breakpoints.down("sm")]: {
      order: 3,
    },
  },
  wallet: {
    height: 40,
    order: 2,
    [breakpoints.down("sm")]: {
      order: 2,
      margin: "8px 0",
    },
    [breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  connect: {
    fontSize: 14,
    paddingLeft: 18,
    paddingRight: 18,
  },
}));

export default function Header() {
  const classes = useStyles();
  const { connected } = useWallet();

  return (
    <>
      <Grid
        container
        alignItems='center'
        classes={{ container: classes.container }}
      >
        <Grid container item xs={12} sm={6} md={2}>
          <img src={logo} alt='Horizon Mintr' className={classes.logo} />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={8}
          justify='center'
          className={classes.nav}
        >
          <NavTabs />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={6}
          md={2}
          justify='flex-end'
          className={classes.wallet}
        >
          {connected ? (
            <>
              <WalletInfo />
            </>
          ) : (
            <ConnectButton rounded classes={{ root: classes.connect }} />
          )}
        </Grid>
      </Grid>
      <WalletsDialog />
    </>
  );
}
