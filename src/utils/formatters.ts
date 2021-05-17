import { BigNumber, utils } from "ethers";
import numbro from "numbro";

numbro.setDefaults({
  thousandSeparated: true,
  mantissa: 2,
  // trimMantissa: true,
  roundingFunction: Math.floor,
});

export const getFullDisplayBalance = (
  balance: BigNumber,
  format: numbro.Format = {}
) => {
  return numbro(utils.formatEther(balance)).format({
    ...format,
  });
};

export const formatNumber = (value: number, format: numbro.Format = {}) => {
  return numbro(value).format({
    ...format,
  });
};

export const formatAddress = (address: string, size: number = 8) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
};
