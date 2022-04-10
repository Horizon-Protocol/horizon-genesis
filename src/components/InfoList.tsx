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

export default function InfoList({ data, ...props }: Props & BoxProps) {
  return (
    <Box
      py={2}
      px={{
        xs: 0,
        sm: 3,
      }}
      bgcolor="#091320"
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
            <ListItemIcon sx={{ color: "#5897C1", fontSize: 14 }}>
              {label}
            </ListItemIcon>
            <ListItemText
              primary={value}
              sx={{
                textAlign: "right",
                color: "#88ABC3",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
