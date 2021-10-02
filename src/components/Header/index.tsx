import { Box, Grid, Hidden } from "@mui/material";
import ConnectButton from "@components/ConnectButton";
import logo from "@assets/logo.png";
import useWallet from "@hooks/useWallet";
import NavTabs from "./NavTabs";
import WalletInfo from "./WalletInfo";
import WalletsDialog from "./WalletsDialog";
import DashboardLink from "./DashboardLink";

export default function Header() {
  const { connected } = useWallet();

  return (
    <>
      <Grid
        container
        alignItems='center'
        sx={{
          "&.MuiGrid-container": {
            padding: 2, // 16px
            borderBottom: "1px solid #11263B",
          },
        }}
      >
        <Grid container item xs={12} sm={5} md={3} lg={5}>
          <Box
            component='img'
            src={logo}
            alt='Horizon Mintr'
            m={{
              xs: "auto",
              sm: "initial",
            }}
            height={40}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={4}
          lg={2}
          sx={{
            justifyContent: "center",
            height: 40,
            order: {
              xs: 3,
              md: "initial",
            },
          }}
        >
          <NavTabs />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={7}
          md={5}
          lg={5}
          sx={{
            m: {
              xs: "8px 0",
              md: "initial",
            },
            minHeight: 40,
            order: {
              xs: 2,
              md: "initial",
            },
            alignItems: "center",
            justifyContent: {
              xs: "center",
              sm: "flex-end",
            },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <DashboardLink />
          <Hidden smUp>
            <Box width='100%' height={8} />
          </Hidden>
          {connected ? (
            <>
              <WalletInfo />
            </>
          ) : (
            <ConnectButton rounded sx={{ fontSize: 14, px: "18px" }} />
          )}
        </Grid>
      </Grid>
      <WalletsDialog />
    </>
  );
}
