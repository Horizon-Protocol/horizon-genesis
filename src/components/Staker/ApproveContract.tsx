import { Box } from "@mui/material";
import PrimaryButton from "@components/PrimaryButton";
import { CARD_CONTENT } from "@utils/theme/constants";

interface Props {
  token: TokenEnum;
}

export default function ApproveContract({ token }: Props) {
  return (
    <Box {...CARD_CONTENT} minHeight={54}>
      <PrimaryButton size='large' fullWidth>
        Approve Contract
      </PrimaryButton>
    </Box>
  );
}
