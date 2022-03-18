import { Box, BoxProps, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { BORDER_COLOR, COLOR } from "@utils/theme/constants";
import { useEffect, useState } from "react";
import { ReactComponent as IconPre } from "@assets/images/pagePre.svg";
import { ReactComponent as IconNext } from "@assets/images/pageNext.svg";
import SvgIcon from "@mui/material/SvgIcon";

interface PaginationProps {
    selected: boolean;
    pageNumber: number;
    isHeadEllipsis?: boolean;
    isTailEllipsis?: boolean;
}

interface TablePaginationProps {
    rowsCount: number;
    currentPage: number;
    rowsPerPage: number;
    pageClick: (index: number) => void
}

const StyledEllipsis = styled(Typography)({
    textAlign: 'center',
    width: '24px',
    height: '24px',
});

export default function Pagination({
    rowsCount,
    currentPage,
    rowsPerPage,
    pageClick,
    ...props
}: TablePaginationProps & BoxProps) {
    //max visible page
    const [selectedPageNumber, setSelectedPageNumber] = useState<number>(1)
    const [totalPageNumber, setTotalPageNumber] = useState<number>(1)

    const [paginationData, setPaginationData] = useState<PaginationProps[]>([])
    const [hiddenIndexPagination, setHiddenIndexPagination] = useState<number[]>([])
    const [showHeadEllipsis, setShowHeadEllipsis] = useState<boolean>(false)
    const [showTailEllipsis, setShowTailEllipsis] = useState<boolean>(false)

    useEffect(() => {
        const hiddenPagination: number[] = []
        const pagination: PaginationProps[] = []
        const totalPage = rowsCount % rowsPerPage == 0 ? (rowsCount / rowsPerPage) : (Math.floor(rowsCount / rowsPerPage) + 1)
        setTotalPageNumber(totalPage)
        for (let i = 1; i < totalPage + 1; i++) {
            const selected = i == 1
            const pageNumber = i
            pagination.push({ selected, pageNumber })
            if (i == 1) {
                const isHeadEllipsis = true
                pagination.push({ selected, pageNumber, isHeadEllipsis })
            }
            if (i == totalPage - 1) {
                const isTailEllipsis = true
                pagination.push({ selected, pageNumber, isTailEllipsis })
            }
        }
        setPaginationData(pagination)
        updateHiddenIndex(1)
    }, [])

    const updateHiddenIndex = (pageNumber: number) => {
        if (pageNumber > totalPageNumber || pageNumber < 1) return
        pageClick(pageNumber)

        setPaginationData(prev => {
            prev.forEach((element) => {
                element.selected = pageNumber == element.pageNumber
            });
            return prev
        })

        setSelectedPageNumber(pageNumber)
        const totalPage = rowsCount % rowsPerPage == 0 ? (rowsCount / rowsPerPage) : (Math.floor(rowsCount / rowsPerPage) + 1)

        const indexStart = 1
        const indexEnd = totalPage
        const indexLeft = pageNumber - 1
        const indexRight = pageNumber + 1

        const tempVisibleIndex: number[] = [indexStart, indexEnd, indexLeft, indexRight, pageNumber]

        const limitExtend = 2
        if (pageNumber == 1) tempVisibleIndex.push(pageNumber + limitExtend)
        if (pageNumber == totalPage) tempVisibleIndex.push(pageNumber - limitExtend)
        const visibleList = addVisibleIndex(tempVisibleIndex)

        setShowHeadEllipsis(visibleList.indexOf(2) == -1)
        setShowTailEllipsis(visibleList.indexOf(totalPage - 1) == -1)
        setHiddenIndexPagination(visibleList);
    }

    const addVisibleIndex = (pageNumbers: number[]) => {
        const visibleIndex: number[] = []
        pageNumbers.forEach(pageNumber => {
            if (pageNumber < 1) return
            if (pageNumber > rowsCount) return
            if (visibleIndex.indexOf(pageNumber) != -1) return
            visibleIndex.push(pageNumber)
        })
        return visibleIndex
    }

    return (
        <Box sx={{
            display: rowsCount > 0 ? 'flex' : 'none',
            flexDirection: 'row-reverse',
            width: "100%",
            height: 'auto',
        }}>
            <Box sx={{
                right: 0,
                display: 'flex',
                alignItems: 'center',
                flexDirection: "row"
            }}
                {...props}
            >
                <SvgIcon
                 onClick={()=>{
                    updateHiddenIndex(selectedPageNumber-1)
                }}
                    sx={{
                        opacity: selectedPageNumber == 1 ? 0.2 : 1,
                        cursor: selectedPageNumber == 1 ? 'none' : 'pointer',
                        height: 10,
                        marginRight: '10px'
                    }}
                >
                    <IconPre />
                </SvgIcon>
                {paginationData.map((item, index) => {
                    if (item.isHeadEllipsis != undefined) {
                        return <StyledEllipsis key={index} display={showHeadEllipsis ? 'block' : 'none'}>···</StyledEllipsis>
                    } else if (item.isTailEllipsis != undefined) {
                        return <StyledEllipsis key={index} display={showTailEllipsis ? 'block' : 'none'}>···</StyledEllipsis>
                    } else {
                        return (
                            <Box onClick={() => {
                                updateHiddenIndex(item.pageNumber)
                            }} sx={{
                                cursor: 'pointer',
                                display: hiddenIndexPagination.indexOf(item.pageNumber) != -1 ? 'block' : 'none',
                                width: '24px',
                                height: '24px',
                                backgroundColor: BORDER_COLOR,
                                color: item.selected ? COLOR.safe : "#FFFFF",
                                mr: '3px',
                                textAlign: 'center'
                            }} key={index}>
                                {item.pageNumber}
                            </Box>
                        )
                    }
                }
                )}
                <SvgIcon
                    onClick={()=>{
                        updateHiddenIndex(selectedPageNumber+1)
                    }}
                    sx={{
                        opacity: selectedPageNumber == totalPageNumber ? 0.2 : 1,
                        cursor: selectedPageNumber == totalPageNumber ? 'none' : 'pointer',
                        height: 10,
                    }}
                >
                    <IconNext />
                </SvgIcon>
            </Box>
        </Box>
    )
}