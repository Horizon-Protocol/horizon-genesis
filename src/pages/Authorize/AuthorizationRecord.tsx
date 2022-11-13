import { Box, Typography, Link, Grid, SvgIcon, Checkbox } from "@mui/material";
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
import NoRowsOverlay from "@components/NoRowsOverlay";
import { useAtomValue, useResetAtom } from "jotai/utils";
import { BlockExplorer } from "@utils/helper";
import useWallet from "@hooks/useWallet";
import ActionLink from "@components/Alerts/ActionLink";
import { useIsFetching } from "react-query";
import { GRAPH_AUTHORIZATION } from "@utils/queryKeys";
import { authorizationRecordAtom } from "./useQueryAuthorization";
import { formatAddress } from "@utils/formatters";
import { ReactComponent as IconCopy } from "@assets/images/copy.svg";
// import { ReactComponent as IconCheckbox } from "@assets/images/checkbox_icon.svg";
import { ReactComponent as IconCheckbox } from "@assets/images/checkbox_icon.svg";
import { ReactComponent as IconCheckboxChecked } from "@assets/images/checkbox_iconchecked.svg";
import AuthCheckBox from "./AuthCheckBox";
import { cloneDeep, remove } from "lodash";
import Tooltip from "@components/Tooltip";
import ToolTipContent from "@components/Tooltip/ToolTipContent";
import copy from 'copy-to-clipboard';
import { ReactComponent as IconNoData } from "@assets/images/nodata.svg";
import useDisconnected from "@hooks/useDisconnected";

const COLUMN_WIDTH = 70

export interface AuthorizationRecordProps {
  onCheckBoxClick: (name: string, selectd: boolean, address: string) => void
}

