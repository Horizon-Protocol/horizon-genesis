import ActionLink from "@components/Alerts/ActionLink";
import { Box, BoxProps, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";

export default function Header({
  color,
  title,
  description,
  href,
  ...props
}: BoxProps & CardProps) {
  return (
    <Box textAlign='center' {...props}>
      <Typography
        variant='h4'
        mb={{
          xs: 0,
          md: '8px'
        }}
        fontWeight={700}
        letterSpacing='3px'
        color={color}
        fontSize={32}
      >
        {title}
      </Typography>
      <Typography
        variant='body2'
        p='0 12px'
        mb={0}
        lineHeight='22px'
        color={COLOR.text}
        fontSize={14}
      >
        {description}
      </Typography>
      <ActionLink fontSize='12px !important' letterSpacing='1px' href={href} target='_blank' showArrow={false}>LEARN MORE</ActionLink>
    </Box>
  );
}
