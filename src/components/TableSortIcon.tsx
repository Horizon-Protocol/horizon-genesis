import { Box } from "@mui/material";
import SortUp from "@assets/wallets/sort_up.svg";
import SortDown from "@assets/wallets/sort_down.svg";

export function SortedDescendingIcon() {
  return (
    <Box>
      <Box
        component="img"
        src={SortUp}
        alt={"SortUp"}
        sx={{
          display: "block",
          transition: "transform 1s",
        }}
      />
      <Box
        component="img"
        src={SortDown}
        alt={"SortDown"}
        sx={{
          display: "block",
          transition: "transform 1s",
        }}
      />
    </Box>
  );
}

export function SortedAscendingIcon() {
  return (
    <Box>
      <Box
        component="img"
        src={SortDown}
        alt={"SortDown"}
        sx={{
          display: "block",
          transition: "transform 1s",
          transform: "rotate(180deg)",
        }}
      />
      <Box
        component="img"
        src={SortUp}
        alt={"SortUp"}
        sx={{
          display: "block",
          transition: "transform 1s",
          transform: "rotate(180deg)",
        }}
      />
    </Box>
  );
}
export function ColumnSelectorIcon() {
  return (
    <Box>
      <Box
        component="img"
        src={SortUp}
        alt={"SortUp"}
        sx={{
          display: "block",
          transition: "transform 1s",
        }}
      />
      <Box
        component="img"
        src={SortUp}
        alt={"SortDown"}
        sx={{
          display: "block",
          transition: "transform 1s",
          transform: "rotate(180deg)",
        }}
      />
    </Box>
  );
}


