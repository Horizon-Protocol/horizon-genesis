
import { Typography, Box } from "@mui/material";
import { formatNumber } from "@utils/number";
import { COLOR } from "@utils/theme/constants";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { debtAtom } from "@atoms/debt";
import { useAtomValue } from "jotai/utils";
import { first, last } from 'lodash';
import { globalDebtAtom, historicalIssuedDebtAtom } from "@atoms/record";
import useWallet from "@hooks/useWallet";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as IconRefresh } from "@assets/images/icon-refresh.svg";
import { GRAPH_DEBT } from "@utils/queryKeys";
import { useIsFetching } from "react-query";

export default function DebtOverview() {

    const { connected } = useWallet()
    const { debtBalance } = useAtomValue(debtAtom);
    const historicalDebt = useAtomValue(historicalIssuedDebtAtom);
    const globalDebt = useAtomValue(globalDebtAtom);

    const dets = useMemo(() => {
        const tmp = formatNumber(last(historicalDebt)?.debt ?? 0)
        return [
            {
                label: connected ? `$${formatNumber(debtBalance)}` : "--"
            },
            {
                label: connected ? `$${formatNumber(last(historicalDebt)?.debt ?? 0)}` : "--"
            },
            {
                label: `$${formatNumber(first(globalDebt)?.totalDebt ?? 0)}`
            },
        ]
    }, [historicalDebt, debtBalance])

    const activeIssuedDebtFetching = useIsFetching([GRAPH_DEBT,'activeaissuesd'])
    const globalDebtFetching = useIsFetching([GRAPH_DEBT,'globalDebts'])

    return (
        <Box sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
        }}>
            {dets.map((debt, index) =>
                <Box key={index} position='relative' width='32%'>
                    <SvgIcon
                        sx={{
                            display: connected ? 'block' : index < 2 ? 'none' : 'block',
                            position: 'absolute',
                            right:'8px',
                            top:'5px',
                            color: COLOR.text,
                            width: 14,
                            animation: "circular-rotate 4s linear infinite",
                            animationPlayState: index < 2 ? activeIssuedDebtFetching ? "running" : "paused" : globalDebtFetching ? "running" : "paused",
                            "@keyframes circular-rotate": {
                                from: {
                                    transform: "rotate(0deg)",
                                    transformOrigin: "50% 50%",
                                },
                                to: {
                                    transform: "rotate(360deg)",
                                },
                            },
                        }}
                    >
                        <IconRefresh />
                    </SvgIcon>
                    <Typography sx={{
                        py: '22px',
                        backgroundColor: COLOR.bgColor,
                        width: "100%",
                        textAlign: "center",
                        color: ["#3377FF", COLOR.safe, COLOR.warning][index],
                        fontSize: "18px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        lineHeight: "20px"
                    }}>
                        <span style={{
                            color: COLOR.text,
                            fontSize: "12px",
                            fontWeight: "normal"
                        }}>
                            {["ACTIVE DEBT", "ISSUED DEBT", "GLOBAL DEBT"][index]}
                        </span>
                        <br />
                        {debt.label}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}