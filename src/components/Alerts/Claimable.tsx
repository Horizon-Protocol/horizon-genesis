import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

export default function Claimable({ periodEnds }: { periodEnds: string }) {
  return (
    <BaseAlert
      title='Tip'
      content={`You can claim your staking rewards. The fee claim period ends in ${periodEnds}.`}
    >
      <ActionLink to='https://www.binance.com/en/trade/PHB_BTC' target='_blank'>
        Buy HZN
      </ActionLink>
      <ActionLink to='/burn'>Burn zUSD</ActionLink>
    </BaseAlert>
  );
}
