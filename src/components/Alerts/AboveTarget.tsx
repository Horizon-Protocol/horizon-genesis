import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

export default function AboveTarget() {
  return (
    <BaseAlert
      title='Tip'
      content='Your C-Ratio is above the target. You can mint more zUSD to lower your C-ratio and earn more rewards, but increase your risk from the volatility of HZN.  Maintaining a C-Ratio higher than the target will reduce your risk from volatility.'
    >
      <ActionLink to='/'>Mint Now</ActionLink>
    </BaseAlert>
  );
}
