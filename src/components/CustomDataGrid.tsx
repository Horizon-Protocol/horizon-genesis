import { styled } from "@mui/material/styles";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import { COLOR_BG, COLOR_BG_30 } from "@utils/theme/constants";

const StyledDataGrid = styled(DataGrid)(
  ({ theme: { palette } }) => `
border: none;
font-size: 12px;
letter-spacing: 0.5px;
.MuiDataGrid-columnHeaders {
  border: none;
  font-size: 12px;
}
.MuiDataGrid-columnHeaderTitleContainer {
  padding-left: 0;
  color: #5D6588;
}
.MuiDataGrid-columnHeadersInner,
.MuiDataGrid-sortIcon {
  color: ${palette.text.secondary};
}
.MuiDataGrid-columnHeader {
  &:focus, &:focus-within {
    outline: none !important;
  }
}
.MuiDataGrid-row {
  &:nth-of-type(2n+1) {
    background: ${COLOR_BG_30};
  }
  &:hover {
    background: ${COLOR_BG};
  }
}
.MuiDataGrid-cell {
  border: none;
  color: ${palette.text.secondary};
  &:focus,
  &:focus-within {
    outline: none !important;
  }
}
.MuiDataGrid-iconSeparator {
  display: none;
}
.MuiDataGrid-footerContainer {
  min-height: 0px;
}

`
);

export default function CustomDataGrid(props: DataGridProps) {
  return <StyledDataGrid scrollbarSize={4} {...props} />;
}
