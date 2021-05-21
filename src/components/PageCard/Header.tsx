import { Box, BoxProps, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const Title = withStyles({
  root: {
    marginBottom: 8,
    fontWeight: 700,
    letterSpacing: "4.57px",
  },
})(Typography);

const Description = withStyles({
  root: {
    marginBottom: 8,
    lineHeight: "22px",
    color: "#C1D3E0",
  },
})(Typography);

export default function Header({
  color,
  title,
  description,
  ...props
}: BoxProps & CardProps) {
  return (
    <Box textAlign='center' {...props}>
      <Title variant='h4' style={{ color }}>
        {title}
      </Title>
      <Description variant='body2'>{description}</Description>
    </Box>
  );
}
