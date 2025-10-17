import { createContext, useContext, ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, sepolia, polygonMumbai } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'EmocionalIA+',
  projectId: 'emocionaliaplus-web3',
  chains: [sepolia, polygonMumbai, mainnet, polygon],
  transports: {
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient();

interface Web3ContextType {
  isTestnet: boolean;
  setIsTestnet: (testnet: boolean) => void;
}

const Web3Context = createContext<Web3ContextType>({
  isTestnet: true,
  setIsTestnet: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: 'hsl(var(--primary))',
            accentColorForeground: 'hsl(var(--primary-foreground))',
            borderRadius: 'medium',
          })}
          modalSize="compact"
        >
          <Web3Context.Provider value={{ isTestnet: true, setIsTestnet: () => {} }}>
            {children}
          </Web3Context.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
