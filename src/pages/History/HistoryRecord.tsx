import { Box, Typography, Link, Grid } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { COLOR } from "@utils/theme/constants";
import { GridColDef } from "@mui/x-data-grid";
import CustomDataGrid from "@components/CustomDataGrid";
import {
  SortedDescendingIcon,
  SortedAscendingIcon,
  ColumnSelectorIcon,
} from "@components/TableSortIcon";
import Pagination from "@components/Pagination";
import TypeCell from "./TypeCell";
import ActionLink from "@components/Alerts/ActionLink";
import NoRowsOverlay from "@components/NoRowsOverlay";
import DateRangeSelection from "./DateRangeSelection";
import TypeSelection from "./TypeSelection";
import { useAtomValue } from "jotai/utils";
import { historicalIsLoadingAtom, historicalOperationAtom, HistoryType } from "@atoms/record";
import dayjs from "dayjs";
import { formatNumber } from "@utils/number";
import { BlockExplorer } from "@utils/helper";
import { hznRateAtom } from "@atoms/exchangeRates";
import useWallet from "@hooks/useWallet";
import { DateRange } from "@mui/x-date-pickers-pro";
import useQueryDebt from "@hooks/query/useQueryDebt";
import useQueryGlobalDebt from "@hooks/query/useQueryGlobalDebt";
interface HistoryDataProps {
  id: string;
  type: HistoryType;
  timestamp: string;
  date: string;
  amount: {
    value: string;
    rewards: string;
  };
}

export interface HistoryRangeDateProps {
  start: string;
  end: string;
}

