import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Token } from "@utils/constants";
import hznLogo from "@assets/tokens/hzn.png";

const useStyles = makeStyles(() => ({
  container: {
    background: "rgba(55,133,185,0.08)",
    textAlign: "center",
  },
  label: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "1.08px",
    transform: "scale(0.75)",
  },
}));

interface Props {
  token?: TokenEnum | zAssetsEnum;
  logo?: string;
}

export default function TokenLogo({ token = Token.HZN, logo }: Props) {
  const classes = useStyles();

  const isHZN = token === Token.HZN;

  return (
    <Box
      width={50}
      height={50}
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      borderRadius='50%'
      className={classes.container}
    >
      <img
        src={logo || hznLogo}
        alt={token}
        style={{
          width: isHZN ? 26 : 18,
          height: isHZN ? 26 : 18,
        }}
      />
      {!isHZN && <span className={classes.label}>{token}</span>}
    </Box>
  );
}
