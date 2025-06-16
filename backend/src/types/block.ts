export interface BlockTransaction {
  type: string;
  chainId: string;
  nonce: string;
  gas: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  to: string;
  value: string;
  input: string;
  r: string;
  s: string;
  v: string;
  hash: string;
  blockHash: string;
  blockNumber: string;
  transactionIndex: string;
  from: string;
  accessList?: any[];
  yParity?: string;
}

export interface BlockReceiptLog {
  address: string;
  topics: string[];
  data: string;
  blockHash: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  transactionIndex: string;
  logIndex: string;
  removed: boolean;
}

export interface BlockReceipt {
  type: string;
  status: string;
  cumulativeGasUsed: string;
  logs: BlockReceiptLog[];
  logsBloom: string;
  transactionHash: string;
  transactionIndex: string;
}

export interface Block {
  hash: string;
  parentHash: string;
  number: string;
  timestamp: string;
  gasUsed: string;
  gasLimit: string;
  transactions: BlockTransaction[];
  // Add other fields as needed
}

export interface BlockWebhookPayload {
  data: Array<{
    block: Block;
    receipts: BlockReceipt[];
  }>;
} 