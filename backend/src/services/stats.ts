import { Block } from '../types/block';

interface StatBlock {
  timestamp: number; // seconds
  transactions: { from: string; to: string | null }[];
}

const recentStatsBlocks: StatBlock[] = [];

export function loadStatsFromArray(arr: StatBlock[]) {
  recentStatsBlocks.length = 0;
  recentStatsBlocks.push(...arr);
}

export function exportStatsArray() {
  return [...recentStatsBlocks];
}

function pruneOldStatsBlocks() {
  const now = Math.floor(Date.now() / 1000);
  while (recentStatsBlocks.length && recentStatsBlocks[0].timestamp < now - 86400) {
    recentStatsBlocks.shift();
  }
}

export function recordStatBlock(block: Block) {
  let timestamp: number;
  if (typeof block.timestamp === 'string' && block.timestamp.startsWith('0x')) {
    timestamp = parseInt(block.timestamp, 16);
  } else {
    timestamp = Number(block.timestamp);
  }
  const transactions = (block.transactions || []).map(tx => ({ from: tx.from, to: tx.to || null }));
  recentStatsBlocks.push({ timestamp, transactions });
  pruneOldStatsBlocks();
}

function getStatsWindow(seconds: number) {
  const now = Math.floor(Date.now() / 1000);
  return recentStatsBlocks.filter(b => b.timestamp >= now - seconds);
}

export function getTPS(windowSec = 60) {
  const blocks = getStatsWindow(windowSec);
  const txCount = blocks.reduce((sum, b) => sum + b.transactions.length, 0);
  return txCount / windowSec;
}

export function getBlocksPerMinute(windowSec = 60) {
  const blocks = getStatsWindow(windowSec);
  return blocks.length / (windowSec / 60);
}

export function getTopSenders(windowSec = 60, topN = 5) {
  const blocks = getStatsWindow(windowSec);
  const senderCount: Record<string, number> = {};
  blocks.forEach(b => b.transactions.forEach(tx => {
    if (tx.from) senderCount[tx.from] = (senderCount[tx.from] || 0) + 1;
  }));
  return Object.entries(senderCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([address, count]) => ({ address, count }));
}

export function getTopContracts(windowSec = 60, topN = 5) {
  const blocks = getStatsWindow(windowSec);
  const contractCount: Record<string, number> = {};
  blocks.forEach(b => b.transactions.forEach(tx => {
    if (tx.to) contractCount[tx.to] = (contractCount[tx.to] || 0) + 1;
  }));
  return Object.entries(contractCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([address, count]) => ({ address, count }));
}

export function getBlocksPer24hrs() {
  return getBlocksPerMinute(86400) * 1440; // 1440 minutes in 24 hours
}

export function getTopSenders24hrs(topN = 5) {
  return getTopSenders(86400, topN);
}

export function getTopContracts24hrs(topN = 5) {
  return getTopContracts(86400, topN);
} 