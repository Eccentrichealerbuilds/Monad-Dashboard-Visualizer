 export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  gas: number;
  gasPrice: string;
}

export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: Transaction[];
  miner: string;
  gasUsed: number;
  gasLimit: number;
  size: number;
}

export interface Stats {
    blockNumber: number;
    tps: number;
    avgBlocksPerMin: string;
    uptime: number;
}

export interface TopContract {
    address: string;
    txCount: number;
    balance: string;
    name: string;
}

export interface TopAddress {
    address: string;
    txCount: number;
    balance: string;
}

export interface ChartDataPoint {
    time: string;
    value: number;
}