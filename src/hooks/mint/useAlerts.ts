import { useAtomValue } from "jotai/utils";
import { collateralDataAtom, debtAtom } from "@atoms/debt";
import { targetCRatioAtom } from "@atoms/app";
import { useEffect } from "react";

export default function useAlerts() {
  const targetCRatio = useAtomValue(targetCRatioAtom);
  const { currentCRatio } = useAtomValue(debtAtom);
  const { stakedCollateral } = useAtomValue(collateralDataAtom);

  useEffect(() => {
    if (currentCRatio.gt(0) && currentCRatio.lt(targetCRatio)) {
      return {
        title: "ATTENTION REQUIRED",
        content: (
          <>
            Your C-Ratio is below the target ratio. You will need to add HZN to
            wallet or burn zUSD to raise your C-ratio and be able to claim
            rewards.
          </>
        ),
        actions: (
          <>
            <ActionLink to='/'>Buy HZN</ActionLink>
            <ActionLink to='/burn'>Burn zUSD</ActionLink>
          </>
        ),
      };
    }
    // on mint page
    if (pathname === "/") {
      if (stakedCollateral.eq(0)) {
        return {
          title: "Tip",
          content: <>Stake your HZN to start earning yield!</>,
          actions: <ActionLink to='/'>Stake HZN</ActionLink>,
        };
      }
      return {
        title: "Tip",
        content: <>Stake your HZN to start earning yield!</>,
        actions: <ActionLink to='/'>Stake HZN</ActionLink>,
      };
    }
    return {};
  }, [classes.actionLink, pathname]);
}
