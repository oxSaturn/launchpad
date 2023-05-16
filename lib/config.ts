import { arbitrum, canto, arbitrumGoerli, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [goerli.id]: "0xC62a28B5c0670c809f9542f7905a37a41f7e9634", // TODO deployment chore
} as const;
