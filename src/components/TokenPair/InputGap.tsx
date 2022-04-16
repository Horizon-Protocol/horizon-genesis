import { Box } from "@mui/material";

interface Props {
  direction?: "down" | "up";
  img?: string;
}

const gapSize = 5;
const arrowSize = 30;

export default function InputGap({ img }: Props) {
  return (
    <Box position='relative' height={gapSize}>
      <Box
        position='absolute'
        left={"50%"}
        top={-(arrowSize - gapSize) / 2}
        height={arrowSize}
        width={arrowSize}
        border={5}
        borderRadius={2.5}
        borderColor='#0F1B2C'
        zIndex={1}
        sx={{
          backgroundSize: "65%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#091320",
          backgroundImage: img && `url(${img})`,
          transform: "translateX(-50%)",
        }}
      />
    </Box>
  );
}
