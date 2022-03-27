import { capitalize, uniq } from "lodash";
import horizon from "@lib/horizon";

export enum zAssets {
  zUSD = "zUSD",
}

declare global {
  type zAssetsEnum = zAssets;
}

const FullNameFix: { [k: string]: string } = {
  zCAKE: "PancakeSwap",
  zETH: "Ethereum",
  zMATIC: "Polygon",
};

// export interface PortfolioRow extends Synth {
//   id: CurrencyKey;
//   amount: number;
//   amountUSD: number;
//   percent: number;
//   color: string;
// }

export const getCurrencyKeys: () => CurrencyKey[] = () => {
  return horizon.js?.synths?.map(({ name }) => name) || [];
};

export const getZAssetName = (currencyKey: string) => {
  return horizon.synthsMap?.[currencyKey]?.name || "";
};
export const getZAssetFullName = (currencyKey: string) => {
  return (
    FullNameFix[currencyKey] ||
    horizon.synthsMap?.[currencyKey]?.description ||
    ""
  );
};

export const getCategories = () => {
  const allCategory = uniq(
    horizon.js?.synths
      ?.filter(({ name }) => name !== "zUSD")
      .map(({ category }) => category)
  );
  return [
    { label: "All", value: "" },
    ...allCategory.map((v) => ({
      label: capitalize(v),
      value: v,
    })),
  ];
};