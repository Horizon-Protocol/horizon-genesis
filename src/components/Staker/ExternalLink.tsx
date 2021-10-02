import { Box, Button, ButtonProps, Link } from "@mui/material";
import { CallMade } from "@mui/icons-material";

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
  return (
    <Link
      href={href}
      target='_blank'
      color='primary'
      underline='none'
      sx={{
        display: "block",
        width: "100%",
      }}
    >
      <Button
        variant='contained'
        color='secondary'
        fullWidth
        size='small'
        sx={{
          color: "primary.main",
          height: 32,
          borderRadius: 4,
          bgcolor: "secondary.main",
          boxShadow: "none",
        }}
        {...props}
      >
        {logo ? (
          <Box component='img' src={logo} alt='logo' flex='0' height={18} />
        ) : null}
        <Box component='span' flex={1} px='10px' textAlign='left'>
          {children}
        </Box>
        <CallMade
          sx={{
            flex: "0 0 18px",
            color: "#FFF",
          }}
        />
      </Button>
    </Link>
  );
}
