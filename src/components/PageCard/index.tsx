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
  children,
  ...props
}: BoxProps & CardProps) {
  return (
    <Box
      width="100%"
      maxWidth={640}
      minWidth={{
        md: 640,
        sm: "100%",
      }}
      borderRadius={2.5}
      borderColor={BORDER_COLOR}
      overflow="hidden"
      bgcolor="rgba(16,38,55,0.3)"
      {...props}
    >
      <Box
        display="flex"
        justifyContent="center"
        overflow="hidden"
        position="relative"
        bgcolor="rgba(8,12,22,0.3)"
        sx={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 180px",
          backgroundPosition: "top -18px left -18px",
        }}
      >
        <Box
          display={headerBg ? 'block' : 'none'}
          component="img"
          src={headerBg}
          alt=""
          position="absolute"
          height={{
            xs: 96,
            md: 181
          }}
          width={{
            xs: 107,
            md: 202
          }}
          left={-16}
          top={-11}
          sx={{
            opacity: 0.1,
          }}
        />
        <Header
          color={color}
          title={title}
          description={description}
          height={184}
          width={{
            sm: '100%',
            md: 450
          }}
          py={3}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="stretch"
        flexDirection="column"
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
