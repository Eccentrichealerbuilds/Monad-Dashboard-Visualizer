import { Router, Request, Response } from 'express';
import { getTPS, getBlocksPerMinute, getTopSenders, getTopContracts, getBlocksPer24hrs, getTopSenders24hrs, getTopContracts24hrs, exportStatsArray } from '../services/stats';
import { serverStartTime } from '../index';

const router = Router();

router.get('/stats/uptime', (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  res.json({ uptimeSeconds });
});

router.get('/stats/tps', (req: Request, res: Response) => {
  res.json({ tps: getTPS() });
});

router.get('/stats/blocks-per-minute', (req: Request, res: Response) => {
  res.json({ blocksPerMinute: getBlocksPerMinute() });
});

router.get('/stats/top-senders', (req: Request, res: Response) => {
  res.json({ topSenders: getTopSenders() });
});

router.get('/stats/top-contracts', (req: Request, res: Response) => {
  res.json({ topContracts: getTopContracts() });
});

router.get('/stats/blocks-per-24hrs', (req: Request, res: Response) => {
  res.json({ blocksPer24hrs: getBlocksPer24hrs() });
});

router.get('/stats/top-senders-24hrs', (req: Request, res: Response) => {
  res.json({ topSenders24hrs: getTopSenders24hrs() });
});

router.get('/stats/top-contracts-24hrs', (req: Request, res: Response) => {
  res.json({ topContracts24hrs: getTopContracts24hrs() });
});

// Returns TPS history for the last 60 minutes (array of { time, tps })
router.get('/stats/tps-history', (req: Request, res: Response) => {
  const stats = exportStatsArray();
  const now = Math.floor(Date.now() / 1000);
  const buckets: { [minute: number]: { txs: number } } = {};
  for (const b of stats) {
    const minute = Math.floor(b.timestamp / 60);
    if (!buckets[minute]) buckets[minute] = { txs: 0 };
    buckets[minute].txs += b.transactions.length;
  }
  const result = [];
  for (let i = 59; i >= 0; i--) {
    const minute = Math.floor((now - i * 60) / 60);
    const txs = buckets[minute]?.txs || 0;
    result.push({
      time: new Date((minute * 60) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tps: (txs / 60).toFixed(2),
    });
  }
  res.json(result);
});

// Returns blocks-per-minute history for the last 60 minutes (array of { time, blocks })
router.get('/stats/blocks-history', (req: Request, res: Response) => {
  const stats = exportStatsArray();
  const now = Math.floor(Date.now() / 1000);
  const buckets: { [minute: number]: number } = {};
  for (const b of stats) {
    const minute = Math.floor(b.timestamp / 60);
    buckets[minute] = (buckets[minute] || 0) + 1;
  }
  const result = [];
  for (let i = 59; i >= 0; i--) {
    const minute = Math.floor((now - i * 60) / 60);
    const blocks = buckets[minute] || 0;
    result.push({
      time: new Date((minute * 60) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      blocks,
    });
  }
  res.json(result);
});

export default router; 