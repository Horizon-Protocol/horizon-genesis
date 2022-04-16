import { Box, BoxProps, TextField, TextFieldProps } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { COLOR, COLOR_BG } from "@utils/theme/constants";
import dropdown_arrow from "@assets/images/hitory-dropdown-arrow.png";
import { styled } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./dateStyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const Img = styled("img")``;

interface SelectDateRangeProps {
    dateRangeValue: any,
    selectDateRange: (range: [(Date | null), (Date | null)]) => void
}

export default function DateRangeSelection({ dateRangeValue, selectDateRange, ...props }: BoxProps & SelectDateRangeProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [dateDropDown, setDateDropDown] = useState<boolean>(false);

    const [dateRange, setDateRange] = useState<[(Date | null), (Date | null)]>([null, null]);
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        setDateRange(dateRangeValue)
    }, [dateRangeValue])

    const start = dateRange[0] ? dayjs(dateRange[0]).format('MM/DD/YY') : ''
    const end = dateRange[1] ? dayjs(dateRange[1]).format('MM/DD/YY') : ''

    const CustomInput = forwardRef((props, ref) => {
        // props.onClick: ƒ ()
        // props.value: "04/21/2022 - 04/22/2022"
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
                cursor: 'pointer',
            }}>
                {dateContent(start, end)}
                <Img
                    sx={{
                        opacity: dateDropDown ? 1 : 0.5,
                        transform: dateDropDown ? "none" : "rotate(180deg)",
                        transition: "all .2s",
                    }} height='4px' width='6px' src={dropdown_arrow} />
            </Box>
        )
    });


    const dateContent = (start: string, end: string) => {
        if (start == '' && end == '') {
            return 'All Dates'
        } else {
            return `${start} - ${end}`
        }
    }

    const leftArrow = () => {
        return (
            <Box
                sx={{
                    height: '20px',
                    width: '30px',
                    backgroundColor: 'red',
                    fontSize: '15px',
                    color: 'white'
                }}
            >
                {/* <ArrowBackIosNewIcon /> */}
            </Box>
        )
    }

    const rightArrow = () => {
        return (
            <SvgIcon
                sx={{
                    fontSize: '151px',
                    color: 'red'
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
            <DatePicker
                open={open}
                // showPreviousMonths={false}
                // previousMonthAriaLabel="dsds"
                // previousMonthButtonLabel={leftArrow()}
                // previousMonthButtonLabel={leftArrow()}
                // nextMonthButtonLabel={rightArrow()}
                showPopperArrow={false}
                onClickOutside={() => {
                    setOpen(false)
                    setDateDropDown(false)
                }}
                maxDate={new Date()}
                onCalendarClose={() => {
                    setOpen(false)
                    setDateDropDown(false)
                }}
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                    if (update[0] != null && update[1] != null) {
                        setOpen(false)
                        setDateDropDown(false)
                    }
                    selectDateRange(update)
                    setDateRange(update);
                }}
                customInput={<CustomInput />}
            />
        </Box>
    )
}


