import { defineConfig } from '@wagmi/cli'
import {  react } from '@wagmi/cli/plugins'
import { erc20ABI } from "wagmi";

import { fairAuctionABI } from "./lib/abis/fairAuction";
import { fairAuctionContractAddresses } from "./lib/config";

export default defineConfig({
  out: "lib/generated/wagmiGen.ts",
  contracts: [
    {
      name: "erc20",
      abi: erc20ABI,
    },
    {
      name: "FairAuction",
      abi: fairAuctionABI,
      address: fairAuctionContractAddresses,
    },
  ],
  plugins: [react()],
});
