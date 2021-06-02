import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

export default function EmptyStaked() {
  return (
    <BaseAlert title='Tip' content='Stake your HZN to start earning yield!'>
      <ActionLink to='/'>Stake Now</ActionLink>
    </BaseAlert>
  );
}
