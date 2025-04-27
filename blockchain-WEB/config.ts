import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism,sepolia } from 'wagmi/chains'
import { metaMask } from '@wagmi/connectors'

const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [mainnet, base,sepolia],
  connectors: [
    // injected(),
    // walletConnect({ projectId })
    metaMask(),
    // safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})