import { useEffect, useState } from "react";
import { useAccount, useNetwork, useBalance } from "wagmi";
import { formatUnits } from "viem";
import {
  useErc20Decimals,
  useErc20Symbol,
  useFairAuctionGetRemainingTime,
  useFairAuctionHasEnded,
  useFairAuctionHasStarted,
  useFairAuctionMaxProjectTokensToDistribute,
  useFairAuctionMaxRaise,
  useFairAuctionMinTotalRaisedForMaxProjectToken,
  useFairAuctionProjectToken,
  useFairAuctionSaleToken,
  useFairAuctionTotalRaised,
} from "../generated/wagmiGen";

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const useTimeAndPrice = (saleTokenDecimals: number | undefined) => {
  const { data: totalRaised } = useFairAuctionTotalRaised({
    enabled: !!saleTokenDecimals,
    watch: true,
  });
  const { data: hasStarted } = useFairAuctionHasStarted();
  const { data: hasEnded } = useFairAuctionHasEnded();
  const { data: remainingTime } = useFairAuctionGetRemainingTime();
  const { data: tokensToDistribute } =
    useFairAuctionMaxProjectTokensToDistribute();
  const { data: minSaleTokensToRaise } =
    useFairAuctionMinTotalRaisedForMaxProjectToken();
  const { data: maxRaiseAmount } = useFairAuctionMaxRaise();

  if (
    !totalRaised ||
    !tokensToDistribute ||
    !minSaleTokensToRaise ||
    !maxRaiseAmount ||
    !saleTokenDecimals
  ) {
    return {
      hasEnded,
      hasStarted,
      remainingTime,
      tokenPrice: undefined,
    };
  }

  const tokenPrice =
    totalRaised <= minSaleTokensToRaise
      ? minSaleTokensToRaise / tokensToDistribute
      : totalRaised / tokensToDistribute;

  return {
    hasEnded,
    hasStarted,
    remainingTime,
    tokenPrice: formatUnits(tokenPrice, saleTokenDecimals),
  };
};

export const useSaleTokenData = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: saleTokenAddress } = useFairAuctionSaleToken({
    enabled: !!address && !chain?.unsupported,
  });
  const { data: saleTokenSymbol } = useErc20Symbol({
    address: saleTokenAddress,
  });
  const { data: saleTokenDecimals } = useErc20Decimals({
    address: saleTokenAddress,
  });
  const { data: saleTokenBalance } = useBalance({
    address,
    token: saleTokenAddress,
    watch: true,
  });
  return {
    saleTokenAddress,
    saleTokenSymbol,
    saleTokenDecimals,
    saleTokenBalance,
  };
};

export const useProjectTokenData = () => {
  const { chain } = useNetwork();

  const { data: projectTokenAddress } = useFairAuctionProjectToken({
    enabled: !chain?.unsupported,
  });
  const { data: projectTokenSymbol } = useErc20Symbol({
    address: projectTokenAddress,
    enabled: !!projectTokenAddress,
  });
  const { data: projectTokenDecimals } = useErc20Decimals({
    address: projectTokenAddress,
    enabled: !!projectTokenAddress,
  });

  return {
    projectTokenAddress,
    projectTokenSymbol,
    projectTokenDecimals,
  };
};

export function useTimer(_deadline: bigint | undefined, interval = SECOND) {
  const deadline = _deadline ? Number(_deadline) : 0;
  const [timeLeft, setTimeLeft] = useState(deadline * 1000);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - SECOND);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [deadline, interval]);

  return {
    days: Math.floor(timeLeft / DAY),
    hours: Math.floor((timeLeft / HOUR) % 24),
    minutes: Math.floor((timeLeft / MINUTE) % 60),
    seconds: Math.floor((timeLeft / SECOND) % 60),
  };
}
