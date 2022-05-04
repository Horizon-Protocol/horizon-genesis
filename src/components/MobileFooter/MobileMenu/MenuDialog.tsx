import { DialogProps, Dialog } from "@mui/material"

interface MenuDialogProps extends DialogProps {
    menuOnClose?: () => void
}

//common popover
export default function MenuDialog({ menuOnClose, children, ...props }: MenuDialogProps) {
    return (
        <Dialog
            onClick={()=>{
                if (menuOnClose){
                    menuOnClose()
                }
            }}
            sx={{
                bottom:"3.124rem",
                ".MuiBackdrop-root": {
                    background: 'transparent',
                    bottom: '3.124rem',
                },
                ".MuiDialog-container": {
                    m: 0,
                },
                ".MuiDialog-paper": {
                    boxShadow:'none !important',
                    width: '100%',
                    height: "100%",
                    maxWidth: '100%',
                    maxHeight: '100%',
                    m: 0,  //32px default
                    background: 'rgba(6, 14, 31, 0.85)',
                    backdropFilter: "blur(12px)",
                },
            }}
            {...props}
        >
            {children}
        </Dialog>
    )
}