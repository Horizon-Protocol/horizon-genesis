import { Box, BoxProps, SvgIcon } from "@mui/material";
import { ReactComponent as IconCheckbox } from "@assets/images/checkbox_icon.svg";
import { ReactComponent as IconCheckboxChecked } from "@assets/images/checkbox_iconchecked.svg";
import { ReactComponent as IconCheckboxCheckedAll } from "@assets/images/checkbox_iconchecked_all.svg";
import Tooltip from "@components/Tooltip";
import ToolTipContent from "@components/Tooltip/ToolTipContent";

export interface AuthCheckBoxProps {
    checked: boolean,
    isAll?: boolean,
    allChecked?: boolean,
    tooltipContent: string | JSX.Element,
    checkedTooltipContent: string | JSX.Element,
}

// checked

export default function AuthCheckBox({ checked, isAll = false, allChecked = false, tooltipContent, checkedTooltipContent, ...props }: AuthCheckBoxProps & BoxProps) {
    return (
        <Box
            sx={{
                width: '36px',
                height: '36px',
                backgroundColor: isAll ? 'rgba(8, 12, 22, 0.5)' : "transparent",
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center"
            }}
            {...props}
        >
            <Tooltip
                title={<ToolTipContent conetnt={checked ? checkedTooltipContent : tooltipContent} />}
                placement='top'
            >
                <SvgIcon sx={{ cursor: 'pointer', width: '16px', height: '16px' }}>
                    {checked ? (allChecked ? <IconCheckboxCheckedAll /> : <IconCheckboxChecked />) : <IconCheckbox />}
                </SvgIcon>
            </Tooltip>

        </Box>
    )

}