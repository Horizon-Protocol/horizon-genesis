import CardSection from "@components/StakeCard/CardSection";
import PrimaryButton from "@components/PrimaryButton";

interface Props {
  token: TokenEnum;
}

export default function ApproveContract({ token }: Props) {
  return (
    <CardSection style={{ minHeight: 54 }}>
      <PrimaryButton size='large' fullWidth>
        Approve Contract
      </PrimaryButton>
    </CardSection>
  );
}
