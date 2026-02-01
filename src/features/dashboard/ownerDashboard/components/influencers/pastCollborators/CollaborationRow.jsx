import { CheckCircle2, XCircle, Eye, UserPlus, Calendar, TrendingUp, DollarSign } from 'lucide-react';

function CollaborationRow({ collaboration, onViewDetails, onReEngage }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle2,
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30'
        };
      default:
        return {
          label: status,
          icon: CheckCircle2,
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30'
        };
    }
  };

  const statusConfig = getStatusConfig(collaboration.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 lg:p-6 hover:bg-white/10 transition-all">
      {/* Mobile & Desktop Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
        {/* Influencer Info */}
        <div className="flex items-center gap-4 lg:w-64">
          {collaboration.influencerImage ? (
            <img
              src={collaboration.influencerImage}
              alt={collaboration.influencerName}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-white/10 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white text-base sm:text-lg shrink-0">
              {collaboration.influencerAvatar}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white truncate">
              {collaboration.influencerName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{collaboration.niche}</p>
          </div>
        </div>

        {/* Campaign & Dates - Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 flex-1 gap-4 items-center">
          {/* Campaign Name */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Campaign</p>
            <p className="text-sm font-semibold text-white truncate">{collaboration.campaignName}</p>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Duration</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs font-medium text-white">
                {collaboration.startDate} - {collaboration.endDate}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.border} border`}>
              <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
              <span className={statusConfig.color}>{statusConfig.label}</span>
            </div>
          </div>

          {/* Performance */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Performance</p>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <p className="text-sm font-bold text-white">{collaboration.performance}</p>
            </div>
          </div>
        </div>

        {/* Mobile Stats Grid */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Campaign</p>
            <p className="text-sm font-semibold text-white truncate">{collaboration.campaignName}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Status</p>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig.bg}`}>
              <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
              <span className={statusConfig.color}>{statusConfig.label}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Duration</p>
            <p className="text-xs font-medium text-white">
              {collaboration.startDate} - {collaboration.endDate}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Performance</p>
            <p className="text-sm font-bold text-white">{collaboration.performance}</p>
          </div>
        </div>

        {/* Metrics & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:w-auto lg:ml-auto">
          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-0.5">ROI</p>
              <p className="text-sm font-bold text-green-400">{collaboration.roi}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Engagement</p>
              <p className="text-sm font-bold text-blue-400">{collaboration.engagement}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Revenue</p>
              <div className="flex items-center justify-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#C1B6FD]" />
                <p className="text-sm font-bold text-[#C1B6FD]">{collaboration.revenue}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
            <button
              onClick={() => onViewDetails(collaboration)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              Details
            </button>
            <button
              onClick={() => onReEngage(collaboration)}
              className="px-4 py-2 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg text-xs font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Re-engage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollaborationRow;
