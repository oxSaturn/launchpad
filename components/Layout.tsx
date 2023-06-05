import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  DiscordLogoIcon,
  TwitterLogoIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-extendedBlack">
      <header className="flex w-full items-center justify-end px-4 py-5 md:px-12">
        <ConnectButton accountStatus="address" chainStatus="icon" />
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="flex w-full grid-cols-3 flex-col-reverse items-center justify-between gap-1 px-4 py-5 sm:grid md:px-20">
        <div className="flex gap-4 text-secondary">
          <a
            href="https://docs.velocimeter.xyz"
            
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-primary"
          >
            docs
          </a>
          <a
            href="https://velocimeter.xyz"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-primary"
          >
            Velocimeter
          </a>
        </div>
        <div className="justify-self-center text-2xl">Velocimeter v3</div>
        <div className="flex gap-4 justify-self-end">
          <a
            className="block border border-primary p-1 transition-colors duration-300 hover:bg-primary hover:text-extendedBlack"
            href="https://scan.pulsechain.com/address/0x54Ea937e12a4011d69FE1200DFBfF36d0E7A4C64"
            target="_blank"
            rel="noreferrer noopener"
          >
            <ReaderIcon />
          </a>
          <a
            className="block border border-primary p-1 transition-colors duration-300 hover:bg-primary hover:text-extendedBlack"
            href="https://discord.gg/t25nQt5SgQ"
            target="_blank"
            rel="noreferrer noopener"
          >
            <DiscordLogoIcon />
          </a>
          <a
            className="block border border-primary p-1 transition-colors duration-300 hover:bg-primary hover:text-extendedBlack"
            href="https://twitter.com/VelocimeterDEX"
            target="_blank"
            rel="noreferrer noopener"
          >
            <TwitterLogoIcon />
          </a>
        </div>
      </footer>
    </div>
  );
}
