import { formatUnits, parseEther } from "viem";

export const isValidInput = (input: string) => {
  if (input !== "" && !isNaN(+input) && parseFloat(input) !== 0) {
    try {
      parseEther(input as `${number}`);
    } catch (e) {
      return false;
    }
    return true;
  }
  return false;
};

export const isEnoughAllowance = (
  allowance: bigint | undefined,
  decimals: number | undefined,
  amount: `${number}`
) => {
  if (!allowance || !decimals) return false;
  if (!isValidInput(amount)) return false;
  const readableAllowance = formatUnits(allowance, decimals);
  return +readableAllowance >= +amount;
};

export const formatCurrency = (value: string | undefined) => {
  if (!value) return "0.00";
  if (isValidInput(value)) {
    const valueNumber = parseFloat(value);
    if (valueNumber < 0.01) {
      return "< 0.01";
    } else if (valueNumber > 100_000 && valueNumber < 1_000_000) {
      return (
        (valueNumber / 1_000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + "k"
      );
    } else if (valueNumber > 1_000_000) {
      return (
        (valueNumber / 1_000_000).toLocaleString("en-US", {
          maximumFractionDigits: 2,
        }) + "m"
      );
    } else {
      return valueNumber.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
    }
  } else return "0.00";
};
