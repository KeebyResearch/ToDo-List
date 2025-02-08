import "bootstrap/dist/css/bootstrap.min.css";
import { AppProps } from "next/app";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import dynamic from "next/dynamic";
import { WalletConnectionProvider } from "../hooks/Wallet/useWalletConnection";

require("@solana/wallet-adapter-react-ui/styles.css");

// Disable SSR for Next.js hydration issues
const MyApp = ({ Component, pageProps }: AppProps) => {
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletConnectionProvider>
            <Component {...pageProps} />
          </WalletConnectionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
