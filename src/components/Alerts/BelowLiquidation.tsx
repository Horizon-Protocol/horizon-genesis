import { HZNBuyLink } from "@utils/constants";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

interface Props {
  color: string;
}

export default function BelowLiquidation({ color }: Props) {
  return (
    <BaseAlert
      color={color}
      title='Attention Required'
      content='You are at risk of being liquidated. Please immediately add HZN to your wallet or burn zUSD to restore your c-ratio.'
    >
      <ActionLink href={HZNBuyLink} target='_blank'>
        Buy HZN
      </ActionLink>
      <ActionLink to='/burn'>Burn zUSD</ActionLink>
    </BaseAlert>
  );
}
