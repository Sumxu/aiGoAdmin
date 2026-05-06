interface ContractMap {
  FactoryContract: string;
  Store_Address: string;
  Usdt_Address: string;
  Crowd_Funding_Address: string;
  nftContract: string;
  multiCallToken: string;
}

// 开发环境合约（测试网）
const devContract: ContractMap = {
  FactoryContract: "0x7F652Ef3416fCaf4cA88AB42A950E30bFdC8E797",
  Store_Address: "0x87663d59f95ed4689D74733206b04806477e82b3",
  Usdt_Address: "0x55d398326f99059fF775485246999027B3197955",
  Crowd_Funding_Address: "0xFE4951A0988AF8eCB3e2Fed6A324DF2A3588505e",
  nftContract: "0x9d5b269336e0b73458073662562863e81bdbbc4b",
  multiCallToken: "0xcA11bde05977b3631167028862bE2a173976CA11",
  guessingContract: "0xccC6D35aBcdb4D13299dB76Cc437cDe7De4b8Ce9"
};
// 生产环境合约（主网）
const prodContract: ContractMap = {
  FactoryContract: "0x7F652Ef3416fCaf4cA88AB42A950E30bFdC8E797",
  Store_Address: "0x87663d59f95ed4689D74733206b04806477e82b3",
  Usdt_Address: "0x55d398326f99059fF775485246999027B3197955",
  Crowd_Funding_Address: "0xFE4951A0988AF8eCB3e2Fed6A324DF2A3588505e",
  nftContract: "0x9d5b269336e0b73458073662562863e81bdbbc4b",
  multiCallToken: "0xcA11bde05977b3631167028862bE2a173976CA11",
  guessingContract: "0xccC6D35aBcdb4D13299dB76Cc437cDe7De4b8Ce9"
};

// 根据环境选择配置
export const contractAddress: ContractMap =
  import.meta.env.MODE === "development" ? devContract : prodContract;
