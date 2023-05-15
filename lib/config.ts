import { arbitrum, canto, arbitrumGoerli, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [goerli.id]: "0x5Bd42D24CbBb35aB101cc68C027C7fB663086C88", // TODO deployment chore
} as const;
