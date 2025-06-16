export interface Transaction {
  type: string;
  chainId: string;
  nonce: string;
  gasPrice?: string;
  gas: string;
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
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  accessList?: any[];
  yParity?: string;
} 