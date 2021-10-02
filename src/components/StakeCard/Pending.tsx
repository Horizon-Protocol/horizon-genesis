import { Box, Backdrop, Typography, BackdropProps } from "@mui/material";

export default function Pending({
  children,
  ...props
}: Omit<BackdropProps, "open">) {
  return (
    <Backdrop
      open
      sx={{
        position: "absolute",
        zIndex: 1,
        fontSize: 22,
        textAlign: "center",
        bgcolor: "rgba(0, 0, 0, 0.85)",
      }}
      {...props}
    >
      <Box>
        <Typography variant='h6' display='block'>
          This pool will go live after <br />
          the Pancakeswap v2 <br />
          Migration
        </Typography>
      </Box>
    </Backdrop>
  );
}
