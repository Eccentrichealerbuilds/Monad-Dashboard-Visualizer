import React, { useEffect, useState } from 'react';
import { formatHash, formatTimeAgo, formatNumber } from '../../utils/formatters';
import { BlockModal } from '../modals/BlockModal';
import { BoxIcon, SearchIcon } from 'lucide-react';
import { getBlocks, getBlockByNumber } from '../../services/api';
import { Block } from '../../types';

export const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const blocksData = await getBlocks();
        setBlocks(blocksData.reverse());
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
      }
    };
    fetchBlocks();
    const intervalId = setInterval(fetchBlocks, 8000);
    return () => clearInterval(intervalId);
  }, []);

  const handleViewBlock = (block: any) => {
    setSelectedBlock(block);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    const localResult = blocks.find(b => 
        String(parseInt(b.number, 16)) === query || 
        b.hash.toLowerCase() === query.toLowerCase()
    );

    if (localResult) {
      setSelectedBlock(localResult);
      return;
    }

    setIsLoading(true);
    try {
      const blockData = await getBlockByNumber(query);
      if (blockData) {
        setSelectedBlock(blockData);
      } else {
        alert("Block not found.");
      }
    } catch (error) {
      alert("Block not found. Please ensure you are searching by block number.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlocks = searchTerm
    ? blocks.filter(block =>
        String(parseInt(block.number, 16)).includes(searchTerm) ||
        block.hash.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : blocks;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-600 bg-clip-text text-transparent">
        Blocks
      </h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search any block by number or hash..."
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
            <BoxIcon size={18} className="text-purple-500" />
            Latest Blocks
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Block</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hash</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Miner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Txns</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gas Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredBlocks.map(block => (
                <tr key={block.hash} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer" onClick={() => handleViewBlock(block)}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                        <BoxIcon size={12} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{parseInt(block.number, 16)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatHash(block.hash)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatHash(block.miner)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(parseInt(block.timestamp, 16) * 1000)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{block.transactions.length}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatNumber(parseInt(block.size, 16))} bytes</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatNumber(parseInt(block.gasUsed, 16))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedBlock && <BlockModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />}
    </div>
  );
};