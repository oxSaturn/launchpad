import { ConnectButton } from "@rainbow-me/rainbowkit";

import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-extendedBlack">
      <header className="flex w-full items-center justify-end px-4 py-5 md:px-12">
        <ConnectButton accountStatus="address" chainStatus="icon" />
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="flex w-full flex-col-reverse items-center justify-between px-4 py-5 sm:flex-row md:px-20">
        <div className="flex gap-4 text-secondary">
          <a
            href="https://velocimeter.xyz"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-primary"
          >
            velocimeter
          </a>
          <a
            href="https://sankodreammachine.net/airdrop"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-primary"
          >
            airdrop
          </a>
        </div>
        <div className="text-2xl">Sanko Game Corp</div>
        <div className="flex gap-4">
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
            href="https://twitter.com/SankoGameCorp"
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
