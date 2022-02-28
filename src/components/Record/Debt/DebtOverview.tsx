
import { Typography } from "@mui/material";
import { bgcolor, Box } from "@mui/system";
import { formatNumber } from "@utils/number";
import { toBN } from "@utils/number";
import { BigNumber } from "ethers";
import { COLOR } from "@utils/theme/constants";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";

export default function DebtOverview(){

    const dets = useMemo(()=>{
        return [
            toBN(1),
            toBN(2),
            toBN(3)
        ]
    },[])

    return (
        <Box sx={{
            display:"flex",
            width:"100%",
            justifyContent:"space-between",
        }}>
            {dets.map((debt,index) => 
                <Typography key={index} sx={{
                    py:'22px',
                    backgroundColor: alpha(COLOR.bgColor,1),
                    width:"32%",
                    textAlign:"center",
                    color:["#3377FF",COLOR.safe,COLOR.warning][index],
                    fontSize:"18px",
                    fontWeight:"bold",
                    letterSpacing:"0.5px",
                    lineHeight: "20px"
                }}>
                    <span style={{
                        color: COLOR.text,
                        fontSize: "12px",
                        fontWeight:"normal"
                    }}>{["ACTIVE DEBT","ISSUED DEBT","GLOBAL DEBT"][index]}</span><br/>
                    ${formatNumber(debt)}
                </Typography>
            )}
        </Box>
    )
}