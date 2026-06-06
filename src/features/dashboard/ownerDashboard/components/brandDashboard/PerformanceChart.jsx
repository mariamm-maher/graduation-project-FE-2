import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PerformanceChart({ data, period, metric, onPeriodChange, onMetricChange, loading }) {
  const periods = ['daily', 'weekly', 'monthly', 'yearly'];
  const metrics = ['reach', 'engagement', 'conversions', 'roi', 'clicks'];
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const metricLabels = {
    reach: 'Reach',
    engagement: 'Engagement',
    conversions: 'Conversions',
    roi: 'ROI',
    clicks: 'Clicks',
  };

  // Mock data for testing
  const getMockData = (period, metric) => {
    const mockData = {
      daily: [
        { date: 'Mon', value: 1200 },
        { date: 'Tue', value: 1900 },
        { date: 'Wed', value: 1500 },
        { date: 'Thu', value: 2200 },
        { date: 'Fri', value: 2800 },
        { date: 'Sat', value: 3200 },
        { date: 'Sun', value: 2900 },
      ],
      weekly: [
        { date: 'Week 1', value: 8500 },
        { date: 'Week 2', value: 12000 },
        { date: 'Week 3', value: 9800 },
        { date: 'Week 4', value: 15000 },
      ],
      monthly: [
        { date: 'Jan', value: 35000 },
        { date: 'Feb', value: 42000 },
        { date: 'Mar', value: 38000 },
        { date: 'Apr', value: 55000 },
        { date: 'May', value: 48000 },
        { date: 'Jun', value: 62000 },
      ],
      yearly: [
        { date: '2021', value: 450000 },
        { date: '2022', value: 520000 },
        { date: '2023', value: 680000 },
        { date: '2024', value: 850000 },
        { date: '2025', value: 920000 },
      ],
    };
    return mockData[period] || mockData.daily;
  };

  const chartData = data && data.length > 0 && data.some(item => item.value > 0) ? data : getMockData(period, metric);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-white/10 rounded w-48" />
            <div className="flex gap-2">
              <div className="h-8 bg-white/10 rounded w-20" />
              <div className="h-8 bg-white/10 rounded w-24" />
            </div>
          </div>
          <div className="h-64 bg-white/10 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-white">Performance Trend</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange?.(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p
                    ? 'bg-[#745CB4] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={metric}
            onChange={(e) => onMetricChange?.(e.target.value)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          >
            {metrics.map((m) => (
              <option key={m} value={m}>
                {metricLabels[m]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isMounted && (
        <div ref={containerRef} className="w-full" style={{ height: '256px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height={256} aspect={undefined} debounce={1}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C1B6FD" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C1B6FD" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(26, 9, 51, 0.9)',
                  border: '1px solid rgba(193, 182, 253, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#C1B6FD"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default PerformanceChart;
