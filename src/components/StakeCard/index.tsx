import { useEffect, useMemo } from "react";
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
import { userFarmInfoFamilyAtom } from "@atoms/staker/farm";
import defaultTheme from "@utils/theme";
import { ConnectorNames, TokenName, Token, DEPLOY_DATES } from "@utils/constants";
import { registerToken, RegisterTokenConf } from "@utils/wallet";
import useWallet from "@hooks/useWallet";
import ExternalLink from "@components/Staker/ExternalLink";
import { CARD_CONTENT, COLOR } from "@utils/theme/constants";
import ConnectButton from "../ConnectButton";
import Pending from "./Pending";
import Stats from "./Stats";
import Earned from "./Earned";
import AmountStake from "./AmountStake";
import dayjs from "dayjs";

interface LinkProps {
  href: string;
  logo: string;
  text: string;
}

export interface StakeCardProps extends CardProps {
  showFinish?: boolean;
  setFinishAlert?: (t: TokenEnum, hasAlert: boolean) => void;
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
  showFinish = false,
  setFinishAlert,
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
  const { earned, staked, withdrawable } = useAtomValue(
    userFarmInfoFamilyAtom(token)
  );
  const canRegisterToken = useMemo(
    () =>
      wallet?.connectorId === ConnectorNames.Injected &&
      !!RegisterTokenConf[token],
    [token, wallet?.connectorId]
  );
  const isReadyToStartBnbPool = (new Date().getTime() / 1000) > DEPLOY_DATES[Token.ZBNB_BNB_LP];

  useEffect(() => {
    if (finished) {
      setFinishAlert?.(token, !!(earned || staked || withdrawable.lt(0)));
    }
  }, [earned, finished, setFinishAlert, staked, token, withdrawable]);

  if (showFinish) {
    if (!finished) {
      return null;
    }
  } else {
    if (finished) {
      return null;
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        maxWidth: 340,
        flex: "0 0 340px",
        bgcolor: COLOR.bgColor,
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto 160px",
        backgroundPosition: "top -12px right -12px",
        borderRadius: 2.5,
        border: 0,
        backgroundImage: `url(${bg})`,
        overflow: 'visible',
        ...sx,
      }}
      {...props}
    >
      {TokenName[token] === "zBNB-BNB" && !isReadyToStartBnbPool && (<Typography 
        color={COLOR.text}
        sx={{
          position: "absolute",
          top: -10,
          left: 0,
          borderRadius: "4px",
          p: "2px 10px 2px 10px",
          ml: "10px",
          // width: "100%",
          color: COLOR.safe,
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: "0.5px",
          background: COLOR.bg,
        }}>
           Pool Begins: {dayjs(new Date(DEPLOY_DATES[Token.ZBNB_BNB_LP] * 1000)).format("ddd, MMM DD, YYYY ~HH:mm")}
      </Typography>)}

      <CardHeader
        title={cardTitle || `STAKE ${TokenName[token]}`}
        subheader={
          <Typography
            color={COLOR.text}
            fontSize={14}
            lineHeight="22px"
            minHeight={22 * 3}
            letterSpacing="0.5px"
          >
            {desc}
          </Typography>
        }
        action={
          wallet &&
          canRegisterToken && (
            <Avatar
              component="span"
              variant="circular"
              src={wallet.logo}
              alt={wallet.label}
              sx={{
                ml: 0.5,
                position: "absolute",
                top: 39,
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
            textTransform: "",
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
              <ConnectButton fullWidth size="large" />
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
