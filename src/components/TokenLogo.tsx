import { Box } from "@mui/material";
import { Token } from "@utils/constants";
import hznLogo from "@assets/tokens/hzn.png";

interface Props {
  token?: TokenEnum | zAssetsEnum;
  logo?: string;
}

export default function TokenLogo({ token = Token.HZN, logo }: Props) {
  const isHZN = token === Token.HZN;

  return (
    <Box
      width={32}
      height={32}
      display='flex'
      // marginTop="18px"
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      borderRadius='50%'
      bgcolor='rgba(55,133,185,0.08)'
      textAlign='center'
    >
      <img
        src={logo || hznLogo}
        alt={token}
        style={{
          width: isHZN ? 26 : 18,
          height: isHZN ? 26 : 18,
        }}
      />
      {!isHZN && (
        <Box
          component='span'
          mt={0.5}
          fontSize={9}
          fontWeight={700}
          letterSpacing='1.08px'
          sx={{
            transform: "scale(0.75)",
          }}
        >
          {token}
        </Box>
      )}
    </Box>
  );
}
