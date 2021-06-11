import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

export default function AboveTarget() {
  return (
    <BaseAlert
      title='Tip'
      content='Your C-Ratio is above the target. You can do nothing to reduce your risk from volatility or you can lower your C-Ratio by minting additional zUSD.'
    >
      <ActionLink to='/'>Mint Now</ActionLink>
    </BaseAlert>
  );
}
