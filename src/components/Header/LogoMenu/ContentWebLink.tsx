import { useCallback, useEffect } from "react";
import {
  BoxProps,
  Hidden,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAtom } from "jotai";
import { openLinkDropDownAtom } from "@atoms/wallet";
import { Box, display } from "@mui/system";
import logo from "@assets/logo.png";
import { COLOR, BORDER_COLOR } from "@utils/theme/constants";
import dropdown_arrow from "@assets/images/dropdown_arrow.png";

const Span = styled("span")``;
const Img = styled("img")``;

declare global {
  interface ContentWebLinkProps {
    icon?: string,
    index?: number,
    title: string,
    desc: string,
  }
}

export default function ContentWebLink({
  icon,
  index,
  title,
  desc,
  ...props
}: BoxProps & ContentWebLinkProps) {
  const [openLinkDropDown, setOpenLinkDropDown] = useAtom(openLinkDropDownAtom);
  
  let borderRadius='6px'
  if (index == 1){
    borderRadius='6px 6px 0px 0px'
  }
  if (index == 2){
    borderRadius='0px 0px 6px 6px'
  }

  return (
    <Box
      display='flex'
      bgcolor= {index < 1 ? 'transparent' : '#102637'}
      borderRadius={borderRadius}
      sx={{
        cursor: "pointer",
        ":hover": index < 1 ? {} :{
          opacity: 0.4
        },
      }}
      {...props}
    >
      <Box sx={{
        width: '47px',
        height: '68px',
        display: typeof(icon) == "undefined" ? 'none' : 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
      }}>
        <Img sx={{
          width: '40px',
          height: '40px',
          backgroundColor: 'green'
        }} />
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '289px',
        height: '68px'
      }}>
        <Box sx={{
          display: 'flex',
          // justifyContent: 'center',
          alignItems: 'center',
          pl:'13px'
        }}>
          <Typography
            fontSize={19}
            fontWeight={300}
            lineHeight='22px'
            fontFamily='Raleway'
            color='#2AD4B7'
          >
            <span style={{
              fontWeight: 'bold',
              color: 'white'
            }}>HORIZON</span>
            {title}
          </Typography>
          <Img
          hidden = {typeof(icon) == "undefined"}
          sx={{
            transform: openLinkDropDown ?  "rotate(0deg)" : "rotate(180deg)",
            transition: "all .2s"
          }} height='14px' width='16px' src={dropdown_arrow}/>
        </Box>
        <Typography
            fontSize={14}
            fontWeight={300}
            lineHeight='16px'
            fontFamily='Raleway'
            color={COLOR.text}
            paddingLeft='13px'
          >
            {desc}
          </Typography>
      </Box>
    </Box>

  );
}
