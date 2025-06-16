import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBlocksPerHour } from '../../services/api'; // This function fetches block history per minute

interface BlocksDataPoint {
  time: string;
  blocks: number;
}

export const BlocksChart: React.FC = () => {
  const [data, setData] = useState<BlocksDataPoint[]>([]);

  useEffect(() => {
    const fetchBlocksHistory = async () => {
      try {
        const historyData = await getBlocksPerHour();
        setData(historyData);
      } catch (error) {
        console.error("Failed to fetch blocks history:", error);
      }
    };
    fetchBlocksHistory();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
          <p className="font-semibold">{`Time: ${label}`}</p>
          <p className="text-purple-600">{`${payload[0].value} blocks`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Blocks Per Minute (Last 60 mins)</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#94a3b8" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis stroke="#94a3b8" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="blocks" fill="#9333ea" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};