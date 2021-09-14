import { BoxProps } from "@material-ui/core";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

interface Props extends BoxProps {
  periodEnds: string;
}

export default function Claimable({ periodEnds, ...props }: Props) {
  return (
    <BaseAlert
      title='Tip'
      content={`You can claim your staking rewards. The fee claim period ends in ${periodEnds}.`}
      {...props}
    >
      <ActionLink to='https://www.binance.com/en/trade/PHB_BTC' target='_blank'>
        Buy HZN
      </ActionLink>
      <ActionLink to='/burn'>Burn zUSD</ActionLink>
    </BaseAlert>
  );
}
