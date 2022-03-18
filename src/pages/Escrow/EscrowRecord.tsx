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
import Pagination from "@components/Pagination";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from "@components/CustomDataGrid";
import {
    SortedDescendingIcon,
    SortedAscendingIcon,
    ColumnSelectorIcon,
} from "@components/TableSortIcon";
import iconNoTransaction from "@assets/wallets/no-transaction.svg";
import NoRowsOverlay from "@components/NoRowsOverlay";

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

export default function EscrowRecord() {
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
        field: "claimDate",
        headerName: "Claim Date (UTC)",
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
        field: "unlockDate",
        headerName: "Unlock Date",
        width: 140,
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
        field: "amount",
        headerName: "Amount",
        type: "number",
        width: 130,
        editable: false,
        headerAlign: 'right',
        renderCell({ value, row }) {
            return (
                <Typography sx={{
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: COLOR.text
                }}>
                    {value}
                    <span style={{
                        marginLeft: '4px',
                        opacity: .5
                    }}>HZN</span>
                </Typography>
            );
        },
    },]

        const rows: RowsData[] = []

    // const rows: RowsData[] = [
    //     {
    //         id: "28daceaf-7567-5f29-9818-d2f4146cdff2",
    //         claimDate: "Aug 21, 2021 22:13",
    //         unlockDate: "Aug 21, 2022 22:13",
    //         amount: 43006,
    //     },
    //     {
    //         id: "6aef0ebf-02d7-50dc-8e5a-9c108ed7a27b",
    //         claimDate: "Aug 21, 2021 22:13",
    //         unlockDate: "Aug 21, 2022 22:13",
    //         amount: 43006,
    //     },
    //     {
    //         id: "bdfb5923-583c-5c57-afe9-9b64785165e8",
    //         claimDate: "Aug 21, 2021 22:13",
    //         unlockDate: "Aug 21, 2022 22:13",
    //         amount: 43006,
    //     },
    //     {
    //         id: "cba21385-5834-5019-a0f3-98635b70d53b",
    //         claimDate: "Aug 21, 2021 22:13",
    //         unlockDate: "Aug 21, 2022 22:13",
    //         amount: 43006,
    //     },
    //     {
    //         id: "a2c09b75-08f3-5545-80c0-b1c869dd4347",
    //         claimDate: "Aug 21, 2021 22:13",
    //         unlockDate: "Aug 21, 2022 22:13",
    //         amount: 43006,
    //     },
    //     {
    //         id: "295197c2-d961-5167-b42f-04224227effe",
    //         claimDate: "Aug 21, 2021 22:13",
    //         unlockDate: "Aug 21, 2022 22:13",
    //         amount: 43006,
    //     }
    // ]

    //cause the design need hide all component includes sort area, so now rowsoverlay doesn't fit here
    return (
        <Box sx={{ mt: '20px' }}>
            <NoRowsOverlay
                hidden={rows.length > 0}
                noRowsTitle={<>You have no escrowed HZN. Stake HZN in<br/>order to earn staking rewards.</>}
                noRowsbtnTitle="STAKE NOW"
            />
            <Box sx={{ width: '100%', overflow: 'hidden', display: rows.length > 0 ? 'block' : 'none' }}>
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
            </Box >
            <Pagination {...{ mt: '18px' }} rowsCount={rows.length} currentPage={page} rowsPerPage={rowsPerPage} pageClick={(index) => {
                setPage(index - 1)
            }} />
        </Box>
    )
}
