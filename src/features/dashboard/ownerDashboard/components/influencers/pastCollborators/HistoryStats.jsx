import { CheckCircle2, Users, Layers, Calendar } from 'lucide-react';

function HistoryStats({ collaborations }) {
  const totalCount = collaborations.length;
  const totalCompleted = collaborations.filter(c => c.status === 'completed').length;
  const uniqueInfluencers = new Set(collaborations.map(c => c.influencerId).filter(Boolean)).size;
  const uniquePlatforms = new Set(collaborations.map(c => c.platform).filter(Boolean)).size;

  const stats = [
    { label: 'Total Collaborations', value: totalCount,       icon: Calendar,      color: 'text-white',         bg: 'bg-white/10' },
    { label: 'Completed',           value: totalCompleted,   icon: CheckCircle2,  color: 'text-green-400',     bg: 'bg-green-500/20' },
    { label: 'Unique Influencers',  value: uniqueInfluencers, icon: Users,         color: 'text-[#C1B6FD]',    bg: 'bg-[#745CB4]/20' },
    { label: 'Platforms Used',      value: uniquePlatforms,  icon: Layers,        color: 'text-amber-400',     bg: 'bg-amber-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const StatIcon = stat.icon;
        return (
        <div key={stat.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <StatIcon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

export default HistoryStats;
