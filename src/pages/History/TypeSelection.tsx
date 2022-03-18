import { Box, Popover } from "@mui/material";
import { BoxProps, height } from "@mui/system";
import TypeCell from "./TypeCell";
import dropdown_arrow from "@assets/images/dropdown_arrow.png";
import { openLinkDropDownAtom } from "@atoms/wallet";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import TypeSelectionItem from "./TypeSelectionItem";
import { useAtom } from "jotai";
import { HistoryType, HistoryTypeAtom } from "@atoms/record";

const Span = styled("span")``;
const Img = styled("img")``;

export default function TypeSelection(props: BoxProps) {

    const [historyType, setHistoryType] = useAtom(HistoryTypeAtom)
    const [typeDropDown, setTypeDropDown] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl((prev) => (prev ? null : event.currentTarget));
        setTypeDropDown(!typeDropDown)
    };

    const handleClose = () => {
        setAnchorEl(null);
        setTypeDropDown(!typeDropDown)
    };

    return (
        <Box sx={{
            borderRadius: '4px'
        }}
            {...props}
        >
            <TypeSelectionItem {...{
                // width: '200px',
                height: '44px',
            }} showArrow={true} arrowUp={typeDropDown} historyType={historyType} onClick={handleOpen} />
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                transitionDuration={{
                    enter: 50,
                    appear: 50,
                    exit: 10,
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: 'left',
                }}
                sx={{
                    boxShadow: 'none !important',
                    // width:'160px',
                    // height:'120px',
                    // backgroundColor:'red'
                    top: '5px',
                    // ".MuiBackdrop-invisible": {
                    //     top: height,
                    //     bgcolor: "rgba(6, 14, 31, 0.7)",
                    //     backdropFilter: "blur(8px)",
                    // },
                    // ".MuiPopover-paper": {
                    //     mt: '-84px',
                    //     maxWidth: 310,
                    //     bgcolor: "#0B1828",
                    // },
                }}
            >
                <TypeSelectionItem {...{
                    width: '200px',
                    height: '44px',
                }} historyType={HistoryType.Mint} onClick={()=>{
                    handleClose()
                    setHistoryType(HistoryType.Mint)
                }}/>
                <TypeSelectionItem {...{
                    width: '200px',
                    height: '44px',
                }} historyType={HistoryType.Burn} onClick={()=>{
                    handleClose()
                    setHistoryType(HistoryType.Burn)
                }}/>
                <TypeSelectionItem {...{
                    width: '200px',
                    height: '44px',
                }} historyType={HistoryType.Claim} onClick={()=>{
                    handleClose()
                    setHistoryType(HistoryType.Claim)
                }}/>
                </Popover>
        </Box>
    )
}