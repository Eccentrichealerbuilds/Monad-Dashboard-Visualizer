import React from 'react';
import { formatHash, formatNumber, formatValue } from '../../utils/formatters';
import { XIcon } from 'lucide-react';

interface TransactionModalProps {
  transaction: any;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose
}) => {
  if (!transaction) return null;

  // Gas price is usually in Wei, converting to Gwei for readability
  const gasPriceInGwei = (parseInt(transaction.gasPrice, 16) / 1e9).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Hash</p>
              <p className="font-mono text-sm break-all">{transaction.hash}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Block</p>
              <p>{parseInt(transaction.blockNumber, 16)}</p>
            </div>
            {/* Timestamp is not available on the transaction object from the backend, so it's removed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                <p className="font-mono text-sm break-all">{transaction.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                <p className="font-mono text-sm break-all">{transaction.to}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Value</p>
              <p className="text-lg font-semibold">{formatValue(transaction.value)} MON</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gas Price</p>
                <p>{gasPriceInGwei} Gwei</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gas Used</p>
                <p>{formatNumber(parseInt(transaction.gas, 16))}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};