import { HelpOutline } from "@mui/icons-material";
import { ReactComponent as ClaimbleTip } from "@assets/images/claimbleTip.svg";
import Tooltip from "@components/Tooltip";
import ToolTipContent from "@components/Tooltip/ToolTipContent";
import {
  Box,
  BoxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from "@mui/material";

export interface Info {
  label: string | JSX.Element;
  value: string | JSX.Element;
  warning?: boolean;  // if left under 2 days, show the red warning
}

interface Props {
  data: Info[];
}

export default function InfoList({ data, ...props }: Props & BoxProps) {
  return (
    <Box
      py={{
        xs:'20px',
        md:'20px'
      }}
      px={{
        xs:'10px',
        md:'30px'
      }}
      borderRadius='4px'
      bgcolor="rgba(8, 12, 22, 0.3)"
      {...props}
    >
      <List dense disablePadding>
        {data.map(({ label, value, warning = false }, index) => (
          <ListItem
            key={index}
            disableGutters
            sx={{
              fontSize: '14px',              
              color: warning ? "#FA2256" : "#B4E0FF"
            }}
          >
            <ListItemIcon sx={{ color: "#B4E0FF", fontSize: '14px', opacity: .5 }}>
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
              <Tooltip
                title={<ToolTipContent title='Current Claim Period Ends' conetnt='Current Claim Period Ends' />}
                placement='top'>
                <Box sx={{
                  cursor: 'help',

                }}>
                  <SvgIcon
                    sx={{
                      ml: '4px',
                      height: "10px",
                      width: '10px',
                    }}
                  >
                    <ClaimbleTip />
                  </SvgIcon>
                </Box>
              </Tooltip>
            }
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
