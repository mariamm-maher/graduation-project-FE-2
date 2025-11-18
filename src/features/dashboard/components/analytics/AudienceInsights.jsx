import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ageData = [
  { name: '18-24', value: 28 },
  { name: '25-34', value: 42 },
  { name: '35-44', value: 18 },
  { name: '45+', value: 12 },
];

const genderData = [
  { name: 'Female', value: 62 },
  { name: 'Male', value: 35 },
  { name: 'Other', value: 3 },
];

const locationData = [
  { country: 'United States', users: 450000 },
  { country: 'United Kingdom', users: 280000 },
  { country: 'Canada', users: 180000 },
  { country: 'Australia', users: 120000 },
  { country: 'Germany', users: 95000 },
];

const COLORS = ['#C1B6FD', '#745CB4', '#5D459D', '#4A3780'];

function AudienceInsights() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Audience Insights</h1>
        <p className="text-gray-400">Demographics, interests, and behavior patterns</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">1.2M</p>
          <p className="text-sm text-gray-400">Total Audience</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">+18%</p>
          <p className="text-sm text-gray-400">Growth Rate</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">45</p>
          <p className="text-sm text-gray-400">Countries</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">25-34</p>
          <p className="text-sm text-gray-400">Primary Age Group</p>
        </div>
      </div>

      {/* Demographics Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Age Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Data */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Top Locations</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="country" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
            />
            <Bar dataKey="users" fill="#C1B6FD" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interests */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Top Interests</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#C1B6FD] mb-1">Fashion</p>
            <p className="text-sm text-gray-400">42% of audience</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#C1B6FD] mb-1">Beauty</p>
            <p className="text-sm text-gray-400">38% of audience</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#C1B6FD] mb-1">Technology</p>
            <p className="text-sm text-gray-400">28% of audience</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#C1B6FD] mb-1">Wellness</p>
            <p className="text-sm text-gray-400">24% of audience</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudienceInsights;
