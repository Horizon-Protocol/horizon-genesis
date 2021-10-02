import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface Props extends ButtonProps {
  loading?: boolean;
}

export default function PrimaryButton({
  loading = false,
  disabled,
  children,
  ...props
}: Props) {
  return (
    <Button
      disabled={loading || disabled}
      sx={{
        flex: "0 0 120px",
        fontWeight: 700,
        color: "text.primary",
        borderRadius: 1.5,
        background: "linear-gradient(180deg, #64B7DC 0%, #3785B9 100%)",
        boxShadow: "0 4px 12px 0 #050C11",
        letterSpacing: "0.88px",
        ":hover": {
          background: "linear-gradient(180deg, #477e97 0%, #25597c 100%)",
        },
        ":disabled": {
          color: "rgba(251, 251, 251, 0.2)",
          background: "rgba(52,129,183,0.1)",
          boxShadow: "none",
        },
      }}
      {...props}
    >
      {loading ? <CircularProgress size={24} thickness={2} /> : children}
    </Button>
  );
}
