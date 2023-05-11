import { arbitrum, canto, arbitrumGoerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // TODO placeholders
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
} as const;
