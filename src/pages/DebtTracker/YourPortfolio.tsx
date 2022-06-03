import { Box, BoxProps, Hidden, Typography } from "@mui/material";
import { COLOR } from "@utils/theme/constants";
import YourZAssetPortfolio from "./YourZAssetPortfolio";
import useFilterZAssets from "@hooks/useFilterZAssets";
import { sumBy } from "lodash";
import { formatNumber } from "@utils/number";

export default function YourPortfolio() {

    const zAssets = sumBy(useFilterZAssets({zUSDIncluded:true}),"amountUSD")

    return (
        <Box sx={{
            mt: {
                xs: 4,
                sm: 2,
            },
            width: {
                xs: '100%',
                sm: '340px',
            },
            height: "300px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: {
                xs:"rgba(16, 38, 55, 0.3)",
                md: 'transparent'
            },
            // ml: 'auto',
            mr: {
                xs: '0px',
                sm: '-50px',
            },
            pt:{
                xs: '15px',
                md: 0
            }
        }}
        >
            <Typography sx={{
                color: COLOR.text,
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '19px',
                letterSpacing: '1px',
            }}>YOUR PORTFOLIO
                <br />
                <span style={{
                    fontWeight: 'normal',
                    opacity: 0.5
                }}>Total zAsset Value: </span><span style={{
                    fontWeight: 'normal',
                    color: COLOR.safe
                }}>${formatNumber(zAssets)}</span>
            </Typography>
            <YourZAssetPortfolio/>
        </Box>
    )
}

interface ListItemProps {
    text: string[],
    props?: BoxProps[],
    index?: number
}

const ListItem = ({ text, props, index }: ListItemProps) => {
    return (
        <Box key={index} sx={{
            display: 'flex',
            width: '100%',
            height: '59px',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: index !== undefined ? index % 2 == 0 ? COLOR.bgColor : 'transparent' : 'transparent'
        }}>
            {text.map((item, index) =>
                <Typography key={index} sx={{
                    width: '25%',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#5D6588',
                    ...props?.[index]
                }}>
                    {item}
                </Typography>
            )}
        </Box>
    )
}