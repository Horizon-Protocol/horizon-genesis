import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
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
    fontSize: 14,
  },
})(ListItemIcon);

const Value = withStyles(() => ({
  root: {
    textAlign: "right",
  },
}))(ListItemText);

interface Props {
  data: Data[];
}

const useStyles = makeStyles({
  listItem: {
    padding: 0,
  },
});

export default function Balance({ data }: Props) {
  const classes = useStyles();
  return (
    <List dense disablePadding>
      {data.map(({ label, value, color }) => (
        <ListItem
          key={label}
          disableGutters
          classes={{ root: classes.listItem }}
        >
          <Label>{label}</Label>
          <Value primary={value} style={{ color }} />
        </ListItem>
      ))}
    </List>
  );
}
