import { Box, BoxProps, TableCellProps, Typography } from "@mui/material";
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
import { useAtomValue } from "jotai/utils";
import { rewardsEscrowAtom } from "@atoms/record";
import { BNWithDecimals, formatNumber } from "@utils/number";
import dayjs from "dayjs";

interface RowsData {
  id?: string;
  claimDate: string;
  unlockDate: string;
  amount: string | JSX.Element;
}

function createData(
  claimDate: string,
  unlockDate: string,
  amount: string | JSX.Element
): RowsData {
  return { claimDate, unlockDate, amount };
}

export default function EscrowRecord() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const rewardsEscrow = useAtomValue(rewardsEscrowAtom);
  const rows = rewardsEscrow?.schedule
    ? rewardsEscrow?.schedule?.map((item, index) => {
        return {
          id: formatNumber(item.entryID),
          unlockDate: dayjs(Number(item.endTime) * 1000).format(
            "MMM DD, YYYY hh:mm"
          ),
          claimDate: dayjs(Number(item.endTime) * 1000)
            .subtract(52, "w")
            .format("MMM DD, YYYY hh:mm"),
          amount: formatNumber(BNWithDecimals(item.escrowAmount)),
        };
      })
    : [];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns: GridColDef[] = [
    {
      field: "claimDate",
      headerName: "Claim Date (UTC)",
      width: 190,
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
      field: "unlockDate",
      headerName: "Unlock Date",
      width: 140,
      editable: false,
      headerAlign: "left",
      renderCell({ value, row }) {
        return (
          <Typography
            sx={{
              fontSize: "12px",
              letterSpacing: "0.5px",
              color: COLOR.safe,
            }}
          >
            {value}
          </Typography>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 130,
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
            {value}
            <span
              style={{
                marginLeft: "4px",
                opacity: 0.5,
              }}
            >
              HZN
            </span>
          </Typography>
        );
      },
    },
  ];

  //cause the design need hide all component includes sort area, so now rowsoverlay doesn't fit here
  return (
    <Box sx={{ mt: "20px" }}>
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
          overflow: "hidden",
          display: rows.length > 0 ? "block" : "none",
        }}
      >
        <CustomDataGrid
          columns={columns}
          rows={rows}
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
          }}
        />
      </Box>
      <Pagination
        hidden={true}
        {...{ mt: "18px" }}
        rowsCount={rows.length}
        currentPage={page}
        rowsPerPage={rowsPerPage}
        pageClick={(index) => {
          setPage(index - 1);
        }}
      />
    </Box>
  );
}
