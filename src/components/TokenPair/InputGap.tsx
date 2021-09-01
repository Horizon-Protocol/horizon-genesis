import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  direction?: "down" | "up";
  img?: string;
}

const useStyles = makeStyles(() => ({
  container: {},
  arrow: {
    backgroundSize: "65%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "#091320",
    backgroundImage: ({ img }: { img?: string }) => img && `url(${img})`,
    transform: "translateX(-50%)",
  },
}));

const gapSize = 12;
const arrowSize = 50;

export default function InputGap({ img }: Props) {
  const classes = useStyles({ img });

  return (
    <Box position='relative' height={gapSize}>
      <Box
        position='absolute'
        left={"50%"}
        top={-(arrowSize - gapSize) / 2}
        height={arrowSize}
        width={arrowSize}
        border={5}
        borderRadius={10}
        borderColor='#0F1B2C'
        zIndex={1}
        className={classes.arrow}
      />
    </Box>
  );
}
