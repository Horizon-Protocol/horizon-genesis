import { HZNBuyLink } from "@utils/constants";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

export default function BelowTarget() {
  return (
    <BaseAlert
      title='Attention Required'
      content='Your C-Ratio is below the target ratio. You will need to add HZN to wallet or burn zUSD to raise your C-ratio and be able to claim rewards.'
    >
      <ActionLink href={HZNBuyLink} target='_blank'>
        Buy HZN
      </ActionLink>
      <ActionLink to='/burn'>Burn zUSD</ActionLink>
    </BaseAlert>
  );
}
