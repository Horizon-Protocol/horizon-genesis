import { BoxProps } from "@mui/material";
import { HZNBuyLink } from "@utils/constants";
import ActionLink from "./ActionLink";
import BaseAlert from "./Base";

interface Props extends BoxProps {
  unstaked: BN;
}

export default function EmptyStaked({ unstaked, ...props }: Props) {
  return (
    <BaseAlert
      title='Tip'
      content='Stake your HZN to start earning yield!'
      {...props}
    >
      {unstaked.eq(0) && (
        <ActionLink href={HZNBuyLink} target='_blank'>
          BUY HZN
        </ActionLink>
      )}
      <ActionLink ml="20px" to='/mint'>Stake Now</ActionLink>
    </BaseAlert>
  );
}
