import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { COLOR } from "@utils/theme/constants";

interface Props extends ButtonProps {
  loading?: boolean;
  bgColor?: string;
}

export default function PrimaryButton({
  loading = false,
  disabled,
  children,
  sx,
  bgColor = COLOR.safe,
  ...props
}: Props) {
  return (
    <Button
      disabled={loading || disabled}
      sx={{
        px: 2.75,
        py: 1.25,
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "#1E1F25",
        borderRadius: 1,
        background: bgColor,
        boxShadow: "none",
        letterSpacing: "2px",
        whiteSpace: "nowrap",
        alignItems: "center",
        ":hover": {
          background: alpha(bgColor, 0.8),
          color: "#1E1F25",
        },
        ":disabled": {
          background: alpha(bgColor, 0.2),
          boxShadow: "none",
          color: "#1E1F25",
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={24} thickness={2} /> : children}
    </Button>
  );
}
