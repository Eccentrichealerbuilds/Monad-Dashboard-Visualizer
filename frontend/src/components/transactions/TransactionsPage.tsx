import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatHash, formatValue, formatNumber } from '../../utils/formatters';
import { TransactionModal } from '../modals/TransactionModal';
import { ArrowLeftRightIcon, SearchIcon } from 'lucide-react';
import { getTransactions, getTransactionReceiptByHash } from '../../services/api';
import { Transaction } from '../../types';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.reverse());
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    const localResult = transactions.find(tx => tx.hash.toLowerCase() === query.toLowerCase());
    if (localResult) {
      setSelectedTransaction(localResult);
      return;
    }

    setIsLoading(true);
    try {
      const receiptData = await getTransactionReceiptByHash(query);
      if (receiptData) {
        alert("Transaction Receipt Found:\n\n" + JSON.stringify(receiptData, null, 2));
      } else {
        alert("Transaction not found.");
      }
    } catch (error) {
      alert("Transaction not found.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = searchTerm
    ? transactions.filter(tx =>
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.to && tx.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(parseInt(tx.blockNumber, 16)).includes(searchTerm)
      )
    : transactions;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-600 bg-clip-text text-transparent">
        Transactions
      </h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search any transaction by hash..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button type="submit" className="absolute left-3 top-3 text-gray-400" disabled={isLoading}>
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500" /> : <SearchIcon size={20} />}
          </button>
        </div>
      </form>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ArrowLeftRightIcon size={18} className="text-purple-500" />
            All Transactions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hash</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Block</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.map(tx => (
                <tr key={tx.hash} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer" onClick={() => handleViewTransaction(tx)}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                        <ArrowLeftRightIcon size={12} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm">{formatHash(tx.hash)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-600 dark:text-purple-400">{parseInt(tx.blockNumber, 16)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatHash(tx.from)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatHash(tx.to)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatValue(tx.value)} MON</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatNumber(parseInt(tx.gas, 16))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedTransaction && <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </div>
  );
};