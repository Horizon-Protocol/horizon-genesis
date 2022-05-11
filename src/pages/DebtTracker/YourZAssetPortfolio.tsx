import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { COLOR } from "@utils/theme/constants";
import Pagination from "@components/Pagination";
import { GridColDef } from "@mui/x-data-grid";
import CustomDataGrid from "@components/CustomDataGrid";
import {
  SortedDescendingIcon,
  SortedAscendingIcon,
  ColumnSelectorIcon,
} from "@components/TableSortIcon";
import NoRowsOverlay from "@components/NoRowsOverlay";
import useFilterZAssets from "@hooks/useFilterZAssets";
import { formatNumber, formatPercent } from "@utils/number";

const rowsPerPage = 100

export default function YourZAssetPortfolio() {
  const rows = useFilterZAssets({ zUSDIncluded: true });
  const [page, setPage] = useState(0)
  
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "zAsset",
      width: 75,
      editable: false,
      headerAlign: "left",
      renderCell({ value, row }) {
        return (
          <Typography
            sx={{
              fontSize: "12px",
              letterSpacing: "0.5px",
              color: COLOR.text,
            }}
          >
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
      headerAlign: "left",
      renderCell({ value, row }) {
        return (
          <Typography
            sx={{
              width: "100%",
              fontSize: "12px",
              letterSpacing: "0.5px",
              textAlign: "left",
              fontWeight: "bold",
              color: COLOR.text,
            }}
          >
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
      headerAlign: "left",
      renderCell({ value, row }) {
        return (
          <Typography
            sx={{
              fontSize: "12px",
              letterSpacing: "0.5px",
              color: COLOR.text,
              opacity: 0.5,
            }}
          >
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
      headerAlign: "right",
      renderCell({ value, row }) {
        return (
          <Typography
            sx={{
              fontSize: "12px",
              letterSpacing: "0.5px",
              color: COLOR.text,
            }}
          >
            {formatPercent(value)}%
          </Typography>
        );
      },
    },
  ];

  //cause the design need hide all component includes sort area, so now rowsoverlay doesn't fit here
  return (
    <Box sx={{ mt: "20px", width: "100%" }}>
      <NoRowsOverlay
        hidden={rows.length > 0}
        noRowsTitle={
          <>
            You have no escrowed HZN. Stake HZN in
            <br />
            order to earn staking rewards.
          </>
        }
        noRowsbtnTitle="STAKE NOW"
      />
      <Box
        sx={{
          width: "100%",
          height: '300px',
          overflow: "hidden",
          display: rows.length > 0 ? "block" : "none",
        }}
      >
        <CustomDataGrid
          columns={columns}
          rows={rows}
          page={page}
          // autoHeight
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
    </Box>
  );
}
