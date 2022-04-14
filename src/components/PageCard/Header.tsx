import ActionLink from "@components/Alerts/ActionLink";
import { Box, BoxProps, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";

export default function Header({
  color,
  title,
  description,
  ...props
}: BoxProps & CardProps) {
  return (
    <Box textAlign='center' {...props}>
      <Typography
        variant='h4'
        mb={1}
        fontWeight={700}
        letterSpacing='3px'
        color={color}
      >
        {title}
      </Typography>
      <Typography
        variant='body2'
        p='0 12px'
        mb={0}
        lineHeight='22px'
        color={COLOR.text}
      >
        {description}
      </Typography>
      <ActionLink fontSize='12px !important' letterSpacing='1px' href="https://docs.horizonprotocol.com/" target='_blank' showArrow={false}>LEARN MORE</ActionLink>
    </Box>
  );
}
