import { Box, Grid, Hidden, useMediaQuery } from "@mui/material";
import ConnectButton from "@components/ConnectButton";
import useWallet from "@hooks/useWallet";
import NavTabs from "./NavTabs";
import WalletInfo from "./WalletInfo";
import WalletsDialog from "./WalletsDialog";
import LogoMenu from "./LogoMenu";
import HelpMenu from "./HelpMenu";
import RefreshButton from "./RefreshButton";
import { useTheme } from "@mui/material/styles";

export default function Header() {
  const { connected } = useWallet();

  const { breakpoints } = useTheme();
  const needWrap = useMediaQuery(breakpoints.down("md"));

  return (
    <>
      <Grid
        container
        alignItems='center'
        flexWrap='wrap'
        sx={{
          "&.MuiGrid-container": {
            padding: '25px 30px 0 30px',
          },
        }}
      >
        <Grid container item xs={12} md={5} lg={4}>
          <LogoMenu />
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
          {/* <DashboardLink /> */}
          <RefreshButton />
          <HelpMenu mr={1.25} />
          <Hidden smUp>
            <Box width='100%' height={8} />
          </Hidden>
          {connected ? (
            <>
              <WalletInfo />
            </>
          ) : (
            <Box sx={{width: '163px !important', height: '36px'}}>
            <ConnectButton
              sx={{
                px: 2,
                py: 0,
                height:"36px",             
                display: "flex",
                alignItems: "center",
                fontSize: 12,
                lineHeight: "22px",
              }}
            />
            </Box>
          )}
        </Grid>
      </Grid>
      <WalletsDialog />
    </>
  );
}
