import React, { useState } from 'react';
import { formatHash, formatTimestamp, formatNumber, formatValue } from '../../utils/formatters';
import { XIcon } from 'lucide-react';

interface BlockModalProps {
  block: any;
  onClose: () => void;
}

export const BlockModal: React.FC<BlockModalProps> = ({
  block,
  onClose
}) => {
  if (!block) return null;

  // NEW: State to manage the expanded transaction view
  const [isTxExpanded, setIsTxExpanded] = useState(false);

  // Determine which transactions to show based on the state
  const transactionsToShow = isTxExpanded ? block.transactions : block.transactions.slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold">Block #{parseInt(block.number, 16)}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Block Hash</p>
              <p className="font-mono text-sm break-all">{block.hash}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
              <p>{formatTimestamp(parseInt(block.timestamp, 16) * 1000)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Miner</p>
              <p className="font-mono text-sm break-all">{block.miner}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Size</p>
              <p>{formatNumber(parseInt(block.size, 16))} bytes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gas Used</p>
              <p>{formatNumber(parseInt(block.gasUsed, 16))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gas Limit</p>
              <p>{formatNumber(parseInt(block.gasLimit, 16))}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              Transactions ({block.transactions.length})
            </h3>
            {/* MODIFIED: Wrapped table in a scrollable div */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Hash</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">From</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">To</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {transactionsToShow.map((tx: any) => (
                    <tr key={tx.hash}>
                      <td className="px-4 py-2 text-sm">{formatHash(tx.hash)}</td>
                      <td className="px-4 py-2 text-sm">{formatHash(tx.from)}</td>
                      <td className="px-4 py-2 text-sm">{formatHash(tx.to)}</td>
                      <td className="px-4 py-2 text-sm">{formatValue(tx.value)} MON</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* NEW: Expand/Collapse button */}
            {block.transactions.length > 5 && (
              <div className="text-center mt-2">
                <button
                  onClick={() => setIsTxExpanded(!isTxExpanded)}
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {isTxExpanded ? 'Show Less' : `+ ${block.transactions.length - 5} more transactions`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};