
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

export default function DebtOverview() {

    const { connected } = useWallet()
    const { debtBalance } = useAtomValue(debtAtom);
    const historicalDebt = useAtomValue(historicalIssuedDebtAtom);
    const globalDebt = useAtomValue(globalDebtAtom);

    const dets = useMemo(() => {
        const tmp = formatNumber(last(historicalDebt)?.issuanceDebt ?? 0)
        return [
            {
                label: connected ? `$${formatNumber(debtBalance)}` : "--"
            },
            {
                label: connected ? `$${formatNumber(last(historicalDebt)?.issuanceDebt ?? 0)}` : "--"
            },
            {
                label: `$${formatNumber(first(globalDebt)?.totalDebt ?? 0)}`
            },
        ]
    }, [historicalDebt,debtBalance])

    return (
        <Box sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
        }}>
            {dets.map((debt, index) =>
                <Typography key={index} sx={{
                    py: '22px',
                    backgroundColor: COLOR.bgColor,
                    width: "32%",
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
                    }}>{["ACTIVE DEBT", "ISSUED DEBT", "GLOBAL DEBT"][index]}</span><br />
                    {dets[index].label}
                </Typography>
            )}
        </Box>
    )
}