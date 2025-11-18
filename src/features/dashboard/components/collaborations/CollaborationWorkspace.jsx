import { useState } from 'react';
import { Calendar, CheckCircle, Clock, DollarSign, Upload, FileText, Image, Video, Download, MessageSquare, AlertCircle } from 'lucide-react';

function CollaborationWorkspace({ collaborationId }) {
  const [activeTab, setActiveTab] = useState('brief');

  // Mock data - would come from props or API
  const workspace = {
    influencer: 'Sarah Johnson',
    campaign: 'Summer Fashion Launch',
    avatar: '👩',
    status: 'active',
    progress: 75,
    brief: {
      objective: 'Create engaging content showcasing our new summer collection to drive awareness and sales among Gen Z audience.',
      targetAudience: 'Women aged 18-28, fashion-forward, active on Instagram and TikTok',
      keyMessages: [
        'Sustainable and eco-friendly materials',
        'Affordable luxury fashion',
        'Versatile pieces for every occasion'
      ],
      hashtags: ['#SummerStyle2024', '#EcoFashion', '#BrandName'],
      brandGuidelines: 'Maintain bright, vibrant aesthetic. Avoid direct competitor mentions.'
    },
    timeline: [
      { id: 1, task: 'Brief Review & Questions', deadline: '2025-11-05', status: 'completed' },
      { id: 2, task: 'Content Creation', deadline: '2025-11-15', status: 'completed' },
      { id: 3, task: 'Draft Submission', deadline: '2025-11-20', status: 'completed' },
      { id: 4, task: 'Revisions', deadline: '2025-11-25', status: 'in_progress' },
      { id: 5, task: 'Final Publishing', deadline: '2025-12-15', status: 'pending' }
    ],
    deliverables: [
      { 
        id: 1, 
        name: 'Instagram Carousel Post', 
        type: 'image', 
        status: 'submitted',
        file: 'instagram_carousel_v2.zip',
        submittedDate: '2025-11-21',
        feedback: 'Looks great! Please adjust caption tone to be more casual.'
      },
      { 
        id: 2, 
        name: 'Instagram Reel', 
        type: 'video', 
        status: 'submitted',
        file: 'summer_reel_final.mp4',
        submittedDate: '2025-11-22',
        feedback: 'Approved! Ready to publish.'
      },
      { 
        id: 3, 
        name: 'TikTok Video', 
        type: 'video', 
        status: 'in_review',
        file: 'tiktok_summer_dance.mp4',
        submittedDate: '2025-11-23'
      },
      { 
        id: 4, 
        name: 'Story Sequence', 
        type: 'image', 
        status: 'pending',
        file: null
      }
    ],
    payment: {
      total: 5000,
      paid: 2500,
      pending: 2500,
      milestones: [
        { name: 'Contract Signing', amount: 1500, status: 'paid', date: '2025-11-01' },
        { name: 'Draft Submission', amount: 1000, status: 'paid', date: '2025-11-20' },
        { name: 'Final Delivery', amount: 2500, status: 'pending', date: '2025-12-15' }
      ]
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'submitted':
        return 'text-green-400 bg-green-500/20';
      case 'in_progress':
      case 'in_review':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'pending':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-3xl shadow-lg">
              {workspace.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{workspace.influencer}</h1>
              <p className="text-gray-400">{workspace.campaign}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(workspace.status)}`}>
                  {workspace.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-400">{workspace.progress}% Complete</span>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-all">
            <MessageSquare className="w-5 h-5" />
            Message
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-[#745CB4] to-[#C1B6FD] transition-all duration-500"
              style={{ width: `${workspace.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {['brief', 'timeline', 'deliverables', 'payment'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'text-[#C1B6FD] border-b-2 border-[#C1B6FD]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Brief Tab */}
        {activeTab === 'brief' && (
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Campaign Objective</h3>
              <p className="text-gray-300">{workspace.brief.objective}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Target Audience</h3>
              <p className="text-gray-300">{workspace.brief.targetAudience}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Key Messages</h3>
              <ul className="space-y-2">
                {workspace.brief.keyMessages.map((message, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    {message}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Required Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {workspace.brief.hashtags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#C1B6FD]/20 text-[#C1B6FD] rounded-lg text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Brand Guidelines</h3>
              <p className="text-gray-300">{workspace.brief.brandGuidelines}</p>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="space-y-6">
              {workspace.timeline.map((item, idx) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : item.status === 'in_progress'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Clock className="w-6 h-6" />
                      )}
                    </div>
                    {idx < workspace.timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-white/10 my-2"></div>
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{item.task}</h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {item.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables Tab */}
        {activeTab === 'deliverables' && (
          <div className="space-y-4">
            {workspace.deliverables.map((deliverable) => (
              <div key={deliverable.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                      {getTypeIcon(deliverable.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{deliverable.name}</h4>
                      {deliverable.file && (
                        <p className="text-sm text-gray-400 mb-2">{deliverable.file}</p>
                      )}
                      {deliverable.submittedDate && (
                        <p className="text-xs text-gray-500">Submitted: {deliverable.submittedDate}</p>
                      )}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(deliverable.status)}`}>
                    {deliverable.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {deliverable.feedback && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-400 mb-1">Feedback</p>
                        <p className="text-sm text-gray-300">{deliverable.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

                {deliverable.file && (
                  <div className="flex gap-3 mt-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-all">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    {deliverable.status === 'submitted' && (
                      <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm text-green-400 transition-all">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-sm text-yellow-400 transition-all">
                          <MessageSquare className="w-4 h-4" />
                          Request Changes
                        </button>
                      </>
                    )}
                  </div>
                )}

                {!deliverable.file && deliverable.status === 'pending' && (
                  <div className="mt-4 p-4 bg-gray-500/10 border border-dashed border-gray-500/30 rounded-lg text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Waiting for influencer to upload</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            {/* Payment Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-400">Total Amount</span>
                </div>
                <p className="text-3xl font-bold text-white">${workspace.payment.total.toLocaleString()}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-400">Paid</span>
                </div>
                <p className="text-3xl font-bold text-green-400">${workspace.payment.paid.toLocaleString()}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-400">Pending</span>
                </div>
                <p className="text-3xl font-bold text-yellow-400">${workspace.payment.pending.toLocaleString()}</p>
              </div>
            </div>

            {/* Payment Milestones */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Payment Milestones</h3>
              <div className="space-y-4">
                {workspace.payment.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white mb-1">{milestone.name}</h4>
                      <p className="text-sm text-gray-400">Due: {milestone.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-white">${milestone.amount.toLocaleString()}</p>
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(milestone.status)}`}>
                        {milestone.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollaborationWorkspace;
