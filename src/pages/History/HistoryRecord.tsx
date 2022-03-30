import { alpha, Box, Typography, Link } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { COLOR } from "@utils/theme/constants";
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from "@components/CustomDataGrid";
import {
    SortedDescendingIcon,
    SortedAscendingIcon,
    ColumnSelectorIcon,
} from "@components/TableSortIcon";
import iconNoTransaction from "@assets/wallets/no-transaction.svg";
import Pagination from "@components/Pagination";
import TypeCell from "./TypeCell";
import ActionLink from "@components/Alerts/ActionLink";
import NoRowsOverlay from "@components/NoRowsOverlay";
import DateRangeSelection from "./DateRangeSelection";
import TypeSelection from "./TypeSelection";
import { useAtomValue } from "jotai/utils";
import { historicalOperationAtom } from "@atoms/record";
import dayjs from "dayjs";
import { formatNumber } from "@utils/number";
import { HistoryType } from "@atoms/record";
import { HistoricalOperationData } from "@hooks/query/useQueryDebt";
import { DateRange } from "@mui/lab/DateRangePicker/RangeTypes";
import { BlockExplorer } from "@utils/helper";

interface HistoryDataProps{
    id: string,
    type: HistoryType,
    timestamp: string,
    date: string,
    amount: string,
}

export interface HistoryRangeDateProps{
    start: string,
    end: string,
}

export default function HistoryRecord() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const historicalOperationData = useAtomValue(historicalOperationAtom)
    const [historyType, setHistoryType] = useState<HistoryType>(HistoryType.All)
    const [historyDateRange, setHistoryDateRange] = useState<DateRange<Date>>([null,null])

    const [loading, setLoading] = useState<boolean>(true)

    let chooseStart = dayjs(historyDateRange[0])
    let chooseEnd = dayjs(historyDateRange[1])

    const dataRows = useMemo(()=>{
        if (historicalOperationData){
            let allDate = historyDateRange[0] == null && historyDateRange[1] == null

            const rows = historicalOperationData.map(item => {
                return ({
                    id: item.id,
                    type: item.type,
                    timestamp: item.timestamp,
                    date: dayjs(Number(item.timestamp) * 1000).format('DD/MM/YYYY hh:mm'),
                    amount: formatNumber(item.value)
                })
            }).reverse()
            .filter(item => {
                return historyType == HistoryType.All ? item : item.type == historyType
            })
            .filter(item => {
                let itemDate = dayjs(Number(item.timestamp) * 1000)
                // console.log('===chooseStartend',{
                //     chooseStart:chooseStart,
                //     chooseEnd:chooseEnd,
                //     item:itemDate
                // })
                return allDate ? item : (itemDate.isAfter(chooseStart) && itemDate.isBefore(chooseEnd))
            })
            setLoading(false)
            return rows
        }else{
            return []
        }
    },[historicalOperationData,historyType,historyDateRange])

    const columns: GridColDef[] = [{
        field: "type",
        headerName: "Type",
        sortable: false,
        width: 90,
        editable: false,
        headerAlign: 'left',
        renderCell({ value, row }) {
            return (
                <TypeCell historyType={value} />
            );
        },
    }, {
        field: "date",
        headerName: "Date (UTC)",
        width: 190,
        editable: false,
        headerAlign: 'left',
        renderCell({ value, row }) {
            return (
                <Typography sx={{
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: COLOR.text
                }}>
                    {value}
                </Typography>
            );
        },
    }, {
        field: "amount",
        headerName: "Amount",
        width: 90,
        editable: false,
        headerAlign: 'left',
        renderCell({ value, row }) {
            return (
                <Typography sx={{
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: COLOR.safe
                }}>
                    {value}
                </Typography>
            );
        },
    }, {
        field: "id",
        headerName: "Tx",
        type: "number",
        sortable: false,
        width: 80,
        editable: false,
        headerAlign: 'center',
        renderCell({ value, row }) {
            console.log('value',value)
            return (
                <Link href={BlockExplorer.txLink((value as string).split("-")[0])} target="_blank" underline="none">
                    <ActionLink>VIEW</ActionLink>
                </Link>
            );
        },
    },]

    return (
        <Box>
            {/* <NoRowsOverlay
                hidden={historicalOperationData && historicalOperationData.length > 0}
                noRowsTitle={<>You have no transactions. Start by staking<br />HZN and minting zUSD.</>}
                noRowsbtnTitle="STAKE NOW"
            /> */}
            <Box sx={{
                // display : (historicalOperationData && historicalOperationData.length > 0) ? 'block' : 'none'
                }}>
                <Box sx={{
                    display: 'flex',
                    // flexWrap:'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <TypeSelection typeValue={historyType} selectType={(type)=>{
                        setHistoryType(type)
                    }} {...{ width: '44%' }} />
                    <DateRangeSelection dateRangeValue={historyDateRange} selectDateRange={(rangeDate: DateRange<Date>)=>{
                        if (rangeDate[0] && rangeDate[1]){
                            setHistoryDateRange(rangeDate)
                        }
                    }} {...{ width: '44%' }} />
                    <Typography onClick={() => {
                        setHistoryType(HistoryType.All)
                        setHistoryDateRange([null,null])
                    }} sx={{
                        width: '8%',
                        fontSize: '12px',
                        color: COLOR.safe,
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}>Clear</Typography>
                </Box>
                <Box sx={{ mt: '20px', width: '100%', overflow: 'hidden'}}>
                    <CustomDataGrid
                        loading={loading}
                        columns={columns}
                        rows={dataRows}
                        page={page}
                        autoHeight
                        pageSize={rowsPerPage}
                        hideFooterPagination
                        rowHeight={44}
                        headerHeight={32}
                        scrollbarSize={4}
                        hideFooter
                        disableColumnMenu
                        disableColumnSelector
                        disableSelectionOnClick
                        isCellEditable={() => false}
                        isRowSelectable={() => false}
                        components={{
                            ColumnSortedDescendingIcon: SortedDescendingIcon,
                            ColumnSortedAscendingIcon: SortedAscendingIcon,
                            ColumnUnsortedIcon: ColumnSelectorIcon,
                            NoRowsOverlay: () => 
                                <Box></Box>
                        }}
                        
                    />
                </Box>
                <Pagination {...{ mt: '18px' }} rowsCount={dataRows.length} currentPage={page} rowsPerPage={rowsPerPage} pageClick={(index) => {
                    setPage(index - 1)
                }} />
            </Box>

        </Box>
    )
}
