import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { time: '7 am', engagement: 4200, reach: 4800 },
  { time: '8 am', engagement: 3800, reach: 4200 },
  { time: '9 am', engagement: 5200, reach: 5800 },
  { time: '10 am', engagement: 6800, reach: 7200 },
  { time: '11 am', engagement: 8200, reach: 8800 },
  { time: '12 pm', engagement: 7600, reach: 8200 },
  { time: '1 pm', engagement: 6400, reach: 7000 },
  { time: '2 pm', engagement: 5800, reach: 6400 },
  { time: '3 pm', engagement: 9200, reach: 9800 },
  { time: '4 pm', engagement: 8800, reach: 9400 },
  { time: '5 pm', engagement: 7400, reach: 8000 },
  { time: '6 pm', engagement: 6200, reach: 6800 },
  { time: '7 pm', engagement: 5600, reach: 6200 },
  { time: '8 pm', engagement: 4800, reach: 5400 },
  { time: '9 pm', engagement: 4200, reach: 4800 },
  { time: '10 pm', engagement: 3600, reach: 4200 },
];

const dates = [
  { date: '01', day: 'Sat' },
  { date: '02', day: 'Sun' },
  { date: '03', day: 'Mon' },
  { date: '04', day: 'Tue' },
  { date: '05', day: 'Wed' },
  { date: '06', day: 'Thu' },
  { date: '07', day: 'Fri' },
  { date: '08', day: 'Sat' },
  { date: '09', day: 'Sun' },
  { date: '10', day: 'Mon' },
  { date: '11', day: 'Tue' },
  { date: '12', day: 'Wed' },
  { date: '13', day: 'Thu' },
];

function StatisticsChart() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-linear-to-r from-[#C1B6FD] to-[#745CB4] bg-clip-text text-transparent">
          Campaign Performance
        </h2>
        <div className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
          <button className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-white text-sm font-medium transition-all">
            Days
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-all">
            Weeks
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-all">
            Months
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-linear-to-r [&::-webkit-scrollbar-thumb]:from-[#C1B6FD] [&::-webkit-scrollbar-thumb]:to-[#745CB4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-[#745CB4] [&::-webkit-scrollbar-thumb]:hover:to-[#C1B6FD]">
        {dates.map((item, idx) => (
          <button
            key={idx}
            className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              idx === 9 
                ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-purple-500/50 scale-105' 
                : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:border-purple-400/30 hover:bg-white/10 hover:scale-105'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{item.date}</div>
              <div className="text-xs opacity-75">{item.day}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-purple-400/30 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 group/legend hover:scale-110 transition-transform cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-[#C1B6FD] shadow-lg shadow-purple-500/50"></div>
              <span className="text-sm text-gray-300 group-hover/legend:text-white transition-colors">Engagement</span>
            </div>
            <div className="flex items-center gap-2 group/legend hover:scale-110 transition-transform cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-[#745CB4] opacity-50 shadow-lg shadow-purple-500/30"></div>
              <span className="text-sm text-gray-300 group-hover/legend:text-white transition-colors">Projected Reach</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white group-hover:text-[#C1B6FD] transition-colors">8.2K</div>
            <div className="text-xs text-green-400 flex items-center gap-1 justify-end">
              <span className="inline-block animate-bounce">↑</span>
              <span>12.5% from yesterday</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C1B6FD" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#5D459D" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280" 
              tick={{fill: '#9ca3af', fontSize: 12}} 
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{fill: '#9ca3af', fontSize: 12}}
              axisLine={{ stroke: '#374151' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid rgba(139, 92, 246, 0.3)', 
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              itemStyle={{ color: '#C1B6FD' }}
            />
            <Area 
              type="monotone" 
              dataKey="reach" 
              stroke="#745CB4" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stroke="#C1B6FD" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorEngagement)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatisticsChart;
