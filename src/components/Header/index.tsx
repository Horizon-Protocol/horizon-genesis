import { Grid, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ConnectButton from "@components/ConnectButton";
import logo from "@assets/logo.png";
import useWallet from "@hooks/useWallet";
import NavTabs from "./NavTabs";
import WalletInfo from "./WalletInfo";
import WalletIndicator from "./WalletIndicator";

const useStyles = makeStyles({
  container: {
    padding: 16,
    borderBottom: "1px solid #11263B",
  },
  logo: {
    height: 40,
  },
  connect: {
    fontSize: 14,
    paddingLeft: 18,
    paddingRight: 18,
  },
  walletInfo: {},
  walletIndicator: {},
});

export default function Header() {
  const classes = useStyles();
  const { connected } = useWallet();

  return (
    <Grid container classes={{ container: classes.container }}>
      <Grid container item xs={6} sm>
        <img src={logo} alt='Horizon Mintr' className={classes.logo} />
      </Grid>
      <Grid container item xs={12} sm={6} justify='center'>
        <NavTabs />
      </Grid>
      <Hidden smDown>
        <Grid container item xs={6} sm justify='flex-end'>
          {connected ? (
            <>
              <WalletInfo className={classes.walletInfo} />
              <WalletIndicator classes={{ root: classes.walletIndicator }} />
            </>
          ) : (
            <ConnectButton classes={{ root: classes.connect }} />
          )}
        </Grid>
      </Hidden>
    </Grid>
  );
}
