import { Box, BoxProps, Typography } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { COLOR, COLOR_BG, COLOR_BG_40 } from "@utils/theme/constants";
import { ReactComponent as IconLink } from "@assets/images/icon-link.svg";

interface Props extends BoxProps {
  isLink?: boolean;
  svgSx?: BoxProps;
}

export default function MenuItem({
  isLink = false,
  children,
  sx,
  svgSx,
  ...props
}: Props) {
  return (
    <Box
      px={1.375}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      letterSpacing="0.5px"
      color={COLOR.text}
      bgcolor='rgba(16, 38, 55, 0.4)'
      borderRadius={1}
      sx={{
        cursor: "pointer",
        opacity: isLink ? 0.5 : 1,
        ":hover": {
          color: COLOR.safe,
          opacity: 1,
          backgroundColor: 'rgba(16, 38, 55, 1)'
        },
        ":hover *": {
          color: COLOR.safe,
        },
        ...sx,
      }}
      {...props}
    >
      <Typography
        component="div"
        display="flex"
        alignItems="center"
        fontSize={14}
        fontWeight={500}
        whiteSpace="nowrap"
      >
        {children}
      </Typography>
      {isLink && (
        <SvgIcon
          sx={{
            height: 12,
            width: 12,
            ...svgSx
          }}
        >
          <IconLink />
        </SvgIcon>
      )}
    </Box>
  );
}
