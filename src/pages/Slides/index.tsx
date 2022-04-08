import { FiberManualRecord } from "@mui/icons-material";
import { BoxProps, Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";

interface Props {
  height?: BoxProps["height"];
}
export default function Slides({ height }: Props) {
  return (
    <Carousel
      NextIcon={<Box>左</Box>}
      PrevIcon={<Box>右</Box>}
      activeIndicatorIconButtonProps={{
        style: { color: "#2AD4B7" },
      }}
      fullHeightHover={false}
    // IndicatorIcon={
    //   <FiberManualRecord
    //     sx={{
    //       fontSize: 8,
    //     }}
    //   />
    // }
    >
      <Box sx={{ width: '100%', height: '200px', textAlign: "center", backgroundColor: "red" }}>11111</Box>
      <Box sx={{ width: '100%', height: '200px', textAlign: "center", backgroundColor: "green" }}>22222</Box>
      <Box sx={{ width: '100%', height: '200px', textAlign: "center", backgroundColor: "yellow" }}>33333</Box>
      <Box sx={{ width: '100%', height: '200px', textAlign: "center", backgroundColor: "blue" }}>44444</Box>
    </Carousel>
  );
}
