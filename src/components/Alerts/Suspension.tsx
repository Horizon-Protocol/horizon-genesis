import ActionLink from "./ActionLink";
import BaseAlert from "./Base";
import { COLOR } from "@utils/theme/constants";
import { BoxProps } from "@mui/material";
import { useMemo } from "react";

interface SuspensionProps {
    reason: number,
}

export default function Suspension({
    reason,
    ...props
}: SuspensionProps & BoxProps) {

    const content = useMemo(() => {
        if (reason == 0) {
            return "The system has been temporarily suspended. To get updates, please check the Telegram or Discord channels."
        }
        if (reason == 1) {
            return "Horizon Protocol is undergoing a system upgrade. To get updates, please check the Telegram or Discord channels."
        }
        if (reason == 2) {
            return "Horizon Protocol is undergoing a maintenance procedure. To get updates, please check the Telegram or Discord channels."
        }
        return ""
    }, [reason]);

    return (
        <BaseAlert
            baseColor={COLOR.warning}
            title='SYSTEM SUSPENDED'
            content={content}
            {...props}
        >
            <ActionLink href={'https://t.me/HorizonProtocol'} target='_blank'>
                TELEGRAM
            </ActionLink>
            <ActionLink ml='20px' href={'https://discord.gg/SaDKvkbQF2'} target='_blank'>
                DISCORD
            </ActionLink>
        </BaseAlert>
    );
}