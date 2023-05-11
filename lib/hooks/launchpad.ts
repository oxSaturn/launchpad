import { useAccount, useNetwork, useBalance } from "wagmi";
import { formatUnits } from "viem";
import {
  useErc20Allowance,
  useErc20Approve,
  useErc20Decimals,
  useErc20Symbol,
  useFairAuctionBuy,
  useFairAuctionClaim,
  useFairAuctionGetExpectedClaimAmount,
  useFairAuctionGetRemainingTime,
  useFairAuctionHasEnded,
  useFairAuctionHasStarted,
  useFairAuctionMaxProjectTokensToDistribute,
  useFairAuctionMaxRaise,
  useFairAuctionMinTotalRaisedForMaxProjectToken,
  useFairAuctionProjectToken,
  useFairAuctionSaleToken,
  useFairAuctionTotalRaised,
  useFairAuctionUserInfo,
  usePrepareErc20Approve,
  usePrepareFairAuctionBuy,
  usePrepareFairAuctionClaim,
} from "../generated/wagmiGen";

export const useTimeAndPrice = (saleTokenDecimals: number | undefined) => {
  const { data: totalRaised } = useFairAuctionTotalRaised({
    enabled: !!saleTokenDecimals,
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
