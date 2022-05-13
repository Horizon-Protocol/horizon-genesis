import { Typography, Box, Grid } from "@mui/material";
import { formatNumber } from "@utils/number";
import { COLOR } from "@utils/theme/constants";
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
import ToolTipContent from "@components/Tooltip/ToolTipContent";
import Tooltip from "@components/Tooltip";
import "./loading.css";

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

    const titles = ["ACTIVE DEBT", "ISSUED DEBT", "GLOBAL DEBT"]
    const contents = ["ACTIVE DEBT", "ISSUED DEBT", "GLOBAL DEBT"]

    const activeIssuedDebtFetching = useIsFetching([GRAPH_DEBT, 'activeaissuesd'])
    const globalDebtFetching = useIsFetching([GRAPH_DEBT, 'globalDebts'])

    return (
        <Box sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
        }}>
            <Grid container spacing={{ md: '10px', xs: '1px' }}>
                {dets.map((debt, index) =>
                    <Grid key={index} item xs={4}>
                        <Box position='relative'
                        >
                            <div style={{
                                display: index < 2 ? activeIssuedDebtFetching ? 'inline-block' : 'none' : globalDebtFetching ? 'inline-block' : 'none',
                                position: 'absolute',
                                right: '8px',
                                top: '5px',
                            }} className="lds-spinner">
                                <div></div><div></div>
                                <div></div><div></div>
                                <div></div><div></div>
                                <div></div><div></div>
                                <div></div>
                            </div>
                            <Typography sx={{
                                py: '22px',
                                backgroundColor: COLOR.bgColor,
                                width: "100%",
                                textAlign: "center",
                                color: ["#3377FF", COLOR.safe, COLOR.warning][index],
                                fontSize: "18px",
                                fontWeight: "bold",
                                letterSpacing: "0.5px",
                                lineHeight: { xs: '10px', md: "20px" }
                            }}>
                                <Tooltip
                                    title={<ToolTipContent title={titles[index]} conetnt={contents[index]} />}
                                    placement='top'
                                >
                                    <Box component='span' style={{
                                        color: COLOR.text,
                                        fontSize: "12px",
                                        fontWeight: "normal"
                                    }}>
                                        {titles[index]}
                                    </Box>
                                </Tooltip>
                                <br />
                                {debt.label}
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}