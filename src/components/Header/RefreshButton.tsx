import { Box, BoxProps, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconRefresh } from "@assets/images/icon-refresh.svg";
import { COLOR, COLOR_BG_50 } from "@utils/theme/constants";
import useRefresh, { useIsRefrshing } from "@hooks/useRefresh";

export default function RefreshButton(props: BoxProps) {
  const { refreshing, time } = useIsRefrshing();
  const refresh = useRefresh();

  return (
    <Box
      mr={1.25}
      height={36}
      display={{
        sm: "flex",
        xs: "none",
      }}
      justifyContent="center"
      alignItems="center"
      py={0}
      px={1.75}
      borderRadius={1}
      bgcolor={COLOR_BG_50}
      onClick={refresh}
      sx={{
        backgroundColor:'rgba(16, 38, 55, 0.4)',
        cursor: "pointer",
        ":hover": {
          bgcolor: 'rgba(16, 38, 55, 1)',
        },
      }}
      {...props}
    >
      <SvgIcon
        sx={{
          color: COLOR.text,
          width: 14,
          animation: "circular-rotate 4s linear infinite",
          animationPlayState: refreshing ? "running" : "paused",
          "@keyframes circular-rotate": {
            from: {
              transform: "rotate(0deg)",
              /* 修复 IE11 下的抖动 */
              transformOrigin: "50% 50%",
            },
            to: {
              transform: "rotate(360deg)",
            },
          },
        }}
      >
        <IconRefresh />
      </SvgIcon>
      <Box ml={1.375}>
        <Typography
          fontSize={8}
          lineHeight="11px"
          color={alpha(COLOR.text, 0.5)}
          whiteSpace="nowrap"
        >
          Last Update:
        </Typography>
        <Typography
          fontSize={12}
          lineHeight="15px"
          color={COLOR.text}
          whiteSpace="nowrap"
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
}
