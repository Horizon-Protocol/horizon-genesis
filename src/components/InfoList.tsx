import {
  Box,
  BoxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";

const Label = withStyles({
  root: {
    color: "#5897C1",
    fontSize: 14,
  },
})(ListItemIcon);

const Value = withStyles(() => ({
  root: {
    textAlign: "right",
    color: "#88ABC3",
  },
}))(ListItemText);

const useStyles = makeStyles({
  container: {
    padding: "16px 24px",
    background: "#091320",
  },
  listItem: {
    padding: 0,
  },
});

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
  const classes = useStyles();

  return (
    <Box {...props} className={clsx(classes.container, className)}>
      <List dense disablePadding>
        {data.map(({ label, value }) => (
          <ListItem
            key={label}
            disableGutters
            classes={{ root: classes.listItem }}
          >
            <Label>{label}</Label>
            <Value primary={value} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
