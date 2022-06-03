import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemProps, Collapse } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconArrowUp } from "@assets/images/icon-arrow-up.svg";
import { useEffect, useMemo, useState } from "react";
import { detailAtom } from "@atoms/wallet";
import { useAtomValue } from "jotai/utils";
import useWallet from "@hooks/useWallet";
import { COLOR } from "@utils/theme/constants";
import { ConnectorNames, Token } from "@utils/constants";
import { registerToken, RegisterTokenConf } from "@utils/wallet";
import Tooltip from "@components/Tooltip";
import ToolTipContent from "@components/Tooltip/ToolTipContent";
import useIsMobile from "@hooks/useIsMobile";

interface Data {
  sectionHeader?: boolean;
  showWalletIcon?: boolean;
  importToken?: Token;
  tooltipText?: string;
  label: string | JSX.Element;
  value?: string;
}

interface Props {
  data: Data[];
}

export default function Balance({ data }: Props) {
  const isMobile = useIsMobile()

  const { connected } = useWallet();
  const wallet = useAtomValue(detailAtom);
  const canRegisterToken = useMemo(
    () =>
      wallet?.connectorId === ConnectorNames.Injected,
    [wallet?.connectorId]
  );

  const [showMore, setShowMore] = useState(false)

  useEffect(()=>{
    setShowMore(isMobile)
  },[isMobile])

  const CustomListItem = ({ sectionHeader, showWalletIcon, importToken, tooltipText, label, value }: Data) => (
    <ListItem sx={{
      p: 0,
      pl: sectionHeader ? 1 : 2,
      pr: 1,
      // mt: '-5px'
    }}>
      <ListItemText>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={<ToolTipContent title={label} conetnt={tooltipText ? tooltipText : ''} />}
            placement='top'
          >
            <Box sx={{
              width: 'auto',
              cursor: 'help',
              color: COLOR.text,
              fontSize: sectionHeader ? 14 : 12,
              opacity: sectionHeader ? 1 : 0.5,
            }}>{label}</Box>
          </Tooltip>
          {(showWalletIcon && canRegisterToken) && (
            <Box component='img' src={wallet?.logo} sx={{
              // pt:'2px',
              cursor: 'pointer',
              ml: '3px',
              width: '14px',
              height: '14px'
            }} onClick={() => {
              if (canRegisterToken && importToken) {
                registerToken(RegisterTokenConf[importToken]!);
              }
            }} />
          )}
        </Box>
      </ListItemText>
      <ListItemText
        primary={value}
        sx={{
          textAlign: "right",
          color: COLOR.text,
          fontSize: sectionHeader ? 14 : 12,
          opacity: sectionHeader ? 1 : 0.5,
        }}
      />
    </ListItem>
  )

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <List sx={{
        height: showMore ? '100%' : '100%',
        overflow: 'hidden',
        padding: '10px 2px',
        position: 'relative'
      }} dense disablePadding>
        {data.map(({ sectionHeader, showWalletIcon, importToken, tooltipText, label, value }, index) => (
          sectionHeader ? <CustomListItem key={index} showWalletIcon={showWalletIcon} importToken={importToken} tooltipText={tooltipText} sectionHeader={sectionHeader} label={label} value={value} />
            :
            <Collapse key={index} in={showMore} timeout="auto" unmountOnExit>
              <CustomListItem showWalletIcon={showWalletIcon} importToken={importToken} tooltipText={tooltipText} sectionHeader={sectionHeader} label={label} value={value} />
            </Collapse>
        ))}
      </List >
      {!isMobile && <Box onClick={() => {
        setShowMore(!showMore)
      }} sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        height: '24px',
        fontSize: '10px',
        backgroundColor: 'rgba(16, 38, 55, 1)',
        ":hover": { opacity: 0.75 }
      }}>
        {showMore ? 'Show Less' : 'Show More'}
        <SvgIcon
          sx={{
            ml: 1,
            width: 6,
            height: 6,
            transition: "transform ease 0.25s",
            transform: !showMore ? "rotate(180deg)" : undefined,
          }}
        >
          <IconArrowUp />
        </SvgIcon>
      </Box>}
    </Box>
  );
}