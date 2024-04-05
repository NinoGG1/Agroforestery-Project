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
      address: "0xDa1A6F223da2389E470F6Da6f56B107CBaF9e2C1",
      blockCreated: 5634409,
    },
    contract2: {
      address: "0xE9D1D106FC5F7a7Ca37DFF254fC0758cE7aA6e88",
      blockCreated: 5634416,
    },
    contract3: {
      address: "0x9712641545adF54146b6992e7F9F72205cf6DdAE",
      blockCreated: 5634430,
    },
    contract4: {
      address: "0xd953E34cb7e86B307d8d661d8bd4f17eE7B8DBd6",
      blockCreated: 5634443,
    },
  },
  testnet: true,
};
