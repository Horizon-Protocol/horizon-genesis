import { useAtomValue } from "jotai/utils";
import { Avatar, Chip, ChipProps, CircularProgress } from "@mui/material";
import { detailAtom } from "@atoms/wallet";
import { ChainName } from "@utils/constants";
import { useIsFetching } from "react-query";
import { CONTRACT } from "@utils/queryKeys";
import useRefresh from "@hooks/useRefresh";

export default function WalletIndicator(props: ChipProps) {
  const wallet = useAtomValue(detailAtom);

  const isFetching = useIsFetching([CONTRACT]);

  const refresh = useRefresh();

  if (!wallet) {
    return null;
  }

  return (
    // <Tooltip title='refresh' placement='top'>
    <Chip
      variant='outlined'
      avatar={
        isFetching > 0 ? (
          <CircularProgress color='primary' size={20} />
        ) : (
          <Avatar
            variant='circular'
            src={wallet.logo}
            alt={wallet.label}
            sx={{
              ".MuiAvatar-img": {
                width: 18,
                height: 18,
                objectFit: "contain",
              },
            }}
          />
        )
      }
      label={ChainName}
      onClick={() => refresh()}
      sx={{
        marginRight: "10px",
        px: "4px",
        color: "text.primary",
        textTransform: "none",
        borderRadius: 1,
        bgcolor: "#091620",
        border: "1px solid rgba(55,133,185,0.25)",
      }}
      {...props}
    />
    // </Tooltip>
  );
}
