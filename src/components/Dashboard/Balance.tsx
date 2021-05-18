import {
  Box,
  BoxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

interface Data {
  label: string;
  value?: string;
  color?: string;
}

const Label = withStyles({
  root: {
    color: "#5897C1",
  },
})(ListItemIcon);

const Value = withStyles(() => ({
  root: {
    textAlign: "right",
  },
  primary: {
    fontFamily: "Rawline",
  },
}))(ListItemText);

interface Props {
  data: Data[];
}

export default function Balance({ data }: Props) {
  return (
    <List dense disablePadding>
      {data.map(({ label, value, color }) => (
        <ListItem key={label} disableGutters>
          <Label>{label}</Label>
          <Value primary={value} style={{ color }} />
        </ListItem>
      ))}
    </List>
  );
}
