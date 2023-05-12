import { arbitrum, canto, arbitrumGoerli, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // TODO placeholders
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [goerli.id]: "0x594aD8b11a1a8FBdCb92DdE3EC6B0aA2C569c7a2", // use epoch time not block
} as const;
