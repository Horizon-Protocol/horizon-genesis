import { useState, useEffect } from "react";
import { BoxProps, Link, Popover } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconArrowUp } from "@assets/images/icon-arrow-up.svg";
import { ReactComponent as IconDocument } from "@assets/images/icon-document.svg";
import { ReactComponent as IconTelegram } from "@assets/images/icon-telegram.svg";
import MenuItem from "./MenuItem";
import { HelpOutline } from "@mui/icons-material";
import { helpDropDownAtom, openLinkDropDownAtom } from "@atoms/wallet";
import { useAtom } from "jotai";


export default function HelpMenu({...props }: BoxProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [openLinkDropDown, setOpenLinkDropDown] = useAtom(openLinkDropDownAtom);
  const [helpDropDown, setHelpDropDown] = useAtom(helpDropDownAtom);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
    // setHelpDropDown(!helpDropDown)
  };

  const handleClose = () => {
    setAnchorEl(null); 
  };

  useEffect(()=>{
    if (!helpDropDown){
      // setAnchorEl(null);
    }
},[helpDropDown])


  const height = 90

  return (
    <MenuItem
      width={86}
      height={36}
      lineHeight="36px"
      onClick={handleOpen}
      {...props}
    >
      <HelpOutline
        sx={{
          mr: 1,
          fontSize: 12,
        }}
      />
      Help
      <SvgIcon
        sx={{
          ml: 1,
          width: 6,
          height: 6,
          transition: "transform ease 0.25s",
          transform: !anchorEl ? "rotate(180deg)" : undefined,
        }}
      >
        <IconArrowUp />
      </SvgIcon>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        // transitionDuration={{
        //   enter: 50,
        //   appear: 50,
        //   exit: 10,
        // }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: 0,
        }}
        sx={{
          // top: height,
          ".MuiBackdrop-invisible": {
            top: height,
            bgcolor: "rgba(6, 14, 31, 0.7)",
            backdropFilter: "blur(8px)",
          },
          ".MuiPopover-paper": {
            // mt: '-84px',
            maxWidth: 310,
            bgcolor: "#0B1828",
          },
        }}
      >
        <Link
          href="https://docs.horizonprotocol.com/"
          target="_blank"
          underline="none"
        >
          <MenuItem px={2.5} height={40} width={220} isLink>
            <SvgIcon sx={{ height: 14, width: 14, mr: 1.5 }}>
              <IconDocument />
            </SvgIcon>
            Documentation
          </MenuItem>
        </Link>
        <Link
          href="https://t.me/HorizonProtocol"
          target="_blank"
          underline="none"
        >
          <MenuItem px={2.5} py={1.5} height={40} width={220} isLink>
            <SvgIcon sx={{ height: 14, width: 14, mr: 1.5 }}>
              <IconTelegram />
            </SvgIcon>
            Community
          </MenuItem>
        </Link>
      </Popover>
    </MenuItem>
  );
  {
    /* <Popover
  id="pair-list"
  open={open}
  onClose={handleClose}
  transitionDuration={{
    enter: 50,
    appear: 50,
    exit: 10,
  }}
  anchorOrigin={{
    vertical: "top",
    horizontal: "left",
  }}
  sx={{
    top: height,
    bgcolor: "rgba(6, 14, 31, 0.7)",
    backdropFilter: "blur(8px)",
    ".MuiPopover-paper": {
      ml: "62px",
      mt: -2,
      maxWidth: 310,
      bgcolor: "#0B1828",
    },
  }}
>
  <SelectHederLogo
    haderMenu={haderMenu}
  />
</Popover> */
  }
}
