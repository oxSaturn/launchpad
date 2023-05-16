import { arbitrum, canto, arbitrumGoerli, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [arbitrumGoerli.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [canto.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [goerli.id]: "0xe4e39196c8c1998f63db6c6a2a54521b21240614", // TODO deployment chore
} as const;
