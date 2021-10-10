import { useMemo } from "react";
import {
  Box,
  Avatar,
  Card,
  CardProps,
  CardHeader,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useAtomValue } from "jotai/utils";
import { detailAtom } from "@atoms/wallet";
import { poolStateAtomFamily } from "@atoms/staker/pool";
import defaultTheme from "@utils/theme";
import {
  ConnectorNames,
  DEPRECATED_TOKENS,
  TokenAddresses,
  TokenName,
} from "@utils/constants";
import { registerToken, RegisterTokenConf } from "@utils/wallet";
import useWallet from "@hooks/useWallet";
import useFetchPoolState from "@hooks/staker/useFetchPoolState";
import ExternalLink from "@components/Staker/ExternalLink";
import { CARD_CONTENT, COLOR } from "@utils/theme/constants";
import ConnectButton from "../ConnectButton";
import Pending from "./Pending";
import Stats from "./Stats";
import Earned from "./Earned";
import AmountStake from "./AmountStake";

interface LinkProps {
  href: string;
  logo: string;
  text: string;
}

export interface StakeCardProps extends CardProps {
  token: TokenEnum;
  finished?: boolean;
  cardTitle?: string | React.ReactNode;
  desc: string | React.ReactNode;
  bg: string;
  color?: string;
  logo?: string;
  links?: LinkProps[];
  open?: boolean;
  disabledActions?: ActionEnum[];
}

export default function StakeCard({
  token,
  finished,
  bg,
  color = defaultTheme.palette.primary.main,
  cardTitle,
  desc,
  logo,
  links,
  open = true,
  disabledActions,
  sx,
  ...props
}: StakeCardProps) {
  const { connected } = useWallet();
  const wallet = useAtomValue(detailAtom);
  const canRegisterToken = useMemo(
    () =>
      wallet?.connectorId === ConnectorNames.Injected &&
      !!RegisterTokenConf[token],
    [wallet?.connectorId]
  );

  useFetchPoolState(token);

  const { earned, staked, withdrawable } = useAtomValue(
    poolStateAtomFamily(token)
  );

  const cardDisabled = useMemo(() => {
    if (DEPRECATED_TOKENS.indexOf(token) > -1) {
      return earned.isZero() && staked.isZero() && withdrawable.isZero();
    }
    return false;
  }, [earned, staked, token, withdrawable]);

  if (cardDisabled) {
    return null;
  }

  return (
    <Card
      variant='outlined'
      sx={{
        maxWidth: 340,
        flex: "0 0 340px",
        bgcolor: "rgba(16, 38, 55, 0.3)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto 160px",
        backgroundPosition: "top -12px right -12px",
        borderRadius: 2.5,
        border: 0,
        backgroundImage: `url(${bg})`,
        ...sx,
      }}
      {...props}
    >
      <CardHeader
        title={cardTitle || `Stake ${TokenName[token]}`}
        subheader={
          <Typography
            color={COLOR.text}
            fontSize={14}
            lineHeight='22px'
            minHeight={22 * 3}
            letterSpacing='0.5px'
          >
            {desc}
          </Typography>
        }
        action={
          wallet &&
          canRegisterToken && (
            <Avatar
              component='span'
              variant='circular'
              src={wallet.logo}
              alt={wallet.label}
              sx={{
                ml: 0.5,
                position: "absolute",
                top: 18,
                right: 18,
                display: "inline-block",
                width: 18,
                height: 18,
                cursor: "pointer",
              }}
              onClick={() => {
                if (canRegisterToken) {
                  registerToken(RegisterTokenConf[token]!);
                }
              }}
            />
          )
        }
        sx={{
          pt: 4,
          position: "relative",
          color,
          ".MuiCardHeader-title": {
            mb: 1,
            letterSpacing: "1px",
            textTransform: "uppercase",
          },
        }}
      />
      <CardContent sx={{ p: 0, bgcolor: "rgba(8, 12, 22, 0.5)" }}>
        <Stats token={token} finished={finished} />
      </CardContent>
      <div
        style={{
          position: open ? undefined : "relative",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Earned token={token} earned={earned} />
          {connected ? (
            <AmountStake
              logo={logo}
              token={token}
              finished={finished}
              disabledActions={disabledActions}
            />
          ) : (
            <Box {...CARD_CONTENT}>
              <ConnectButton fullWidth size='large' />
            </Box>
          )}
        </CardContent>
        <CardActions
          sx={{
            p: links?.length ? 2 : 0.5,
          }}
        >
          {links?.map(({ href, logo, text }) => (
            <ExternalLink key={href} href={href} logo={logo}>
              {text}
            </ExternalLink>
          ))}
        </CardActions>
        {!open && <Pending>pending</Pending>}
      </div>
    </Card>
  );
}
