import BigNumber from "bignumber.js";
import numbro from "numbro";

numbro.setDefaults({
  thousandSeparated: true,
  mantissa: 2,
  // trimMantissa: true,
  roundingFunction: Math.floor,
});

export const formatRatioToPercent = (ratio: BigNumber) => {
  return ratio.gt(0) ? new BigNumber("100").div(ratio).toNumber() : 0;
};

export const formatBalance = (
  balance: BigNumber,
  format: numbro.Format = {}
) => {
  return numbro(balance).format({
    ...format,
  });
};
export const formatBigNumber = (bn: BigNumber, format: numbro.Format = {}) => {
  return numbro(bn.toString()).format({
    ...format,
  });
};

export const formatNumber = (value: number, format: numbro.Format = {}) => {
  return numbro(value).format({
    ...format,
  });
};

export const formatAddress = (address: string, size: number = 6) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
};
