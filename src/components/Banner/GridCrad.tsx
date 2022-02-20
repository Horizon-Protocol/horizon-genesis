import { jsx } from "@emotion/react";
import { Typography, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system"

const Img = styled("img")``;

declare global {
    interface GridCardProps {
        onClick?: () => void;
        titleColor: string
        icon: string,
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

    return (
        <Box
            onClick={onClick}
            position='relative'
            height='100px'
            bgcolor='rgba(16, 38, 55, 0.5)'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            sx={{
                cursor: "pointer",
                ":hover": {
                    opacity: .5,
                    // backgroundColor: "#102637",
                },
            }}
        >
            <Img
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    backgroundColor: 'red',
                    width: "46px",
                    height: "46px",
                }}
            />
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
            >{desc}</Typography>
        </Box>
    )
}