import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CRatioRange from "./CRatioRange";

const useStyles = makeStyles(({ palette }) => ({
  container: {
    width: "100%",
    maxWidth: 320,
    border: `1px solid ${palette.divider}`,
    borderRadius: 10,
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <CRatioRange ratio={777} />
    </Box>
  );
}
