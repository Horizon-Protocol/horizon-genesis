import { Box, Typography, Link } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { COLOR } from "@utils/theme/constants";
import { GridColDef } from "@mui/x-data-grid";
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
import { historicalIsLoadingAtom, historicalOperationAtom, HistoryType } from "@atoms/record";
import dayjs from "dayjs";
import { formatNumber } from "@utils/number";
import { HistoricalOperationData } from "@hooks/query/useQueryDebt";
import { DateRange } from "@mui/lab/DateRangePicker/RangeTypes";
import { BlockExplorer } from "@utils/helper";
import { hznRateAtom } from "@atoms/exchangeRates";
import useWallet from "@hooks/useWallet";

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
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const dataRows = useMemo(() => {
    if (historicalOperationData) {
      const allDate =
        historyDateRange[0] == null && historyDateRange[1] == null;
      // console.log("===historicalOperationData",historicalOperationData)
      const rows = historicalOperationData
        .map((item) => {
          if (item.type != HistoryType.Claim) {
            // let value = Number(item.value)
            // let rateValue = hznRate.toNumber()
            // let rewards =  value / rateValue
            // console.log("value-rate",{
            //     value,
            //     rateValue,
            //     rewards
            // })
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
              "DD/MM/YYYY hh:mm"
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
          // console.log('===chooseStartend',{
          //     chooseStart:chooseStart,
          //     chooseEnd:chooseEnd,
          //     item:itemDate
          // })
          return allDate
            ? item
            : itemDate.isAfter(chooseStart) && itemDate.isBefore(chooseEnd);
        });
      console.log("计算结束",{
        historicalOperationData,
        historyType,
        allDate,
        rows
      })

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
      editable: false,
      headerAlign: "left",
      renderCell({ value, row }) {
        console.log(value)
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
          <Link
            href={BlockExplorer.txLink((value as string).split("-")[0])}
            target="_blank"
            underline="none"
          >
            <ActionLink>VIEW</ActionLink>
          </Link>
        );
      },
    },
  ];

  useEffect(()=>{
    // alert(historicalIsLoading)
  },[])

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
        <Box
          sx={{
            display: "flex",
            // flexWrap:'wrap',
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TypeSelection
            typeValue={historyType}
            selectType={(type) => {
              setHistoryType(type);
            }}
            {...{ width: "44%" }}
          />
          <DateRangeSelection
            dateRangeValue={historyDateRange}
            selectDateRange={(rangeDate: DateRange<Date>) => {
              if (rangeDate[0] && rangeDate[1]) {
                setHistoryDateRange(rangeDate);
              }
            }}
            {...{ width: "44%" }}
          />
          <Typography
            onClick={() => {
              setHistoryType(HistoryType.All);
              setHistoryDateRange([null, null]);
            }}
            sx={{
              width: "8%",
              fontSize: "12px",
              color: COLOR.safe,
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Clear
          </Typography>
        </Box>
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
                mt:'50px',
                textAlign:'center',
                width:"100%",
                fontSize: '14px',
                letterSpacing:'.5px',
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
