import {
  Box,
  BoxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export interface Info {
  label: string;
  value: string | JSX.Element;
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
        {data.map(({ label, value }) => (
          <ListItem
            key={label}
            disableGutters
            sx={{
              p: 0,
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
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
