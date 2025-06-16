import React, { useEffect, useState } from 'react';
import { formatHash, formatTimeAgo } from '../../utils/formatters';
import { BoxIcon } from 'lucide-react';
import { getBlocks } from '../../services/api';
import { Block } from '../../types';

interface LatestBlocksProps {
  onViewBlock: (block: Block) => void;
}

export const LatestBlocks: React.FC<LatestBlocksProps> = ({
  onViewBlock
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const blocksData: Block[] = await getBlocks();
        // Get the last 5 blocks and reverse them to show newest first
        const latestBlocks = blocksData.slice(-5).reverse();
        setBlocks(latestBlocks);
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
      }
    };

    fetchBlocks();
    const intervalId = setInterval(fetchBlocks, 7000); // Refresh every 7 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BoxIcon size={18} className="text-purple-500" />
          Latest Blocks
        </h2>
        <a href="/blocks" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Block
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hash
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Txns
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {blocks.map(block => (
              <tr key={block.hash} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer" onClick={() => onViewBlock(block)}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                      <BoxIcon size={12} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {/* Convert hex block number to decimal */}
                      {parseInt(String(block.number), 16)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {formatHash(block.hash)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {/* Convert hex timestamp to milliseconds for formatter */}
                  {formatTimeAgo(parseInt(String(block.timestamp), 16) * 1000)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {block.transactions.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};