import { useUpdateAtom } from "jotai/utils";
import { Button, ButtonProps } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { openAtom } from "@atoms/wallet";

interface Props extends ButtonProps {
  rounded?: boolean;
}

const StyledButton = withStyles(({ palette }) => ({
  root: {
    fontWeight: 700,
    borderRadius: 4,
    color: palette.text.primary,
  },
}))(Button);

const useStyles = makeStyles({
  rounded: {
    borderRadius: 6,
    background: "linear-gradient(180deg, #64B7DC 0%, #3785B9 100%)",
    boxShadow: "0 4px 12px 0 #050C11",
    "&:hover": {
      background: "linear-gradient(180deg, #477e97 0%, #25597c 100%)",
    },
  },
});

const isAvailable = true;

export default function ConnectButton({ rounded, ...props }: Props) {
  const classes = useStyles();

  const setOpen = useUpdateAtom(openAtom);

  return (
    <StyledButton
      variant='contained'
      color='primary'
      size='small'
      onClick={() => setOpen(true)}
      disabled={!isAvailable}
      {...props}
      className={rounded ? classes.rounded : ""}
    >
      {isAvailable ? "Connect Wallet" : "Available Soon"}
    </StyledButton>
  );
}
