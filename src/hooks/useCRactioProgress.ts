import { useMemo } from "react";
import { COLOR } from "@utils/theme/constants";
import { useAtomValue } from "jotai";
import { currentCRatioPercentAtom } from "@atoms/debt";
import { ratiosPercentAtom } from "@atoms/app";

export default function useCRactioProgress() {
    const currentCRatioPercent = useAtomValue(currentCRatioPercentAtom);
    const { targetCRatioPercent, liquidationRatioPercent } =
        useAtomValue(ratiosPercentAtom);

    const getColorByRatioPercent = (
        ratioPercent: number,
        liquidationPercent: number,
        targetPercent: number
    ) => {
        if (ratioPercent <= liquidationPercent) {
            return COLOR.danger;
        }
        if (ratioPercent < targetPercent) {
            return COLOR.warning;
        }
        return COLOR.safe;
    };

    const getProgressByRatioPercent = (
        ratioPercent: number,
        liquidationPercent: number,
        targetPercent: number
    ) => {
        let percent = 0;
        if (ratioPercent <= 0) {
            percent = 0;
        } else if (ratioPercent < liquidationPercent) {
            percent = (ratioPercent / liquidationPercent) * 25;
        } else if (ratioPercent < targetPercent) {
            percent =
                25 +
                ((ratioPercent - liquidationPercent) /
                    (targetPercent - liquidationPercent)) *
                50;
        } else {
            // ratio >= target
            percent =
                75 + ((ratioPercent - targetPercent) / (1000 - targetPercent)) * 25;
        }

        return Math.min(percent, 100);
    };

    const { progress, color } = useMemo(
        () => ({
            color: getColorByRatioPercent(
                currentCRatioPercent,
                liquidationRatioPercent,
                targetCRatioPercent
            ),
            progress: getProgressByRatioPercent(
                currentCRatioPercent,
                liquidationRatioPercent,
                targetCRatioPercent
            ),
        }),
        [currentCRatioPercent, liquidationRatioPercent, targetCRatioPercent]
    );

    return { progress, color }
}