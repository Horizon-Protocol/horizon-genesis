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
        flexWrap='wrap'
        sx={{
          "&.MuiGrid-container": {
            padding: 2, // 16px
            borderBottom: "1px solid #11263B",
          },
        }}
      >
        <Grid container item xs={12} md={5} lg={4}>
          <Box
            component='img'
            src={logo}
            alt='Horizon Genesis'
            m={{
              xs: "auto",
              md: "initial",
            }}
            height={40}
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={12}
          lg={4}
          sx={{
            justifyContent: "center",
            height: 40,
            order: {
              xs: 3,
              lg: 2,
            },
          }}
        >
          <NavTabs />
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={7}
          lg={4}
          sx={{
            m: {
              xs: "8px 0",
              lg: "initial",
            },
            minHeight: 40,
            order: {
              xs: 2,
              lg: 3,
            },
            alignItems: "center",
            justifyContent: {
              xs: "center",
              md: "flex-end",
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
            <ConnectButton
              sx={{
                px: 2,
                py: 0,
                height: 32,
                display: "flex",
                alignItems: "center",
                fontSize: 12,
                lineHeight: "22px",
              }}
            />
          )}
        </Grid>
      </Grid>
      <WalletsDialog />
    </>
  );
}
