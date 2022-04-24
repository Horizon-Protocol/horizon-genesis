import { Box, BoxProps, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import Tooltip from "@components/Tooltip";

interface HZNInfoPriceProps {
  title: string | JSX.Element;
  desc: string | JSX.Element;
  toolTipText: string | JSX.Element;
}

export default function HZNInfoPrice({
  title,
  desc,
  toolTipText,
  ...props
}: HZNInfoPriceProps & BoxProps) {
  return (
    <Box
      borderRadius='4px'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
      {...props}
    >
      <Tooltip
        title={toolTipText}
        placement='top'
      >
        <Typography lineHeight='14px' sx={{ opacity: 0.5, cursor:'help' }} fontSize={12} color={COLOR.text}>{title}</Typography>
      </Tooltip>
      <Typography lineHeight='19px' letterSpacing='1px' fontFamily='Rawline' fontSize={16} color={COLOR.safe} component='div' fontWeight={700}>
        {desc}
      </Typography>
    </Box>
  );
}