export default function AuthorizationRecord({ onCheckBoxClick }: AuthorizationRecordProps) {
  const { connected } = useWallet();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState<boolean>(true);
  const isFetching = useIsFetching([GRAPH_AUTHORIZATION]);

  const authorizationRecord = useAtomValue(authorizationRecordAtom);

  const dataRows = useMemo(() => {
    if (authorizationRecord) {
      authorizationRecord.forEach(auth => {
        if (auth.canBurn && auth.canClaim && auth.canExchange && auth.canMint) {
          auth.all = true
        }
      });
      let deep = cloneDeep(authorizationRecord)
      remove(deep, (item) => !item.canMint && !item.canBurn && !item.canClaim && !item.canExchange)
      console.log('authorizationRecord',deep)
      return deep;
    } else {
      return [];
    }
  }, [authorizationRecord]);

  const columns: GridColDef[] = [
    {
      field: "delegate",
      headerName: "Address",
      width: 110,
      sortable: false,
      editable: false,
      headerAlign: "left",
      renderCell({ value, row }) {
        return <Box sx={{ w: 110, display: 'flex', alignItems: 'center' }}>{formatAddress(value, 5, 4)}
          <Tooltip
            clickAble
            tooltipWidth={130}
            title={
              <ToolTipContent title='Address Copied' conetnt={''} />
            }
            placement='top'
          >
            <SvgIcon onClick={()=>{
              copy(value)
            }} sx={{ cursor:'pointer', width: 10, ml: '4px' }} > <IconCopy /> </SvgIcon>
          </Tooltip>
        </Box>;
      },
    },
    {
      field: "all",
      headerName: "All",
      width: 60,
      sortable: false,
      editable: false,
      headerAlign: "center",
      renderCell({ value, row }) {
        return (
          <AuthCheckBox
            tooltipContent="Authorize All operations"
            checkedTooltipContent="Withraw All operations"
            onClick={() => {
              onCheckBoxClick('all', value, row.delegate)
            }} isAll={true} checked={value} />
        );
      },
    },
    {
      field: "canMint",
      headerName: "Mint",
      width: 60,
      sortable: false,
      editable: false,
      headerAlign: "center",
      renderCell({ value, row }) {
        return (
          <AuthCheckBox
            tooltipContent="Authorize the Mint operation"
            checkedTooltipContent="Withdraw the Mint operation"
            onClick={() => {
              if (value && row.all) return
              onCheckBoxClick('canMint', value, row.delegate)
            }} checked={value} allChecked={row.all} />
        );
      },
    },
    {
      field: "canBurn",
      headerName: "Burn",
      width: 60,
      sortable: false,
      editable: false,
      headerAlign: "center",
      renderCell({ value, row }) {
        return (
          <AuthCheckBox
            tooltipContent="Authorize the Burn operation"
            checkedTooltipContent="Withdraw the Burn operation"
            onClick={() => {
              if (value && row.all) return
              onCheckBoxClick('canBurn', value, row.delegate)
            }} checked={value} allChecked={row.all} />
        );
      },
    },
    {
      field: "canClaim",
      headerName: "Claim",
      width: 65,
      sortable: false,
      editable: false,
      headerAlign: "center",
      renderCell({ value, row }) {
        return (
          <AuthCheckBox
            tooltipContent="Authorize the Claim operation"
            checkedTooltipContent="Withdraw the Claim operation"
            onClick={() => {
              if (value && row.all) return
              onCheckBoxClick('canClaim', value, row.delegate)
            }} checked={value} allChecked={row.all} />
        );
      },
    },
    {
      field: "canExchange",
      headerName: "Trade",
      width: 60,
      sortable: false,
      editable: false,
      headerAlign: "center",
      renderCell({ value, row }) {
        return (
          <AuthCheckBox
            tooltipContent="Authorize the Trade operation"
            checkedTooltipContent="Withdraw the Trade operation"
            onClick={() => {
              if (value && row.all) return
              onCheckBoxClick('canExchange', value, row.delegate)
            }} checked={value} allChecked={row.all} />
        );
      },
    },
    {
      field: "remove",
      headerName: "",
      width: 60,
      sortable: false,
      editable: false,
      headerAlign: "center",
      renderCell({ value, row }) {
        return (
          <Tooltip
            title={<ToolTipContent conetnt={'Withraw All operations'} />}
            placement='top'
          >
            <Box onClick={()=>{
                onCheckBoxClick('all', true, row.delegate)
            }} sx={{ cursor: 'pointer', color: COLOR.safe, fontSize: '10px', fontWeight: 'bold' }}>REMOVE</Box>
          </Tooltip>
        );
      },
    },
  ];

  const showLoading = useMemo(() => {
    if (authorizationRecord != null && authorizationRecord?.length > 0) {
      return false
    } else {
      return isFetching > 0
    }
  }, [isFetching])

  return (
    <Box>
      {/* <NoRowsOverlay
        hidden={dataRows.length > 0}
        // noRowsTitle={
        //   <>
        //     You have no escrowed HZN. Stake HZN in
        //     <br />
        //     order to earn staking rewards.
        //   </>
        // }
        // noRowsbtnTitle="STAKE NOW"
        noRowsRender={<Box sx={{
          display:'flex', 
          alignItems:'center',
          mt: '30px',
          opacity: 0.2,

          }}>
          <SvgIcon
                    sx={{
                        width: '24px',
                        color: "text.primary",
                      
                    }}
                >
                    <IconNoData />
                </SvgIcon>
                <Typography sx={{
          fontSize:'12px',
          fontWeight:700,
          color: COLOR.text,
          ml: '9px'
          }}></Typography>
            No zAssets 
          </Box>}
      /> */}
      <Box
        sx={{
          display:
            connected ?

              isFetching ? "block" :
                authorizationRecord != null &&
                  authorizationRecord.length > 0 ? "block" : "block"

              : "none"
        }}
      >
        <Box sx={{ mt: "20px", width: "100%", overflow: "hidden" }}>
          <CustomDataGrid
            loading={showLoading}
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
                mt: '75px',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                textAlign: 'center',
                width: "100%",
                fontSize: '14px',
                letterSpacing: '.5px',
                fontWeight: 'bold',
                color: COLOR.text,
                opacity: .2
              }}><SvgIcon
              sx={{
                  width: '24px',
                  color: "text.primary",
                  mr: '8px'
              }}
          >
              <IconNoData />
          </SvgIcon>No Authorized Addresses </Box>
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
