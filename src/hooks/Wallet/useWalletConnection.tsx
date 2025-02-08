import { useWallet } from "@solana/wallet-adapter-react";
import { createContext, useContext, useState } from "react";

const WalletConnectionContext = createContext(null);

export const WalletConnectionProvider = ({ children }) => {
  const { publicKey, connected, connect, disconnect, sendTransaction, signTransaction, readyState } = useWallet();
  const [walletError, setWalletError] = useState(null);

  const ensureConnected = async () => {
    if (!connected && readyState === "Installed") {
      try {
        await connect();
        setWalletError(null); // Clear previous errors on success
      } catch (error) {
        console.error("Wallet connection failed:", error);
        setWalletError(error.message || "Connection rejected");
      }
    }
  };

  return (
  <WalletConnectionContext.Provider value={{
    publicKey,
    connected,
    walletError,
    sendTransaction: connected ? sendTransaction : undefined,
    signTransaction: connected ? signTransaction : undefined, // ✅ Ensure it's passed!
    ensureConnected,
  }}>
    {children}
  </WalletConnectionContext.Provider>
);

};

export const useWalletConnection = () => useContext(WalletConnectionContext);
