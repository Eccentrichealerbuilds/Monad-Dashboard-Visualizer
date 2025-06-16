import React, { useEffect, useState } from 'react';
import { StatsBar } from './StatsBar';
import { BlocksChart } from './BlocksChart';
import { TPSChart } from './TPSChart';
import { LatestBlocks } from './LatestBlocks';
import { LatestTransactions } from './LatestTransactions';
import { TopContracts } from './TopContracts';
import { TopAddresses } from './TopAddresses';
import { BlockModal } from '../modals/BlockModal';
import { TransactionModal } from '../modals/TransactionModal';
import * as api from '../../services/api';
import { Block, Transaction } from '../../types';
import BlockchainVisualizer from '../visualizer/BlockchainVisualizer';
import { useTheme } from '../../context/ThemeContext';

export const Dashboard: React.FC = () => {
  // StatsBar state
  const [blockNumber, setBlockNumber] = useState(0);
  const [tps, setTps] = useState(0);
  const [avgBlocksPerMin, setAvgBlocksPerMin] = useState("0");
  const [uptime, setUptime] = useState(0);

  // Visualizer and Lists State
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Modal State
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          tpsData,
          blocksPerMinuteData,
          uptimeData,
          blocksData,
          transactionsData
        ] = await Promise.all([
          api.getTps(),
          api.getBlocksPerMinute(),
          api.getUptime(),
          api.getBlocks(),
          api.getTransactions()
        ]);

        // Set StatsBar data
        setTps(tpsData.tps);
        setAvgBlocksPerMin(blocksPerMinuteData.blocksPerMinute.toFixed(2));
        setUptime(uptimeData.uptimeSeconds);

        // Set Blocks data
        if (blocksData.length > 0) {
            setBlocks(blocksData);
            const latestBlock = blocksData[blocksData.length - 1];
            setBlockNumber(parseInt(latestBlock.number, 16));
        }

        // Set Transactions data
        if (transactionsData.length > 0) {
            setTransactions(transactionsData);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleViewBlock = (block: any) => {
    setSelectedBlock(block);
  };

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-600 bg-clip-text text-transparent">
        MONAD DASHBOARD VISUALIZER
      </h1>
      <StatsBar
        blockNumber={blockNumber}
        tps={tps}
        avgBlocksPerMin={avgBlocksPerMin}
        uptime={uptime}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TPSChart />
        <BlocksChart />
      </div>
      {/* 3D Visualizer */}
      <div className="h-96 mb-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <BlockchainVisualizer blocks={blocks} transactions={transactions} darkMode={theme === 'dark'} />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <LatestBlocks onViewBlock={handleViewBlock} />
        <LatestTransactions onViewTransaction={handleViewTransaction} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopContracts />
        <TopAddresses />
      </div>
      {selectedBlock && <BlockModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />}
      {selectedTransaction && <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </div>
  );
};