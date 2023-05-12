import { arbitrum, canto, arbitrumGoerli, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // TODO placeholders
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d",
  [goerli.id]: "0x7d306489D2cDa270fCf857e3Fc604B736FDCA7a6", // use epoch time not block
} as const;
