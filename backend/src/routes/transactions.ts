import { Router, Request, Response } from 'express';
import { Transaction } from '../types/transaction';
import { receiptsByTxHash } from './blocks';
// @ts-ignore
import fetch from 'node-fetch';

const router = Router();

// In-memory store for transactions
const transactions: Transaction[] = [];

// Webhook endpoint for transaction notifications
router.post('/webhook/transactions', (req: Request, res: Response) => {
  console.log('Received webhook payload:', JSON.stringify(req.body, null, 2));

  // Handle PING message
  if (req.body && req.body.message === 'PING') {
    res.status(200).json({ status: 'pong' });
    return;
  }

  // Store receipts if present
  const { receipts } = req.body;
  if (Array.isArray(receipts)) {
    for (const receipt of receipts) {
      if (receipt.transactionHash) {
        receiptsByTxHash[receipt.transactionHash.toLowerCase()] = receipt;
      }
    }
  }

  // Handle Alchemy webhook format
  if (req.body && req.body.jsonrpc === '2.0' && req.body.result) {
    const tx = req.body.result as Transaction;
    transactions.push(tx);
    if (transactions.length > 1000) transactions.splice(0, transactions.length - 1000);
    res.json({ status: 'ok', received: 1 });
    return;
  }

  // Handle old format with data array
  const { data } = req.body;
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const txs: Transaction[] = data[0];
    transactions.push(...txs);
    if (transactions.length > 1000) transactions.splice(0, transactions.length - 1000);
    res.json({ status: 'ok', received: txs.length });
    return;
  }

  res.status(400).json({ error: 'Invalid payload format' });
});

// Endpoint to get recent transactions
router.get('/transactions', (req: Request, res: Response) => {
  const merged = transactions.slice(-100).map(tx => {
    const receipt = receiptsByTxHash[tx.hash.toLowerCase()];
    return {
      ...tx,
      status: receipt ? receipt.status : undefined,
      gasUsed: receipt ? receipt.cumulativeGasUsed : undefined,
    };
  });
  res.json(merged);
});

// Endpoint to get transaction by hash
router.get('/transactions/:hash', (req: Request, res: Response) => {
  const { hash } = req.params;
  const tx = transactions.find(t => t.hash.toLowerCase() === hash.toLowerCase());
  
  if (!tx) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }
  
  const receipt = receiptsByTxHash[tx.hash.toLowerCase()];
  res.json({
    ...tx,
    status: receipt ? receipt.status : undefined,
    gasUsed: receipt ? receipt.cumulativeGasUsed : undefined,
  });
});

// Proxy endpoint to fetch transaction receipt from Alchemy
router.get('/transaction-receipt/:hash', async (req: Request, res: Response) => {
  const txHash = req.params.hash;
  try {
    const response = await fetch('https://monad-testnet.g.alchemy.com/v2/r9f1XOC_jAsapRTY4sUEDJmVTACM2-Zu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1
      }),
    });
    const data = await response.json();
    res.json(data.result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transaction receipt', details: err });
  }
});

export default router; 