import { useAtomValue } from "jotai/utils";
import { Avatar, Chip, ChipProps, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { detailAtom } from "@atoms/wallet";
import { ChainName } from "@utils/constants";
import { useIsFetching, useQueryClient } from "react-query";
import { CONTRACT } from "@utils/queryKeys";
import { useCallback } from "react";

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
  const queryClient = useQueryClient();

  const isFetching = useIsFetching([CONTRACT]);

  console.log("isFetching", isFetching);

  const refresh = useCallback(() => {
    queryClient.refetchQueries([CONTRACT], {
      fetching: false,
    });
  }, [queryClient]);

  if (!wallet) {
    return null;
  }

  return (
    // <Tooltip title='refresh' placement='top'>
    <StyledChip
      variant='outlined'
      avatar={
        isFetching > 0 ? (
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
