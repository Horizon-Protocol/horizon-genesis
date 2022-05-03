import { Popover, PopoverProps } from "@mui/material"

interface MenuPopoverProps extends PopoverProps {
    menuOnClose: () => void
}

//common popover
export default function MenuPopover({ menuOnClose, children, ...props }: MenuPopoverProps) {
    return (
        <Popover
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            onClose={menuOnClose}
            sx={{
                // pointerEvents: 'none',
                bottom: "50px",
                ".MuiBackdrop-invisible": {
                    bgcolor: "rgba(6, 14, 31, 0.85)",
                    bottom: 50,
                },
                ".MuiPopover-paper": {
                    maxWidth: "100%",
                    width: "100%",
                    height: "100%",
                    left: "0 !important",
                    top: "auto !important",
                    maxHeight: "100%",
                    backdropFilter: "blur(12px)",
                    borderRadius: "0",
                    bgcolor: "unset",
                    position: "relative",
                    boxShadow: "none",
                },
            }}
            {...props}
        >
            {children}
        </Popover>
    )
}