import { Box, Button, Dialog, DialogActions, DialogContent, TextField } from "@mui/material"
import { atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useRef, useState } from "react";

export const watchAccountAtom = atom<string>("")

export default function DevWatchTool(){

        // return "0x06e50732517086ed0e25894d31692ce4f9f140b0"
    // unstake
    // return "0x85390B83035763cC9FBb8a4c755f21964f680A4D"

    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState("");

    const updateWatchAccount = useUpdateAtom(watchAccountAtom)
    const handleClickOpen = () => {
      setOpen(true);
    };

    const textRef = useRef(null)
  
    const handleClose = () => {
      setOpen(false);
    };
    return (
        <>
        <Box onClick={handleClickOpen} sx={{
            position:'fixed',
            top:0,
            right:0,
            width:'15px',
            height:'15px',
            // backgroundColor:'red'
        }}>
          </Box>
          <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            onChange={(e) => {
                setAccount(e.target.value)
            }}
            // inputRef={textRef}
            autoFocus
            margin="dense"
            id="name"
            label="Account Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>{
              if (account == ""){
                setOpen(false);
              }else{
                updateWatchAccount(account)
                setOpen(false);
              }
          }}>Watch</Button>
        </DialogActions>
      </Dialog>
          </>
    )
}