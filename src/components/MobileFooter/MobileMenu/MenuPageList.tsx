
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ListItemButtonProps, SvgIcon } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ReactComponent as IconLink } from "@assets/images/icon-link.svg";
import { ReactComponent as IconArrow } from "@assets/images/menu-sectionarrow.svg";
import { ReactComponent as IconArrowUp } from "@assets/images/menu-sectionarrowup.svg";

interface Props {
  onMenuClick: () => void
}

interface Menu {
  menu: string;
  path: string;
  symbol: string;
  subItem?: boolean;
}

export default function MenuPageList({ onMenuClick }: Props) {
  const { pathname } = useLocation()
  const history = useHistory();

  const [helpOpen, setHelpOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const handleHelpClick = () => {
    setHelpOpen(!helpOpen);
  };

  const handleWalletClick = () => {
    setWalletOpen(!walletOpen);
  };

  const handleMenuClick = useCallback(
    (path) => {
      if (path === "Docs/Academy") {
        window.open("https://academy.horizonprotocol.com/");
      } else if (path === "Telegram") {
        window.open("https://t.me/HorizonProtocol");
      } else if (path === "Discord") {
        window.open("https://discord.gg/SaDKvkbQF2");
      } else {
        onMenuClick();
        history.push(`${path}`);
      }
    },
    [history, onMenuClick]
  );

  useEffect(()=>{
    setWalletOpen(['/debtTracker', '/escrow', '/history'].indexOf(pathname) > -1)
  },[pathname])

  const ListItem = useCallback(({
    menu,
    path,
    symbol,
    subItem,
    children,
    ...props
  }: Menu & ListItemButtonProps) => {
    const menuSelected = (pathname.indexOf(symbol) > -1 || (symbol === "home" && pathname === "/")) && symbol != ''
    const walletSelected = symbol == 'wallet' && ['/debtTracker', '/escrow', '/history'].indexOf(pathname) > -1
    return (
      <ListItemButton onClick={() => {
        handleMenuClick(path)
      }} sx={{
        height: "50px",
        ml: subItem ? '30px' : 0,
        fontFamily: "Raleway",
        position: "relative",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "20px",
        // pl: subItem ? "50px" : "30px",
        pr: '26px',
        lineHeight: "50px",
        letterSpacing: "1px",
        color: walletSelected ? "#2AD4B7" : menuSelected
          ? "white"
          : alpha('#B4E0FF',.5),
        background: menuSelected
          ? "#102637"
          : alpha('#102637',.3),
        ":before": {
          content: '""',
          display: "block",
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: '4px',
          bgcolor: menuSelected ? "#11CABE" : "transparent"
        },
        ":after": {
          content: '""',
          display: "block",
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: '1px',
          bgcolor: subItem ? "rgba(180, 224, 255, 1)" : 'transparent',
          opacity: .5
        },
      }}
        {...props}
      >
        {menu}
        <ListItemText />
        {children}
      </ListItemButton>
    )
  }, [])

  return (
    <List
      sx={{ width: '100%', pb:'0px' }}
    >
      <ListItem onClick={handleHelpClick} {...{ menu: 'Help', path: '', symbol: '' }}>
        <SvgIcon sx={{ width: 10 }} >{helpOpen ? <IconArrowUp />:<IconArrow />}</SvgIcon> 
      </ListItem>
      <Collapse in={helpOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem {...{ menu: 'Docs/Academy', path: 'Docs/Academy', symbol: '', subItem: true }}>
            <SvgIcon sx={{ width: 10 }} > <IconLink /> </SvgIcon>
          </ListItem>
          <ListItem {...{ menu: 'Telegram', path: 'Telegram', symbol: '', subItem: true }}>
            <SvgIcon sx={{ width: 10 }} > <IconLink /> </SvgIcon>
          </ListItem>
          <ListItem {...{ menu: 'Discord', path: 'Discord', symbol: '', subItem: true }}>
            <SvgIcon sx={{ width: 10 }} > <IconLink /> </SvgIcon>
          </ListItem>
        </List>
      </Collapse>
      <ListItem onClick={handleWalletClick} {...{ menu: 'Wallet', path: '', symbol: 'wallet' }}>
        <SvgIcon sx={{ width: 10 }} >{walletOpen ? <IconArrowUp />:<IconArrow />}</SvgIcon> 
      </ListItem>
      <Collapse in={walletOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem {...{ menu: 'Debt Tracker', path: '/debtTracker', symbol: 'debtTracker', subItem: true }} />
          <ListItem {...{ menu: 'Escrow', path: '/escrow', symbol: 'escrow', subItem: true }} />
          <ListItem {...{ menu: 'History', path: '/history', symbol: 'history', subItem: true }} />
        </List>
      </Collapse>
      <ListItem {...{ menu: 'Earn', path: '/earn', symbol: 'earn' }} />
      <ListItem {...{ menu: 'Claim', path: '/claim', symbol: 'claim' }} />
      <ListItem {...{ menu: 'Burn', path: '/burn', symbol: 'burn' }} />
      <ListItem {...{ menu: 'Mint', path: '/mint', symbol: 'mint' }} />
      <ListItem {...{ menu: 'Home', path: '/home', symbol: 'home' }} />
    </List>
  )
}