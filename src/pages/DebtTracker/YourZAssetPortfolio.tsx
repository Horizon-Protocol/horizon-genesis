import { alpha, Box, BoxProps, TableCellProps, Typography } from "@mui/material";
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
import NoRowsOverlay from "@components/NoRowsOverlay";
import useFilterZAssets from "@hooks/useFilterZAssets";
import { formatNumber, formatPercent } from "@utils/number";
import { isNumber } from "lodash";


export default function YourZAssetPortfolio() {
    const rows = useFilterZAssets({zUSDIncluded:true})
    console.log('==========rows------',rows)

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
        field: "name",
        headerName: "zAsset",
        width: 75,
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
    }, 
   {
        field: "amount",
        headerName: "Balance",
        type: "number",
        width: 80,
        editable: false,
        headerAlign: 'left',
        renderCell({ value, row }) {
            return (
                <Typography sx={{
                    width:"100%",
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    textAlign:'left',
                    fontWeight: 'bold',
                    color: COLOR.text,
                }}>
                    {formatNumber(value)}
                </Typography>
            );
        },
    },
    {
        field: "amountUSD",
        headerName: "Value",
        width: 66,
        editable: false,
        headerAlign: 'left',
        renderCell({ value, row }) {
            return (
                <Typography sx={{
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: COLOR.text,
                    opacity: .5
                }}>
                    ${formatNumber(value)}
                </Typography>
            );
        },
    },
    {
        field: "percent",
        headerName: "Portfolio%",
        type: "number",
        width: 95,
        editable: false,
        headerAlign: 'right',
        renderCell({ value, row }) {
            return (
                <Typography sx={{
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    color: COLOR.text
                }}>
                    {formatPercent(value)}%
                </Typography>
            );
        },
    },
]

    //cause the design need hide all component includes sort area, so now rowsoverlay doesn't fit here
    return (
        <Box sx={{ mt: '20px', width:"100%" }}>
            <NoRowsOverlay
                hidden={rows.length > 0}
                noRowsTitle={<>You have no escrowed HZN. Stake HZN in<br/>order to earn staking rewards.</>}
                noRowsbtnTitle="STAKE NOW"
            />
            <Box sx={{  width: '100%', overflow: 'hidden', display: rows.length > 0 ? 'block' : 'none' }}>
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
