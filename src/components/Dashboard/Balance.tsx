import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

interface Data {
  label: string;
  value?: string;
  color?: string;
}

interface Props {
  data: Data[];
}

export default function Balance({ data }: Props) {
  return (
    <List dense disablePadding>
      {data.map(({ label, value, color = "#fff" }) => (
        <ListItem key={label} disableGutters sx={{ p: 0 }}>
          <ListItemIcon
            sx={{
              color: "#5897C1",
              fontSize: 14,
            }}
          >
            {label}
          </ListItemIcon>
          <ListItemText
            primary={value}
            sx={{
              textAlign: "right",
              color,
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}
