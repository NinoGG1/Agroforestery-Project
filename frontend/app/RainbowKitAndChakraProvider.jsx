"use client";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./customTheme";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { hardhat, sepolia, polygon } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "2cd5dacffa0beae06e9eee64fafe8bb1",
  chains: [hardhat, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

const RainbowKitAndChakraProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider showRecentTransactions={true}>
          <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitAndChakraProvider;
