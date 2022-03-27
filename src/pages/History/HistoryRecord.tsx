import { alpha, Box, Typography } from "@mui/material";
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

interface HistoryDataProps{
    id: string,
    type: HistoryType,
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

    // const [dataRows, setDataRows] = useState<HistoryDataProps[]>([])

    const historicalOperationData = useAtomValue(historicalOperationAtom)
    const [historyType, setHistoryType] = useState<HistoryType>(HistoryType.All)
    const [historyDateRange, setHistoryDateRange] = useState<HistoryRangeDateProps>({start:'',end:''})

    // const [historyType, setHistoryType] = useState<HistoryType>(HistoryType.All)


    // useEffect(()=>{
    //     const rowsData = historicalOperationData.map(item => {
    //         return ({
    //             id: item.id,
    //             type: item.type,
    //             date: dayjs(Number(item.timestamp) * 1000).format('DD/MM/YYYY hh:mm'),
    //             amount: formatNumber(item.value)
    //         })
    //     }).reverse()
    //     setDataRows(rowsData)
    // },[historicalOperationData])

    // const filterWithType = (type: HistoryType) => {

        // setDataRows
        // setDataRows([])
        // alert(type)
    // }

    // useEffect(()=>{

    //     setRows(historicalOperationData)
    // },[historicalOperationData])

    const dataRows = useMemo(()=>{
        return historicalOperationData.map(item => {
            return ({
                id: item.id,
                type: item.type,
                date: dayjs(Number(item.timestamp) * 1000).format('DD/MM/YYYY hh:mm'),
                amount: formatNumber(item.value)
            })
        }).reverse().filter(item => {
            return item.type = historyType
        })
    },[historicalOperationData,historyType,historyDateRange])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
        field: "tx",
        headerName: "Tx",
        type: "number",
        sortable: false,
        width: 80,
        editable: false,
        headerAlign: 'center',
        renderCell({ value, row }) {
            return (
                <ActionLink to='/mint'>VIEW</ActionLink>
            );
        },
    },]

    return (
        <Box>
            <NoRowsOverlay
                hidden={dataRows.length > 0}
                noRowsTitle={<>You have no transactions. Start by staking<br />HZN and minting zUSD.</>}
                noRowsbtnTitle="STAKE NOW"
            />
            <Box sx={{display : dataRows.length > 0 ? 'block' : 'none'}}>
                <Box sx={{
                    display: 'flex',
                    // flexWrap:'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <TypeSelection selectType={(type)=>{
                        setHistoryType(type)
                    }} {...{ width: '44%' }} />
                    <DateRangeSelection selectDateRange={(rangeDate:HistoryRangeDateProps)=>{
                        if (rangeDate.start && rangeDate.end){
                            setHistoryDateRange(rangeDate)
                        }
                    }} {...{ width: '44%' }} />
                    <Typography onClick={() => {

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
                        columns={columns}
                        rows={dataRows}
                        page={page}
                        autoHeight
                        pageSize={rowsPerPage}
                        hideFooterPagination
                        rowHeight={44}
                        // rows={formattedRows}
                        // columns={columns}
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

