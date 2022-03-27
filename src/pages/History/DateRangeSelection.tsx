import { Box, Popover, TextField } from "@mui/material";
import { BoxProps, height } from "@mui/system";
import { useEffect, useState } from "react";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import { COLOR, COLOR_BG } from "@utils/theme/constants";
import dropdown_arrow from "@assets/images/hitory-dropdown-arrow.png";
import { styled } from "@mui/material/styles";
// import { HistoryDateRange } from "@atoms/record";
import { useAtom } from "jotai";
import { HistoryRangeDateProps } from "./HistoryRecord";

const Img = styled("img")``;

interface SelectDateRangeProps{
    selectDateRange : (range: HistoryRangeDateProps) => void
}

export default function DateRangeSelection({selectDateRange, ...props}: BoxProps & SelectDateRangeProps) {

    const [value, setValue] = useState<DateRange<Date>>([null, null]);
    const [open, setOpen] = useState<boolean>(false)
    const [dateDropDown, setDateDropDown] = useState<boolean>(false);

    const dateContent = (start: string, end: string) => {
        if (start == '' && end == ''){
            return 'All Dates'
        }else{
            return `${start} - ${end}`
        }
    }

    return (
        <Box sx={{
            borderRadius: '4px',
        }}
            {...props}
        >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
                          // disabled={true}
                // disableOpenPicker={true}
                // loading={true}
                // okText="zzz"
                // mask="MMM d, yy | HH:mm"
                // getOpenDialogAriaText={(value, utils) => 
                //     `Choose date, selected date is ${utils.format(utils.date(value), 'fullDate')}`
                // }

                // leftArrowButtonText='dsds'
                // renderDay={(day)=> {
                //     return (
                //         <Box>day</Box>

                //     )
                // }}
                // clearable={true}
                // disableAutoMonthSwitching={true}
                // disableCloseOnSelect={false}
                // showToolbar={true}
                // disableMaskedInput={false}
                // showTodayButton={true}
                DialogProps={{
                    sx:{
                        backgroundColor:'red !important'
                    }
                }}
                
                open={open}
                onClose={() => {
                    setOpen(false)
                    setDateDropDown(false)
                }}
                showDaysOutsideCurrentMonth={true}
                calendars={1}
                maxDate={new Date()}
                inputFormat="MM/dd/yy"
                value={value}
                cancelText={''}
                okText={''}
                showToolbar={false}
                onChange={(newValue) => {
                    selectDateRange({start:newValue[0], end:newValue[1]})
                    setValue(newValue);
                }}
                renderInput={(startProps, endProps) => {
                    // console.log('========start/end========', {
                    //     startProps: startProps,
                    //     endProps: endProps
                    // })
                    return (
                        <Box onClick={() => {
                            setOpen(!open)
                            setDateDropDown(!dateDropDown)
                        }} sx={{
                            px: '20px',
                            borderRadius: '4px',
                            width: '100%',
                            height: '44px',
                            backgroundColor: '#0C1D2E',
                            fontSize: '12px',
                            letterSpacing: '0.5px',
                            color: COLOR.text,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            ":hover": {
                                backgroundColor: COLOR_BG,
                            },
                            cursor:'pointer',
                        }}>
                            {dateContent(startProps?.inputProps?.value,endProps?.inputProps?.value)}
                            <Img
                                sx={{
                                    opacity: dateDropDown ? 1 : 0.5,
                                    transform: dateDropDown ? "rotate(0deg)" : "rotate(180deg)",
                                    transition: "all .2s",
                                }} height='4px' width='6px' src={dropdown_arrow} />
                        </Box>
                    )
                }}
            />
        </LocalizationProvider>
        </Box>
    )
}