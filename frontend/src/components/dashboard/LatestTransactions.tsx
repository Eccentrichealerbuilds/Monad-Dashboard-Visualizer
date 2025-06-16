import React, { useEffect, useState } from 'react';
import { formatHash, formatValue } from '../../utils/formatters';
import { ArrowLeftRightIcon } from 'lucide-react';
import { getTransactions } from '../../services/api';
import { Transaction } from '../../types';

interface LatestTransactionsProps {
  onViewTransaction: (transaction: Transaction) => void;
}

export const LatestTransactions: React.FC<LatestTransactionsProps> = ({
  onViewTransaction
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsData: Transaction[] = await getTransactions();
        // Get the last 5 transactions and reverse them to show newest first
        const latestTransactions = transactionsData.slice(-5).reverse();
        setTransactions(latestTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 2000); // Refresh every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ArrowLeftRightIcon size={18} className="text-purple-500" />
          Latest Transactions
        </h2>
        <a href="/transactions" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hash
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Block
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                From
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.map(tx => (
              <tr key={tx.hash} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer" onClick={() => onViewTransaction(tx)}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                      <ArrowLeftRightIcon size={12} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm">{formatHash(tx.hash)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-600 dark:text-purple-400">
                  {/* Convert hex block number to decimal */}
                  {parseInt(String(tx.blockNumber), 16)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {formatHash(tx.from)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {formatHash(tx.to)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {/* Convert hex value to a readable number */}
                  {formatValue(parseInt(String(tx.value), 16))} MON
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};