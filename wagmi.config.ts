import { defineConfig } from '@wagmi/cli'
import {  react } from '@wagmi/cli/plugins'
import { erc20ABI } from 'wagmi'
import { arbitrum, canto } from 'wagmi/chains'

import { fairAuctionABI } from './lib/abis/fairAuction'

export default defineConfig({
  out: 'lib/generated/wagmiGen.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20ABI,
    },
    {
      name: 'FairAuction',
      abi: fairAuctionABI,
      address: {
        [arbitrum.id]: '0x0b776552c1aef1dc33005dd25acda22493b6615d', // TODO placeholders
        [canto.id]: '0x0b776552c1aef1dc33005dd25acda22493b6615d',
      }
    }
  ],
  plugins: [react()],
})
