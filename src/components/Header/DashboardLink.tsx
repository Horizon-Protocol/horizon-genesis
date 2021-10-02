import { Box, Button } from "@mui/material";
import logo from "@assets/tokens/hzn.png";

export default function DashboardLink() {
  return (
    <Button
      variant='outlined'
      startIcon={<img src={logo} alt='' />}
      href='https://dashboard.horizonprotocol.com'
      target='_blank'
      sx={{
        minWidth: 132,
        height: 32,
        mr: {
          xs: 0,
          sm: "10px",
        },
        // paddingRight: 8,
        bgcolor: "#091620",
        fontSize: 13,
        color: "text.primary",
        borderRadius: 1, // 4pxs
        border: "1px solid rgba(55,133,185,0.25)",
        ".MuiButton-startIcon": {
          height: 16,
          width: 16,
        },
      }}
    >
      Dashboard
      <Box
        component='span'
        position='absolute'
        top={-10}
        right={0}
        fontSize={12}
        fontWeight='bold'
        color='#FCB000'
        sx={{ transform: "scale(0.8)" }}
      >
        NEW!
      </Box>
    </Button>
  );
}
