import { Typography, BoxProps, Box, SvgIcon } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const Img = styled("img")``;

declare global {
    interface GridCardProps {
        onClick?: () => void;
        titleColor: string
        icon: JSX.Element,
        title: string,
        desc: string | JSX.Element,
        showAlert?: boolean
    }
}

export default function GridCrad({
    onClick,
    titleColor,
    icon,
    title,
    desc,
    showAlert,
    ...props
}: BoxProps & GridCardProps) {
    const [boxColor,setBoxColor] = useState('rgba(16, 38, 55, 0.5)')
    const [imgOpacity,setImgOpacity] = useState(.2)
    const [descOpacity,setDescOpacity] = useState(.5)

    return (
        <Box
        onMouseEnter={()=>{
            setBoxColor('rgba(16, 38, 55, 1)')
            setImgOpacity(1)
            setDescOpacity(1)
        }}
        onMouseLeave={()=>{
            setBoxColor('rgba(16, 38, 55, .5)')
            setImgOpacity(.2)
            setDescOpacity(.5)
        }}
            // class="ds"
            onClick={onClick}
            position='relative'
            height='100px'
            bgcolor={boxColor}
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            overflow='hidden'
            sx={{
                cursor: "pointer",
            }}
        >

<SvgIcon
          sx={{
            position: 'absolute',
            left: 0,
            top: '-5px',
            width: "46px",
            height: "46px",
            opacity: imgOpacity
          }}
        >
          {icon}
        </SvgIcon>
            {/* <Img
                src={icon}
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: '-5px',
                    width: "46px",
                    height: "46px",
                    opacity: imgOpacity
                }}
            /> */}
            {showAlert && (<Box sx={{
                position: 'absolute',
                right: '8px',
                top: '8px',
                backgroundColor: '#F5841F',
                width: "12px",
                height: "12px",
                borderRadius : '50%'
            }}/>)}
            <Typography
                textAlign='center'
                fontSize={18}
                fontWeight='bold'
                lineHeight='21px'
                fontFamily='Raleway'
                letterSpacing={1}
                color={titleColor}
            >{title}</Typography>
            <Typography
                marginTop='3px'
                textAlign='center'
                fontSize={12}
                lineHeight='16px'
                fontFamily='Raleway'
                letterSpacing={0.5}
                color='#B4E0FF'
                sx={{
                    opacity: descOpacity
                }}
            >{desc}</Typography>
        </Box>
    )
}