export default function HistoryRecord() {
  const { connected } = useWallet();
  const historicalIsLoading = useAtomValue(historicalIsLoadingAtom)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const historicalOperationData = useAtomValue(historicalOperationAtom);
  const [historyType, setHistoryType] = useState<HistoryType>(HistoryType.All);
  const [historyDateRange, setHistoryDateRange] = useState<DateRange<Date>>([
    null,
    null,
  ]);

  const [loading, setLoading] = useState<boolean>(true);
  const hznRate = useAtomValue(hznRateAtom);

  const chooseStart = dayjs(historyDateRange[0]);
  const chooseEnd = dayjs(historyDateRange[1]);

  const clearDisable = useMemo(()=>{
     return historyType === HistoryType.All && historyDateRange[0] == null && historyDateRange[1] == null
  },[historyType,historyDateRange])

  const dataRows = useMemo(() => {
    if (historicalOperationData) {
      const allDate =
        historyDateRange[0] == null && historyDateRange[1] == null;
      // console.log("===historicalOperationData",historicalOperationData)
      const rows = historicalOperationData
        .map((item) => {
          if (item.type != HistoryType.Claim) {
            item.rewards = (Number(item.value) / hznRate.toNumber()).toString();
          }
          let valueprefix = "";
          let rewardsprefix = "";
          if (item.type == HistoryType.Mint) {
            valueprefix = "+";
            rewardsprefix = "-";
          }
          if (item.type == HistoryType.Burn) {
            valueprefix = "-";
            rewardsprefix = "+";
          }
          if (item.type == HistoryType.Claim) {
            valueprefix = "+";
            rewardsprefix = "+";
          }
          return {
            id: item.id,
            type: item.type,
            timestamp: item.timestamp,
            date: dayjs(Number(item.timestamp) * 1000).format(
              "MMM DD, YYYY hh:mm"
            ),
            amount: {
              type: item.type,
              value: valueprefix + formatNumber(item.value ?? 0),
              rewards: rewardsprefix + formatNumber(item.rewards ?? 0),
            },
          };
        })
        .reverse()
        .filter((item) => {
          return historyType == HistoryType.All
            ? item
            : item.type == historyType;
        })
        .filter((item) => {
          const itemDate = dayjs(Number(item.timestamp) * 1000);
          return allDate
            ? item
            : itemDate.isAfter(chooseStart) && itemDate.isBefore(chooseEnd);
        });
      setLoading(false);
      return rows;
    } else {
      return [];
    }
  }, [historicalOperationData, historyType, historyDateRange, hznRate]);

  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      width: 90,
      editable: false,
      headerAlign: "left",
      renderCell({ value, row }) {
        return <TypeCell historyType={value} />;
      },
    },
    {
      field: "date",
      headerName: "Date (UTC)",
      width: 180,
      sortable: false,
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
      headerName: "Amount",
      width: 120,
      sortable: false,
      editable: false,
      headerAlign: "left",
      renderCell({ value, row }) {
        return (
          <Typography
            sx={{
              fontSize: "10px",
              letterSpacing: "0.5px",
              color: COLOR.text,
              wordSpacing: "0.5px",
              lineHeight: "14px",
            }}
          >
            {value.type == HistoryType.Claim && <>
              {value.rewards}
              <Box component="span" sx={{ ml: "4px", opacity: 0.5 }}>
                HZN
              </Box>
              <br />
            </>}
            {value.value}
            <Box component="span" sx={{ ml: "4px", opacity: 0.5 }}>
              zUSD
            </Box>
          </Typography>
        );
      },
    },
    {
      field: "id",
      headerName: "Tx",
      type: "number",
      sortable: false,
      width: 80,
      editable: false,
      headerAlign: "center",
      renderCell({ value, row }) {
        return (
            <ActionLink target="_blank" href={BlockExplorer.txLink((value as string).split("-")[0])}>VIEW</ActionLink>
        );
      },
    },
  ];

  return (
    <Box>
      <NoRowsOverlay
        hidden={
          historicalIsLoading ? true : historicalOperationData != null && historicalOperationData?.length > 0
        }
        noRowsTitle={
          <>
            You have no transactions. Start by staking
            <br />
            HZN and minting zUSD.
          </>
        }
        noRowsbtnTitle="STAKE NOW"
      />
      <Box
        sx={{
          display:
            connected ?

              historicalIsLoading ? "block" :
                historicalOperationData != null &&
                  historicalOperationData.length > 0 ? "block" : "none"

              : "none"
        }}
      >
        <Grid container columnSpacing={{xs:'1px',md:'10px'}} alignItems='center'
          sx={{
            width:'100%',
            // backgroundColor:'red'
          }}
        >
          <Grid item md={5} xs={5.5}>
          <TypeSelection
            typeValue={historyType}
            selectType={(type) => {
              setHistoryType(type);
            }}
          />
          </Grid>
          <Grid item md={6} xs={6.5}>
          <DateRangeSelection
            dateRangeValue={historyDateRange}
            selectDateRange={(rangeDate: DateRange<Date>) => {
              if (rangeDate[0] && rangeDate[1]) {
                setHistoryDateRange(rangeDate);
              }
            }}
          />
          </Grid>
          <Grid item md={1} xs={12}>
          <Typography
            onClick={() => {
              setHistoryType(HistoryType.All);
              setHistoryDateRange([null, null]);
            }}
            sx={{
              textAlign:'center',
              fontSize: "12px",
              color: COLOR.safe,
              opacity: clearDisable ? .2 : 1,
              fontWeight: "700",
              cursor: "pointer",
              mt:{xs:'15px',md:0}
            }}
          >
            Clear
          </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: "20px", width: "100%", overflow: "hidden" }}>
          <CustomDataGrid
            loading={historicalIsLoading}
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
              NoRowsOverlay: () => <Box sx={{
                mt: '50px',
                textAlign: 'center',
                width: "100%",
                fontSize: '14px',
                letterSpacing: '.5px',
                fontWeight: 'bold',
                color: COLOR.text,
                opacity: .2,
              }}>No Data Found</Box>
            }}
          />
        </Box>
        <Pagination
          {...{ mt: "18px" }}
          rowsCount={dataRows.length}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          pageClick={(index) => {
            setPage(index - 1);
          }}
        />
      </Box>
    </Box>
  );
}
