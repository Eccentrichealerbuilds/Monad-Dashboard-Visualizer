import { Router, Request, Response } from 'express';
import { Block, BlockWebhookPayload, BlockReceipt } from '../types/block';
import { recordStatBlock } from '../services/stats';
// @ts-ignore
import fetch from 'node-fetch';

const router = Router();

// Store last 10,000 full blocks for /blocks endpoint
const fullBlocks: Block[] = [];
// Store receipts by transactionHash for merging
export const receiptsByTxHash: { [txHash: string]: BlockReceipt } = {};

// Webhook endpoint
router.post('/webhook/blocks', (req: Request, res: Response) => {
  console.log('Received block webhook payload:', JSON.stringify(req.body, null, 2));

  // Handle PING message
  if (req.body && req.body.message === 'PING') {
    res.status(200).json({ status: 'pong' });
    return;
  }

  const { data } = req.body;
  if (!Array.isArray(data) || !data[0]) {
    res.status(400).json({ error: 'Invalid payload format' });
    return;
  }

  // Accept both formats: { data: [ { ...block fields... } ] } and { data: [ { block: { ... } } ] }
  let block: Block | undefined;
  let receipts: BlockReceipt[] = [];
  if (data[0].block) {
    block = data[0].block;
    receipts = data[0].receipts || [];
  } else if (data[0].transactions) {
    block = data[0];
    receipts = data[0].receipts || [];
  }

  if (!block) {
    res.status(400).json({ error: 'Invalid payload format' });
    return;
  }

  // Store receipts by transactionHash
  if (Array.isArray(receipts)) {
    for (const receipt of receipts) {
      if (receipt.transactionHash) {
        receiptsByTxHash[receipt.transactionHash.toLowerCase()] = receipt;
      }
    }
  }

  // Store full block for /blocks endpoint
  fullBlocks.push(block);
  if (fullBlocks.length > 100) fullBlocks.shift();

  // Store minimal stat block for metrics
  recordStatBlock(block);

  res.json({ status: 'ok', received: 1 });
});

// Endpoint to get recent blocks
router.get('/blocks', (req: Request, res: Response) => {
  res.json(fullBlocks.slice(-100)); // Return last 100 full blocks
});

// Search for a block by number (decimal or hex) or by keyword
router.get('/block/:id', (req: Request, res: Response) => {
  const id = req.params.id.toLowerCase();
  let block: Block | undefined;

  if (id === 'latest') {
    block = fullBlocks[fullBlocks.length - 1];
  } else if (id === 'earliest') {
    block = fullBlocks[0];
  } else if (id === 'pending' || id === 'finalized' || id === 'safe') {
    // Placeholder: return latest block (custom logic can be added later)
    block = fullBlocks[fullBlocks.length - 1];
  } else if (/^0x[0-9a-f]+$/.test(id)) {
    block = fullBlocks.find(b => b.number && b.number.toLowerCase() === id);
  } else if (/^\d+$/.test(id)) {
    const searchHex = '0x' + parseInt(id, 10).toString(16);
    block = fullBlocks.find(b => b.number && b.number.toLowerCase() === searchHex);
  } else {
    res.status(400).json({ error: 'Invalid block id format' });
    return;
  }

  if (!block) {
    res.status(404).json({ error: 'Block not found' });
    return;
  }

  res.json(block);
});

// Proxy endpoint to fetch block by number from Alchemy
router.get('/block-by-number/:number', async (req, res) => {
  const blockNumber = req.params.number;
  // Convert decimal to hex if needed
  const hexNumber = blockNumber.startsWith('0x')
    ? blockNumber
    : '0x' + parseInt(blockNumber, 10).toString(16);
  try {
    const response = await fetch('https://monad-testnet.g.alchemy.com/v2/api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: [hexNumber, false],
        id: 1
      }),
    });
    const data = await response.json();
    if (data.result) {
      res.json(data.result);
    } else {
      res.status(404).json({ error: 'Block not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch block', details: err });
  }
});

export { fullBlocks };
export default router; 
