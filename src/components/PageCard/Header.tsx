import ActionLink from "@components/Alerts/ActionLink";
import { Box, BoxProps, Typography } from "@mui/material";

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
        letterSpacing='4.57px'
        color={color}
      >
        {title}
      </Typography>
      <Typography
        variant='body2'
        p='0 12px'
        mb={1}
        lineHeight='22px'
        color='#C1D3E0'
      >
        {description}
      </Typography>
      <ActionLink showArrow={false}>LEARN MORE</ActionLink>
    </Box>
  );
}
