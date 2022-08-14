import { styled } from "@mui/material/styles";
import PrimaryButton from "./PrimaryButton";
import { Box, BoxProps } from "@mui/material";
import useWallet from "@hooks/useWallet";
import { useUpdateAtom, } from "jotai/utils";
import { openAtom, openLinkDropDownAtom } from "@atoms/wallet";
import { useHistory } from "react-router-dom";

const StyledGridOverlay = styled(Box)(() => ({
  // display:'flex',
  alignItems: 'center',
  flexDirection: "column",
  backgroundColor: "transparent",
  letterSpacing: "0.5px",
  textAlign: "center",
  fontSize: 12,
  lineHeight: "16px",
}));

interface NoRowsProps {
  hidden?: boolean;
  noRowsTitle?: string | JSX.Element;
  noRowsbtnTitle?: string;
  noRowsRender?: string | JSX.Element,
  btnClick?: () => void;
}

// interface NoRowsOverlayProps extends ;
const NoRowsOverLay = ({ hidden, noRowsTitle, noRowsbtnTitle, noRowsRender, btnClick }: NoRowsProps) => {
  return (
    <StyledGridOverlay display={hidden ? 'none' : 'flex'}>
      {noRowsTitle}
      {noRowsRender ? noRowsRender : <PrimaryButton
        sx={{
          mt: '18px',
          width: '180px',
          height: '36px',
          fontSize: '12px'
        }}
        color='primary'
        onClick={btnClick}
      // disabled={!isAvailable}
      // {...props}
      >
        {noRowsbtnTitle}
      </PrimaryButton>}
    </StyledGridOverlay>
  );
}

export default function NoRowsOverlay({
  hidden,
  noRowsTitle,
  noRowsbtnTitle,
  noRowsRender,
  ...props
}: NoRowsProps & BoxProps) {
  const { connected } = useWallet();
  const setOpen = useUpdateAtom(openAtom);
  const setOpenLinkDropDown = useUpdateAtom(openLinkDropDownAtom);
  const history = useHistory()

  return (
    connected ?
      <NoRowsOverLay hidden={connected ? hidden : true} noRowsTitle={noRowsTitle} noRowsbtnTitle={noRowsbtnTitle} noRowsRender={noRowsRender} btnClick={() => {
        history.push('mint')
      }} /> :
      <NoRowsOverLay hidden={false} noRowsTitle="No wallet connected" noRowsbtnTitle="Connect wallet" btnClick={() => {
        setOpen(true)
        setOpenLinkDropDown(false)
      }} />
  )
}