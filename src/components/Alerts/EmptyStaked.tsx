import { HZNBuyLink } from "@utils/constants";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

interface Props {
  unstaked: BN;
}

export default function EmptyStaked({ unstaked }: Props) {
  return (
    <BaseAlert title='Tip' content='Stake your HZN to start earning yield!'>
      {unstaked.eq(0) && (
        <ActionLink href={HZNBuyLink} target='_blank'>
          Buy HZN
        </ActionLink>
      )}
      <ActionLink to='/'>Stake Now</ActionLink>
    </BaseAlert>
  );
}
