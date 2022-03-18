import { alpha, Box, BoxProps, TableCellProps, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from "react";
import { COLOR, COLOR_BG_30 } from "@utils/theme/constants";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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

interface RowsData {
    claimDate: string;
    unlockDate: string;
    amount: string | JSX.Element;
}

function createData(
    claimDate: string,
    unlockDate: string,
    amount: string | JSX.Element,
): RowsData {
    return { claimDate, unlockDate, amount };
}

export default function HistoryRecord() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
        width: 80,
        editable: false,
        headerAlign: 'center',
        renderCell({ value, row }) {
            return (
                <ActionLink to='/mint'>VIEW</ActionLink>
            );
        },
    },]

    // const rows:RowsData[] = [];
    const rows = [
        {
            id: "28daceaf-7567-5f29-9818-d2f4146cdff2",
            type: "Mint",
            date: "Aug 21, 2021 22:13",
            amount: 43006,
        },
        {
            id: "6aef0ebf-02d7-50dc-8e5a-9c108ed7a27b",
            type: "Burn",
            date: "Aug 21, 2021 22:13",
            amount: 43006,
        },
        {
            id: "bdfb5923-583c-5c57-afe9-9b64785165e8",
            type: "Claim",
            date: "Aug 21, 2021 22:13",
            amount: 43006,
        },
        {
            id: "cba21385-5834-5019-a0f3-98635b70d53b",
            type: "Claim",
            date: "Aug 21, 2021 22:13",
            amount: 43006,
        },
        {
            id: "a2c09b75-08f3-5545-80c0-b1c869dd4347",
            type: "Burn",
            date: "Aug 21, 2021 22:13",
            amount: 43006,
        },
        {
            id: "295197c2-d961-5167-b42f-04224227effe",
            type: "Mint",
            date: "Aug 21, 2021 22:13",
            amount: 43006,
        }
    ]

    return (
        <Box>
            <NoRowsOverlay
                hidden={rows.length > 0}
                noRowsTitle={<>You have no transactions. Start by staking<br />HZN and minting zUSD.</>}
                noRowsbtnTitle="STAKE NOW"
            />
            <Box sx={{display : rows.length > 0 ? 'block' : 'none'}}>
                <Box sx={{
                    display: 'flex',
                    // flexWrap:'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <TypeSelection {...{ width: '44%' }} />
                    <DateRangeSelection {...{ width: '44%' }} />
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
                        rows={rows}
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
                <Pagination {...{ mt: '18px' }} rowsCount={rows.length} currentPage={page} rowsPerPage={rowsPerPage} pageClick={(index) => {
                    setPage(index - 1)
                }} />
            </Box>

        </Box>
    )
}

