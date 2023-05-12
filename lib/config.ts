import { arbitrum, canto, arbitrumGoerli, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // TODO placeholders
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [goerli.id]: "0x29f9BF5e35Eb456b8b39580e66Aea73D5a988b04", // use epoch time not block
} as const;
