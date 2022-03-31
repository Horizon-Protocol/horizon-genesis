import { HelpOutline } from "@mui/icons-material";
// import claimbleTip from "@assets/images/claimble-tip.png"
import { ReactComponent as ClaimbleTip } from "@assets/images/claimbleTip.svg";

import {
  Box,
  BoxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import { width } from "@mui/system";

export interface Info {
  label: string;
  value: string | JSX.Element;
  warning?: boolean;  // if left under 2 days, show the red warning
}

interface Props {
  data: Info[];
}

export default function InfoList({
  data,
  className,
  ...props
}: Props & BoxProps) {
  return (
    <Box
      py={2}
      px={{
        xs: 0,
        sm: 3,
      }}
      bgcolor='#091320'
      {...props}
    >
      <List dense disablePadding>
        {data.map(({ label, value, warning = false }) => (
          <ListItem
            key={label}
            disableGutters
            sx={{
              p: 0,
              color: warning ? "#FA2256" : "#B4E0FF"
            }}
          >
            <ListItemIcon sx={{ color: "#B4E0FF", fontSize: 14, opacity: .5 }}>
              {label}
            </ListItemIcon>
            <ListItemText
              // primary={value}
              sx={{
                fontSize: '12px',
                textAlign: "right",
                color: "#B4E0FF",
              }}
            />
            {value}
            {warning &&
              <SvgIcon
                sx={{
                  ml: '4px',
                  height: "10px",
                  width:'10px',
                }}
              >
                <ClaimbleTip />
              </SvgIcon>
            }
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
