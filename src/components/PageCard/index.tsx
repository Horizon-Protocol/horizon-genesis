import { BORDER_COLOR } from "@utils/theme/constants";
import { Box, BoxProps } from "@mui/material";
import Header from "./Header";

declare global {
  interface CardProps {
    color?: string;
    title?: string;
    description?: string | JSX.Element;
    headerBg?: string;
  }
}

export default function PageCard({
  color,
  headerBg,
  title,
  description,
  className,
  children,
  ...props
}: BoxProps & CardProps) {
  return (
    <Box
      width='100%'
      maxWidth={640}
      border={1}
      borderRadius={2.5}
      borderColor={BORDER_COLOR}
      overflow='hidden'
      bgcolor='rgba(16,38,55,0.3)'
      {...props}
    >
      <Box
        display='flex'
        justifyContent='center'
        overflow='hidden'
        position='relative'
        bgcolor='#0C111D'
        sx={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 180px",
          backgroundPosition: "top -18px left -18px",
        }}
      >
        <Box
          component='img'
          src={headerBg}
          alt=''
          position='absolute'
          height='100%'
          left={-8}
          top={-8}
          sx={{
            opacity: 0.1,
          }}
        />
        <Header
          color={color}
          title={title}
          description={description}
          maxWidth={420}
          py={3}
        />
      </Box>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='stretch'
        flexDirection='column'
        p={{
          xs: "24px 8px",
          sm: "24px 82px 32px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
