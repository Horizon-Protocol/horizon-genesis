import { ReactNode } from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { Close, ErrorOutline } from "@mui/icons-material";
import { COLOR } from "@utils/theme/constants";

export interface AlertProps extends Omit<BoxProps, "title"> {
  baseColor?: string;
  title: ReactNode;
  content: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
}

export default function BaseAlert({
  baseColor = COLOR.text,
  title,
  content,
  children,
  onClose,
  ...props
}: AlertProps) {
  return (
    <Box
      position='relative'
      display='flex'
      borderRadius='4px'
      borderTop={`2px solid ${baseColor}`}
      bgcolor={COLOR.bgColor}
      color={baseColor}
      {...props}
    >
      <Box mr={1} fontSize={18}>
        <ErrorOutline color='inherit' fontSize='inherit' />
      </Box>
      <Box>
        <Typography
          fontSize={12}
          fontWeight={700}
          letterSpacing='0.43px'
          lineHeight='18px'
          sx={{
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
        <Typography
          marginTop={0.5}
          fontSize={12}
          lineHeight='18px'
          color='text.secondary'
        >
          {content}
        </Typography>
        <Box
          mt={1}
          display='flex'
          sx={{
            "> *": {
              ml: 2,
            },
            "> *:first-of-type": {
              ml: 0,
            },
          }}
        >
          {children}
        </Box>
      </Box>
      {onClose && (
        <Close
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            cursor: "pointer",
            fontSize: 16,
            color: "text.secondary",
            ":hover": {
              color: "text.primary",
            },
          }}
        />
      )}
    </Box>
  );
}
