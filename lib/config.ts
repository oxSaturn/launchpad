import { arbitrum, canto, arbitrumGoerli, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // TODO placeholders
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [goerli.id]: "0xAfACc2928DF00CBE05B0bC41DAb5FfD792A6A04c", // use epoch time not block
} as const;
