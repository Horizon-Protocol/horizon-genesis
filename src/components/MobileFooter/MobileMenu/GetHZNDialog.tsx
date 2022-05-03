import { Dialog, DialogProps } from "@mui/material";
import { styled } from "@mui/styles";
import { useState } from "react";

export default function GetHZNDialog(props: DialogProps){

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
          padding: '2px',
        },
        '& .MuiDialogActions-root': {
          padding: '2px',
        },
      }));
    

    return (
        <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        {...props}
      >
        dsadasdasdsadsadasdasdsa
      </BootstrapDialog>
    )
}