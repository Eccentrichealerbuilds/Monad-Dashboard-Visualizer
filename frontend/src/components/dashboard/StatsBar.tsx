import React from 'react';
import { ArrowUpIcon, ClockIcon, ActivityIcon, BoxIcon } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

interface StatsBarProps {
  blockNumber: number;
  tps: number;
  avgBlocksPerMin: string;
  uptime: number;
}

const formatUptime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 && days === 0) result += `${minutes}m`; // show minutes only if less than a day
    return result.trim();
}


export const StatsBar: React.FC<StatsBarProps> = ({
  blockNumber,
  tps,
  avgBlocksPerMin,
  uptime
}) => {
  const stats = [{
    icon: <BoxIcon className="text-purple-500" />,
    label: 'Latest Block',
    value: formatNumber(blockNumber)
  }, {
    icon: <ActivityIcon className="text-purple-500" />,
    label: 'TPS',
    value: tps.toFixed(2)
  }, {
    icon: <ArrowUpIcon className="text-purple-500" />,
    label: 'Blocks/Min',
    value: avgBlocksPerMin
  }, {
    icon: <ClockIcon className="text-purple-500" />,
    label: 'Uptime',
    value: formatUptime(uptime)
  }];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="font-semibold text-lg">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};