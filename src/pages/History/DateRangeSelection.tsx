import { Box, BoxProps } from "@mui/material";
import { useEffect, useState } from "react";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import { COLOR, COLOR_BG } from "@utils/theme/constants";
import dropdown_arrow from "@assets/images/hitory-dropdown-arrow.png";
import { styled } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./dateStyle.css";

const Img = styled("img")``;

interface SelectDateRangeProps{
    dateRangeValue: DateRange<Date>,
    selectDateRange : (range: DateRange<Date>) => void
}

export default function DateRangeSelection({dateRangeValue, selectDateRange, ...props}: BoxProps & SelectDateRangeProps) {

    const [open, setOpen] = useState<boolean>(false)
    const [dateDropDown, setDateDropDown] = useState<boolean>(false);

    const dateContent = (start: string, end: string) => {
        if (start == '' && end == ''){
            return 'All Dates'
        }else{
            return `${start} - ${end}`
        }
    }

    const leftArrow = () => {
        return (
            <SvgIcon
                sx={{
                  fontSize: '15px',
                  color:'white'
                }}
              >
                <ArrowBackIosNewIcon />
              </SvgIcon>
        )
    }
    
    const rightArrow = () => {
        return (
            <SvgIcon
                sx={{
                  fontSize: '15px',
                  color:'white'
                }}
              >
                <ArrowForwardIosIcon />
              </SvgIcon>
        )
    }

    return (
        <Box sx={{
            borderRadius: '4px',
        }}
            {...props}
        >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
                components={{
                    LeftArrowIcon: leftArrow,
                    RightArrowIcon: rightArrow
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
                value={dateRangeValue}
                cancelText={''}
                okText={''}
                showToolbar={false}
                onChange={selectDateRange}
                renderInput={(startProps, endProps) => {
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