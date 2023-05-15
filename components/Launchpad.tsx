import { useState } from "react";
import Image from "next/image";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import * as Toast from "@radix-ui/react-toast";
import { formatUnits, parseUnits, zeroAddress } from "viem";
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
  useTimer,
} from "../lib/hooks/launchpad";
import { formatCurrency, isEnoughAllowance, isValidInput } from "../lib/utils";

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

  const {
    data: allowance,
    isFetching: isFetchingAllowance,
    refetch: refetchAllowance,
  } = useErc20Allowance({
    address: saleTokenAddress,
    args: [
      address!,
      fairAuctionContractAddresses[chain?.id as 7700 | 42161 | 421613 | 5],
    ],
    enabled: !!address && !chain?.unsupported,
    select: (allowanceValue) => ({
      value: allowanceValue,
      needsApproval: !isEnoughAllowance(
        allowanceValue,
        saleTokenDecimals,
        amount as `${number}`
      ),
    }),
  });

  const { data: totalRaised } = useFairAuctionTotalRaised({
    enabled: !chain?.unsupported && !!saleTokenDecimals,
    select: (data) => formatUnits(data, saleTokenDecimals!),
    watch: true,
  });

  const { data: userInfo, refetch: refetchUserInfo } = useFairAuctionUserInfo({
    enabled:
      !!address &&
      !chain?.unsupported &&
      !!projectTokenDecimals &&
      !!saleTokenDecimals,
    args: [address!],
    select([, contribution, , , , , , hasClaimed]) {
      return {
        spent: formatUnits(contribution, saleTokenDecimals!),
        hasClaimed,
      };
    },
  });

  const { data: expectedClaimAmount, refetch: refetchClaimAmount } =
    useFairAuctionGetExpectedClaimAmount({
      enabled: !!address && !chain?.unsupported && !!projectTokenDecimals,
      args: [address!],
      select: (data) => formatUnits(data, projectTokenDecimals!),
    });

  const {
    hasEnded,
    hasStarted,
    remainingTime,
    tokenPrice,
    maxRaise,
    minRaise,
  } = useTimeAndPrice(saleTokenDecimals, projectTokenDecimals);
  const { days, hours, minutes } = useTimer(remainingTime);

  const { config: approveConfig } = usePrepareErc20Approve({
    address: saleTokenAddress,
    enabled:
      isValidInput(amount) &&
      !!address &&
      !chain?.unsupported &&
      !!saleTokenDecimals &&
      allowance?.needsApproval &&
      hasStarted &&
      !hasEnded,
    args: [
      fairAuctionContractAddresses[chain?.id as 7700 | 42161 | 421613 | 5],
      isValidInput(amount)
        ? parseUnits(amount as `${number}`, saleTokenDecimals!)
        : 0n,
    ],
  });
  const { write: approve, isLoading: isApproving } = useErc20Approve({
    ...approveConfig,
    onSuccess(data) {
      setToastOpen(true);
      setToastMessage("Approval successfully submitted");
      setToastHash(data.hash);
      addRecentTransaction({
        hash: data.hash,
        description: "Approval tx",
      });
    },
  });

  const { config: buyConfig } = usePrepareFairAuctionBuy({
    args: [
      isValidInput(amount)
        ? parseUnits(amount as `${number}`, saleTokenDecimals!)
        : 0n,
      zeroAddress,
    ],
    enabled:
      !!address &&
      !chain?.unsupported &&
      isValidInput(amount) &&
      hasStarted &&
      !hasEnded &&
      !!allowance,
  });
  const { write: buy, isLoading: isBuying } = useFairAuctionBuy({
    ...buyConfig,
    onSuccess(data) {
      setToastOpen(true);
      setToastMessage("Buy successfully submitted");
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
      setToastMessage("Claim successfully submitted");
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
      refetchAllowance();
      refetchUserInfo();
      refetchClaimAmount();
    },
  });

  const setMaxAmount = () => {
    if (saleTokenBalance) {
      setAmount(saleTokenBalance.formatted);
    }
  };
  const onAirdropClick = () => {
    window.open("https://sankodreammachine.net/airdrop", "_blank");
  };
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[1024px] lg:flex-col">
        <div className="mb-4 flex w-full flex-col items-center justify-between self-center sm:mb-0 sm:self-auto lg:flex-row">
          <Image
            alt="DMT"
            src="/dmt.png"
            width={160}
            height={62.5}
            layout="fixed"
          />
        </div>
        <div className="mb-4 grid w-full grid-cols-2 flex-col items-start justify-between gap-4 text-sm sm:flex sm:text-base lg:flex-row lg:items-center">
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
              {formatCurrency(tokenPrice?.toString())}{" "}
              {saleTokenSymbol ?? "USDC"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Remaining time</div>
            <div className="font-siebB">{`${days}d ${hours}h ${minutes}m`}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Min raise</div>
            <div className="font-siebB">
              {formatCurrency(minRaise)} {saleTokenSymbol}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>Max raise</div>
            <div className="font-siebB">
              {formatCurrency(maxRaise)} {saleTokenSymbol}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="flex w-full flex-grow-[0.3] flex-col gap-2 sm:w-auto">
            <div className="relative">
              <input
                // disabled={!hasStarted || hasEnded}
                value={amount}
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
                {formatCurrency(expectedClaimAmount)}{" "}
                {projectTokenSymbol ?? "DMT"}
              </div>
            </div>
            <button
              disabled={
                isFetchingAllowance ||
                isWaitingForTx ||
                userInfo?.hasClaimed ||
                !allowance ||
                (hasEnded
                  ? !claim || isClaiming
                  : allowance?.needsApproval
                  ? !approve || isApproving
                  : !buy || isBuying)
              }
              onClick={
                hasEnded
                  ? () => claim?.()
                  : allowance?.needsApproval
                  ? () => approve?.()
                  : () => buy?.()
              }
              className="flex h-14 w-full items-center justify-center rounded border border-transparent bg-primary p-5 text-center font-medium text-extendedBlack transition-colors hover:bg-secondary focus-visible:outline-secondary disabled:bg-slate-400 disabled:opacity-60"
            >
              {isWaitingForTx
                ? "Loading..."
                : hasEnded
                ? "Claim"
                : allowance?.needsApproval
                ? "Approve"
                : "Buy"}
            </button>
          </div>
          <div className="flex flex-grow-[0.3] flex-col items-center gap-4">
            <video
              src="/dmtcoin.webm"
              className="max-w-[112px]"
              autoPlay
              muted
              loop
            />
            <button
              onClick={onAirdropClick}
              className="max-w-[215.5px] rounded border border-primary px-16 py-2 transition-shadow hover:shadow hover:shadow-secondary sm:py-4"
            >
              AIRDROP
            </button>
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
