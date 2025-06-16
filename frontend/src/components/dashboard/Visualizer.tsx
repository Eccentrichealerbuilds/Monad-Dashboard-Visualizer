import React, { useEffect, useState, useRef } from 'react';
import { generateVisualizerData } from '../../utils/mockData';
export const Visualizer: React.FC = () => {
  const [bands, setBands] = useState<number[]>(generateVisualizerData());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Update visualizer data every 200ms
    intervalRef.current = setInterval(() => {
      setBands(generateVisualizerData());
    }, 200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Live Network Activity</h2>
      <div className="flex items-end justify-around h-40 gap-1">
        {bands.map((height, index) => <div key={index} className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md transition-all duration-200 ease-in-out" style={{
        height: `${height}%`
      }} />)}
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Visualizing real-time blockchain activity
      </div>
    </div>;
};