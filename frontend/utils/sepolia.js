const RPC = process.env.NEXT_PUBLIC_PUBLIC_RPC || "";

export const sepolia = {
  id: 11_155_111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia", symbol: "SEP", decimals: 18 },
  rpcUrls: {
    default: {
      http: [RPC],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
    },
  },
  contracts: {
    contract1: {
      address: "0xac8E57F2656eB19dD9EA9F078327c1315838688A",
      blockCreated: 5621587,
    },
    contract2: {
      address: "0xf184508c286f589e5D9Ff741080f7084c2b83F84",
      blockCreated: 5621610,
    },
    contract3: {
      address: "0xbD7Dc89Cd396FE38E0F358C81945ccB008fbdb9B",
      blockCreated: 5621627,
    },
  },
  testnet: true,
};
