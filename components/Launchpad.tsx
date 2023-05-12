import { useState } from "react";
import Image from "next/image";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import * as Toast from "@radix-ui/react-toast";
import { formatUnits, parseEther, parseUnits, zeroAddress } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import {
  useErc20Allowance,
  useErc20Approve,
  useFairAuctionBuy,
  useFairAuctionClaim,
  useFairAuctionGetExpectedClaimAmount,
  useFairAuctionTotalRaised,
  useFairAuctionUserInfo,
  usePrepareErc20Approve,
  usePrepareFairAuctionBuy,
  usePrepareFairAuctionClaim,
} from "../lib/generated/wagmiGen";
import { fairAuctionContractAddresses } from "../lib/config";
import {
  useProjectTokenData,
  useSaleTokenData,
  useTimeAndPrice,
} from "../lib/hooks/launchpad";

export function Launchpad() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastHash, setToastHash] = useState<`0x${string}`>();

  const [amount, setAmount] = useState("");

  const addRecentTransaction = useAddRecentTransaction();

  const { address } = useAccount();
  const { chain } = useNetwork();

  const {
    saleTokenAddress,
    saleTokenDecimals,
    saleTokenSymbol,
    saleTokenBalance,
  } = useSaleTokenData();
  const { projectTokenSymbol, projectTokenDecimals } = useProjectTokenData();

  const { data: allowance, isFetching: isFetchingAllowance } =
    useErc20Allowance({
      address: saleTokenAddress,
      args: [
        address!,
        fairAuctionContractAddresses[chain?.id as 7700 | 42161 | 421613 | 5],
      ],
      enabled: !!address && !chain?.unsupported,
    });
  const needsApproval = !isEnoughAllowance(
    allowance,
    saleTokenDecimals,
    amount as `${number}`
  );

  const { data: totalRaised } = useFairAuctionTotalRaised({
    enabled: !chain?.unsupported && !!saleTokenDecimals,
    select: (data) => formatUnits(data, saleTokenDecimals!),
  });

  const { data: userInfo } = useFairAuctionUserInfo({
    enabled:
      !!address &&
      !chain?.unsupported &&
      !!projectTokenDecimals &&
      !!saleTokenDecimals,
    args: [address!],
    select([allocation, contribution]) {
      return {
        allocation: formatUnits(allocation, projectTokenDecimals!),
        spent: formatUnits(contribution, saleTokenDecimals!),
      };
    },
  });

  const { data: expectedClaimAmount } = useFairAuctionGetExpectedClaimAmount({
    enabled: !!address && !chain?.unsupported && !!projectTokenDecimals,
    args: [address!],
    select: (data) => formatUnits(data, projectTokenDecimals!),
  });

  const { hasEnded, hasStarted, remainingTime, tokenPrice } =
    useTimeAndPrice(saleTokenDecimals);

  const { config: approveConfig } = usePrepareErc20Approve({
    address: saleTokenAddress,
    args: [
      fairAuctionContractAddresses[chain?.id as 7700 | 42161 | 421613 | 5],
      parseUnits(amount as `${number}`, saleTokenDecimals!),
    ],
    enabled:
      !!address &&
      !chain?.unsupported &&
      !!saleTokenDecimals &&
      isValidInput(amount) &&
      needsApproval &&
      hasStarted &&
      !hasEnded,
  });
  const { write: approve, isLoading: isApproving } = useErc20Approve({
    ...approveConfig,
    onSuccess(data) {
      setToastOpen(true);
      setToastMessage("Approval successful submitted");
      setToastHash(data.hash);
      addRecentTransaction({
        hash: data.hash,
        description: "Approval tx",
      });
    },
  });

  const { config: buyConfig } = usePrepareFairAuctionBuy({
    args: [parseUnits(amount as `${number}`, saleTokenDecimals!), zeroAddress],
    enabled:
      !!address &&
      !chain?.unsupported &&
      isValidInput(amount) &&
      hasStarted &&
      !hasEnded,
  });
  const { write: buy, isLoading: isBuying } = useFairAuctionBuy({
    ...buyConfig,
    onSuccess(data) {
      setToastOpen(true);
      setToastMessage("Buy successful submitted");
      setToastHash(data.hash);
      addRecentTransaction({
        hash: data.hash,
        description: "Buy tx",
      });
    },
  });

  const { config: claimConfig } = usePrepareFairAuctionClaim({
    enabled: !!address && !chain?.unsupported && hasEnded,
  });
  const { write: claim, isLoading: isClaiming } = useFairAuctionClaim({
    ...claimConfig,
    onSuccess(data) {
      setToastOpen(true);
      setToastMessage("Claim successful submitted");
      setToastHash(data.hash);
      addRecentTransaction({
        hash: data.hash,
        description: "Claim tx",
      });
    },
  });

  const { isFetching: isWaitingForTx } = useWaitForTransaction({
    hash: toastHash,
    onSuccess: () => {
      setToastHash(undefined);
      setToastMessage("");
    },
  });

  const setMaxAmount = () => {
    if (saleTokenBalance) {
      setAmount(saleTokenBalance.formatted);
    }
  };
  return (
    <>
      <div className="flex min-w-[1024px] flex-col gap-3">
        <Image
          alt="DMT"
          src="/dmt.png"
          width={160}
          height={62.5}
          layout="fixed"
        />
        <div className="mb-4 flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <div>Total raised</div>
            <div className="font-siebB">
              {formatCurrency(totalRaised)} {saleTokenSymbol ?? "USDC"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="capitalize">
              {projectTokenSymbol ?? "DMT"} price
            </div>
            <div className="font-siebB">
              {formatCurrency(tokenPrice)} {saleTokenSymbol ?? "USDC"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Expected claim</div>
            <div className="font-siebB">
              {formatCurrency(expectedClaimAmount)}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex flex-grow-[0.3] flex-col gap-2">
            <div className="relative">
              <input
                disabled={!hasStarted || hasEnded}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full rounded border-none bg-transparent p-4 text-left text-base outline outline-1 outline-primary ${
                  !isValidInput(amount) && amount !== ""
                    ? "text-error focus:outline-error focus-visible:outline-error"
                    : "focus:outline-secondary focus-visible:outline-secondary"
                }`}
                placeholder={`0.00 ${saleTokenSymbol ?? "USDC"}`}
              />
              <button
                className="absolute right-3 top-1 text-xs text-secondary"
                onClick={() => setMaxAmount()}
              >
                MAX
              </button>
              <div className="absolute bottom-1 right-3 text-xs text-secondary">
                Balance: {formatCurrency(saleTokenBalance?.formatted)}{" "}
                {saleTokenSymbol ?? "USDC"}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Spent</div>
              <div>
                {formatCurrency(userInfo?.spent)} {saleTokenSymbol ?? "USDC"}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Allocation</div>
              <div>
                {formatCurrency(userInfo?.allocation)}{" "}
                {projectTokenSymbol ?? "DMT"}
              </div>
            </div>
            <button
              disabled={
                isFetchingAllowance ||
                isWaitingForTx ||
                (hasEnded
                  ? !claim || isClaiming
                  : needsApproval
                  ? !approve || isApproving
                  : !buy || isBuying)
              }
              onClick={
                hasEnded
                  ? () => claim?.()
                  : needsApproval
                  ? () => approve?.()
                  : () => buy?.()
              }
              className="flex h-14 w-full items-center justify-center rounded border border-transparent bg-primary p-5 text-center font-medium text-extendedBlack transition-colors hover:bg-secondary focus-visible:outline-secondary disabled:bg-slate-400 disabled:opacity-60"
            >
              {hasEnded ? "Claim" : needsApproval ? "Approve" : "Buy"}
            </button>
          </div>
          <div>
            <video
              src="/dmtcoin.webm"
              className="max-w-[112px]"
              autoPlay
              muted
              loop
            />
          </div>
        </div>
      </div>
      <Toast.Root
        className="rounded-md bg-[#111] p-4 text-left shadow shadow-secondary radix-state-closed:animate-hide radix-state-open:animate-slideIn radix-swipe-cancel:translate-x-0 radix-swipe-cancel:transition-[transform_200ms_ease-out] radix-swipe-end:animate-swipeOut radix-swipe-move:translate-x-[var(--radix-toast-swipe-move-x)]"
        open={toastOpen}
        onOpenChange={setToastOpen}
      >
        <Toast.Title asChild>
          <h2 className="text-success">Success!</h2>
        </Toast.Title>
        <Toast.Description asChild>
          <p className="text-primary">{toastMessage}</p>
        </Toast.Description>
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Look on arbiscan with hash"
        >
          <a
            href={`https://goerli.etherscan.io/tx/${toastHash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm text-secondary underline transition-colors hover:text-primary hover:no-underline"
          >
            Look on explorer
          </a>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-3 p-6 outline-none" />
    </>
  );
}

const isValidInput = (input: string) => {
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

const isEnoughAllowance = (
  allowance: bigint | undefined,
  decimals: number | undefined,
  amount: `${number}`
) => {
  if (!allowance || !decimals) return false;
  const readableAllowance = formatUnits(allowance, decimals);
  return +readableAllowance >= +amount;
};

const formatCurrency = (value: string | undefined) => {
  if (!value) return "0.00";
  if (isValidInput(value)) {
    return parseFloat(value).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  } else return "0.00";
};
