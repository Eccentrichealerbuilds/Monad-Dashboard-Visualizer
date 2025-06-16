import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatHash, formatNumber } from '../../utils/formatters';
import { WalletIcon, CopyIcon, SearchIcon, CheckIcon } from 'lucide-react';
import { getTopAddresses } from '../../services/api';

interface TopAddress {
  address: string;
  count: number;
}

export const TopAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<TopAddress[]>([]);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopAddresses = async () => {
      try {
        const data = await getTopAddresses();
        setAddresses(data.topSenders || []);
      } catch (error) {
        console.error("Failed to fetch top addresses:", error);
      }
    };
    fetchTopAddresses();
  }, []);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleView = (address: string) => {
    navigate(`/transactions?search=${address}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <WalletIcon size={18} className="text-purple-500" />
          Top Senders (by Transactions)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transactions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {addresses.map(({ address, count }) => (
              <tr key={address} className="hover:bg-purple-50 dark:hover:bg-purple-900/10">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <WalletIcon size={12} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <span className="text-sm font-mono">{formatHash(address)}</span>
                    <button onClick={() => handleCopy(address)} className="text-gray-400 hover:text-purple-600">
                      {copiedAddress === address ? <CheckIcon size={14} className="text-green-500" /> : <CopyIcon size={14} />}
                    </button>
                    <button onClick={() => handleView(address)} className="text-gray-400 hover:text-purple-600">
                      <SearchIcon size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {formatNumber(count)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};