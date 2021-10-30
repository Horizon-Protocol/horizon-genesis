import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Badge,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { PriorityHigh } from "@mui/icons-material";
import isBoolean from "lodash/isBoolean";
import some from "lodash/some";
import values from "lodash/values";
import StakeCard from "@components/StakeCard";
import { COLOR } from "@utils/theme/constants";
import useFetchPrice from "@hooks/staker/useFetchPrice";
import { AllPools } from "./utils";

const toggleSx = {
  p: "8px 12px",
  border: "none",
  bgcolor: "#102637",
  color: COLOR.text,
  opacity: 0.4,
  fontWeight: 700,
  textTransform: "none",
  letterSpacing: "1px",
} as const;

export default function Home() {
  useFetchPrice();

  const [showFinish, setShowFinish] = useState(false);
  const [finishAlert, setFinishAlert] = useState<
    { [t in TokenEnum]?: boolean }
  >({});

  const handleChange = useCallback((_, v) => {
    if (isBoolean(v)) {
      setShowFinish(v);
    }
  }, []);

  const handleFinishAlertChange = useCallback(
    (t: TokenEnum, hasAlert: boolean) => {
      setFinishAlert((prev) => ({
        ...prev,
        [t]: hasAlert,
      }));
    },
    []
  );

  const hasAnyFinishAlert = useMemo(
    () => some(values(finishAlert)),
    [finishAlert]
  );

  return (
    <Box
      p='0 24px'
      display='flex'
      flexWrap='wrap'
      justifyContent='center'
      alignItems='flex-start'
    >
      <Box
        width='100%'
        mb={2}
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        <Badge
          invisible={!hasAnyFinishAlert}
          overlap='circular'
          badgeContent={
            <PriorityHigh
              sx={{
                fontSize: 10,
              }}
            />
          }
          sx={{
            ".MuiBadge-badge": {
              display: "flex",
              minWidth: 16,
              width: 16,
              height: 16,
              p: 0,
              top: 0,
              right: 8,
              bgcolor: "#F5841F",
              color: "white",
            },
          }}
        >
          <ToggleButtonGroup
            color='primary'
            value={showFinish}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton
              value={false}
              sx={{
                ...toggleSx,
                "&.Mui-selected": {
                  color: "#2AD4B7",
                  opacity: 1,
                },
              }}
            >
              Live
            </ToggleButton>
            <ToggleButton
              value={true}
              sx={{
                ...toggleSx,
                "&.Mui-selected": {
                  opacity: 1,
                },
              }}
            >
              Finished
            </ToggleButton>
          </ToggleButtonGroup>
        </Badge>
        {showFinish && (
          <Typography
            mt={3}
            fontSize={14}
            fontWeight='bold'
            color='#FA2256'
            letterSpacing='0.5px'
          >
            These pools are no longer active. Please unstake your tokens.
          </Typography>
        )}
      </Box>
      {AllPools.map((pool) => (
        <StakeCard
          key={pool.token}
          showFinish={showFinish}
          setFinishAlert={handleFinishAlertChange}
          {...pool}
          sx={{
            m: "10px",
          }}
        />
      ))}
    </Box>
  );
}
