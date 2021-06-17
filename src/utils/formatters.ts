import { BigNumber } from "ethers";
import numbro from "numbro";

numbro.setDefaults({
  thousandSeparated: true,
  mantissa: 2,
  // trimMantissa: true,
  roundingFunction: Math.floor,
});

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
export const formatPrice = (value: number, format: numbro.Format = {}) => {
  return numbro(value).format({
    ...format,
  });
};

export const formatAddress = (address: string, size: number = 6) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
};
