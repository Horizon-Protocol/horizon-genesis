import { useAtomValue } from "jotai/utils";
import { Avatar, Chip, ChipProps, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { detailAtom } from "@atoms/wallet";
import { loadingAllAtom } from "@atoms/staker/loading";
import useFetchState from "@hooks/staker/useFetchState";
import { ChainName } from "@utils/constants";

const StyledChip = withStyles(({ palette }) => ({
  root: {
    marginRight: 10,
    paddingLeft: 8,
    paddingRight: 8,
    color: palette.text.primary,
    textTransform: "none",
    borderRadius: 4,
    backgroundColor: "#091620",
    border: "1px solid rgba(55,133,185,0.25)",
  },
}))(Chip);

const StyledAvatar = withStyles(({ palette }) => ({
  img: {
    width: 18,
    height: 18,
    objectFit: "contain",
  },
}))(Avatar);

export default function WalletIndicator(props: ChipProps) {
  const wallet = useAtomValue(detailAtom);
  const loading = useAtomValue(loadingAllAtom);
  const refresh = useFetchState();

  if (!wallet) {
    return null;
  }

  return (
    // <Tooltip title='refresh' placement='top'>
    <StyledChip
      variant='outlined'
      avatar={
        loading ? (
          <CircularProgress color='primary' size={20} />
        ) : (
          <StyledAvatar
            variant='circular'
            src={wallet.logo}
            alt={wallet.label}
          />
        )
      }
      label={ChainName}
      onClick={refresh}
      {...props}
    />
    // </Tooltip>
  );
}
