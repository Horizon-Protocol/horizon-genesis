import { useMemo } from "react";
import { alpha } from "@mui/material/styles";
import { VictoryPie, VictoryTooltip, FlyoutProps } from "victory";
import Logo from "@assets/bgs/hzn.png";
import useWallet from "@hooks/useWallet";
import { getZAssetName } from "@utils/zAssets";
import { COLOR, PORTFOLIO_COLORS } from "@utils/theme/constants";
import { formatPercent, formatNumber } from "@utils/number";
import { GlobalSupplyDataProps } from "@hooks/useFetchGlobalZAsset";

interface Datum  {
  x?: CurrencyKey | string,
  y?: number
}

interface Props {
  rows: GlobalSupplyDataProps[] | [];
}
export default function PieChart({ rows }: Props) {
  const { connected } = useWallet();

  console.log('======piechart=====', rows)

  const chartRows = useMemo<Datum[]>(
    () =>
      rows.map((r) => ({
        // ...r,
        x: r.name,
        y: r.percent,
      })),
    [rows]
  );

  return (
    <svg
      width={220}
      height={220}
      style={{
        // backgroundColor:'red',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
      }}
    >
      {/* <image
        href={Logo}
        x={113.5}
        y={93.5}
        r={50}
        height={"73px"}
        width={"73px"}
      /> */}
      <g transform="translate(0,0)" width={220} height={220}>
        <VictoryPie
          standalone={false}
          width={220}
          height={220}
          innerRadius={85} //中心空
          labels={() => null}
          // labelComponent={
          //   connected && chartRows.length > 0 ? (
          //     <VictoryTooltip
          //       constrainToVisibleArea
          //       flyoutComponent={<CustomFlyout />}
          //       renderInPortal
          //       text=""
          //     />
          //   ) : undefined
          // }
          cornerRadius={0}
          data={
            connected && chartRows.length > 0
              ? chartRows
              : [{ x: "bc", y: 100 }]
          }
          colorScale={
            connected && chartRows.length > 0
              ? PORTFOLIO_COLORS
              : ["rgb(12,30,47)"]
          }
        />
      </g>
    </svg>
  );
}

// interface CustomFlyoutProps extends FlyoutProps {
//   datum?: Datum;
// }

// function CustomFlyout({ x, y, datum, dx, dy }: CustomFlyoutProps) {
//   const amountLabel = `$ ${formatNumber(datum?.amountUSD ?? 0)}`;
//   const amountLength = amountLabel.length;

//   return (
//     <g style={{ pointerEvents: "none" }} tabIndex={999}>
//       <rect
//         x={x! - 40}
//         y={y! - 50}
//         width={170 + amountLength * 1.5}
//         dx={dx}
//         dy={dy}
//         height="44"
//         rx="4.5"
//         fill="#111D2E"
//         stroke="rgba(180, 224, 255, 0.1)"
//         style={{
//           background: "#111D2E",
//         }}
//       />
//       {datum?.id && (
//         <image
//           xlinkHref={`/zassets/${datum.id}.svg`}
//           width="20"
//           height="20"
//           x={x! - 30}
//           y={y! - 40}
//         ></image>
//       )}
//       <text
//         x={x! - 0}
//         y={y! - 30}
//         fontSize="14"
//         fontWeight="bold"
//         fill={COLOR.text}
//       >
//         {getZAssetName(datum!.id!)}
//       </text>
//       <text
//         x={x! + 75}
//         y={y! - 30}
//         fontSize="14"
//         fontWeight="bold"
//         fill={COLOR.safe}
//       >
//         {formatPercent(datum?.percent ?? 0)}%
//       </text>
//       <text
//         x={x! - 0}
//         y={y! - 17}
//         fontSize="10"
//         fontWeight="bold"
//         fill={alpha(COLOR.text, 0.5)}
//       >
//         {datum?.id}
//       </text>
//       <text
//         x={x! + 70}
//         y={y! - 17}
//         fontSize="10"
//         fontWeight="bold"
//         fill="#868C97"
//       >
//         $ {formatNumber(datum?.amountUSD ?? 0)}
//       </text>
//     </g>
//   );
// }
