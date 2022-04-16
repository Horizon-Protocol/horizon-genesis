import { useState } from "react";
import { BoxProps, Link, Popover } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconArrowUp } from "@assets/images/icon-arrow-up.svg";
import { ReactComponent as IconDocument } from "@assets/images/icon-document.svg";
import { ReactComponent as IconDiscord } from "@assets/images/icon-discord.svg";
import { ReactComponent as IconTelegram } from "@assets/images/icon-telegram.svg";
import { ReactComponent as IconHelp } from "@assets/images/icon-help.svg";
import { ReactComponent as IconHelpSelected } from "@assets/images/icon-help-select.svg";

import MenuItem from "./MenuItem";
import { HelpOutline } from "@mui/icons-material";
import { COLOR } from "@utils/theme/constants";

export default function HelpMenu({ ...props }: BoxProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MenuItem
      width={86}
      height={36}
      lineHeight="36px"
      onClick={handleOpen}
      color = {!anchorEl ? 'rgb(180, 224, 255)' : 'rgba(42,212,183,1)'}
      {...props}
    >
      {/* <HelpOutline
        sx={{
          mr: 1,
          fontSize: 12,
        }}
      /> */}
      <SvgIcon
        sx={{
          // stroke:"red",
          // fill:'red',
          // color:'red',
          mr: '6px',
          width: 13,
          height: 13,
        }}
      >
        {anchorEl ? <IconHelpSelected /> : <IconHelp />}
      </SvgIcon>
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
          ".MuiBackdrop-invisible": {
            top: 80,
            bgcolor: "rgba(6, 14, 31, 0.7)",
            backdropFilter: "blur(8px)",
          },
          ".MuiPopover-paper": {
            boxShadow: 'none',
            top:'85px !important',
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
          <MenuItem color={COLOR.text} px={2.5} height={40} width={220} isLink>
            <SvgIcon sx={{ height: 14, width: 14, mr: 1.5 }}>
              <IconDocument />
            </SvgIcon>
            Documentation
          </MenuItem>
        </Link>
        <Link
          href="https://discord.gg/SaDKvkbQF2"
          target="_blank"
          underline="none"
        >
          <MenuItem color={COLOR.text} px={2.5} py={1.5} height={40} width={220} isLink>
            <SvgIcon sx={{ height: 16, width: 14, mr: 1.5 }}>
              <IconDiscord />
            </SvgIcon>
            Discord
          </MenuItem>
        </Link>
        <Link
          href="https://t.me/HorizonProtocol"
          target="_blank"
          underline="none"
        >
          <MenuItem color={COLOR.text} px={2.5} py={1.5} height={40} width={220} isLink>
            <SvgIcon sx={{ height: 14, width: 14, mr: 1.5 }}>
              <IconTelegram />
            </SvgIcon>
            Telegram
          </MenuItem>
        </Link>
      </Popover>
    </MenuItem>
  );
}
