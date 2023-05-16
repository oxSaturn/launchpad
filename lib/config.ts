import { arbitrum, goerli } from "wagmi/chains";

export const fairAuctionContractAddresses = {
  [arbitrum.id]: "0x0b776552c1aef1dc33005dd25acda22493b6615d", // placeholder
  [goerli.id]: "0x0a505a4419c8e57c21bd3c0fd2cc16b3dcd36a58", // TODO deployment chore
} as const;
