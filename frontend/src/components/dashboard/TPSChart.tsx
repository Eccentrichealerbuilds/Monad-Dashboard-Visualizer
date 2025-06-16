import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTpsHistory } from '../../services/api';

interface TpsDataPoint {
  time: string;
  tps: number;
}

export const TPSChart: React.FC = () => {
  const [tpsData, setTpsData] = useState<TpsDataPoint[]>([]);

  useEffect(() => {
    const fetchTpsHistory = async () => {
      try {
        const data = await getTpsHistory();
        // Convert TPS string from API to number for the chart
        const formattedData = data.map((d: any) => ({
          ...d,
          tps: parseFloat(d.tps)
        }));
        setTpsData(formattedData);
      } catch (error) {
        console.error("Failed to fetch TPS history:", error);
      }
    };

    fetchTpsHistory();
    const intervalId = setInterval(fetchTpsHistory, 3000); // Refresh every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
          <p className="font-semibold">{`Time: ${label}`}</p>
          <p className="text-purple-600">{`${payload[0].value.toFixed(2)} TPS`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Transactions Per Second (Last 60 mins)</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tpsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#94a3b8" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis stroke="#94a3b8" axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="tps" stroke="#9333ea" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};