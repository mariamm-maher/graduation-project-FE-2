import { DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle, FileText, CreditCard } from 'lucide-react';

function ContractPayments() {
  // In a real application, this would receive collaboration data as props
  const contract = {
    totalBudget: 15000,
    paidAmount: 6000,
    pendingAmount: 4500,
    nextPayment: 4500,
    nextPaymentDate: '2026-02-15',
    milestones: [
      {
        id: 1,
        name: 'Initial Content Creation',
        amount: 5000,
        status: 'paid',
        paidDate: '2026-01-10',
        description: '3 Instagram posts + 2 Stories'
      },
      {
        id: 2,
        name: 'Content Review & Approval',
        amount: 1000,
        status: 'paid',
        paidDate: '2026-01-20',
        description: 'Content approval and revisions'
      },
      {
        id: 3,
        name: 'Content Publishing',
        amount: 4500,
        status: 'pending',
        dueDate: '2026-02-15',
        description: 'Live content on influencer channels'
      },
      {
        id: 4,
        name: 'Performance Bonus',
        amount: 4500,
        status: 'upcoming',
        dueDate: '2026-03-01',
        description: 'Based on engagement metrics'
      }
    ],
    deliverables: [
      { name: 'Instagram Posts', completed: 3, total: 5, status: 'in_progress' },
      { name: 'Instagram Stories', completed: 2, total: 3, status: 'in_progress' },
      { name: 'YouTube Video', completed: 0, total: 1, status: 'pending' },
      { name: 'TikTok Videos', completed: 1, total: 2, status: 'in_progress' }
    ]
  };

  const completionPercentage = ((contract.paidAmount / contract.totalBudget) * 100).toFixed(1);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Contract & Payments</h3>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-sm text-white font-medium hover:opacity-90 transition-opacity">
          View Contract
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-400">Total Budget</p>
          </div>
          <p className="text-2xl font-bold text-white">${contract.totalBudget.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-xs text-gray-400">Paid</p>
          </div>
          <p className="text-2xl font-bold text-white">${contract.paidAmount.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">{completionPercentage}% complete</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <p className="text-xs text-gray-400">Next Payment</p>
          </div>
          <p className="text-2xl font-bold text-white">${contract.nextPayment.toLocaleString()}</p>
          <p className="text-xs text-yellow-400 mt-1">Due Feb 15</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Payment Progress</span>
          <span className="text-sm font-semibold text-white">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Payment Milestones */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-purple-400" />
          Payment Milestones
        </h4>
        <div className="space-y-3">
          {contract.milestones.map(milestone => (
            <div 
              key={milestone.id}
              className={`p-4 rounded-lg border transition-all ${
                milestone.status === 'paid'
                  ? 'bg-green-500/10 border-green-500/30'
                  : milestone.status === 'pending'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {milestone.status === 'paid' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : milestone.status === 'pending' ? (
                      <Clock className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <h5 className="text-sm font-semibold text-white">{milestone.name}</h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{milestone.description}</p>
                  {milestone.paidDate && (
                    <p className="text-xs text-green-400">Paid on {milestone.paidDate}</p>
                  )}
                  {milestone.dueDate && milestone.status !== 'paid' && (
                    <p className="text-xs text-gray-400">Due {milestone.dueDate}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">${milestone.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    milestone.status === 'paid'
                      ? 'bg-green-500/20 text-green-400'
                      : milestone.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables Status */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          Deliverables Progress
        </h4>
        <div className="space-y-3">
          {contract.deliverables.map((deliverable, index) => {
            const progress = (deliverable.completed / deliverable.total) * 100;
            return (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{deliverable.name}</span>
                  <span className="text-xs text-gray-400">
                    {deliverable.completed}/{deliverable.total} completed
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      progress === 100 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : progress > 0
                        ? 'bg-gradient-to-r from-blue-500 to-purple-400'
                        : 'bg-gray-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ContractPayments;
