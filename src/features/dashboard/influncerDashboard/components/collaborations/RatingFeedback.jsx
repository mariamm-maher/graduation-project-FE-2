import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, CheckCircle, Send } from 'lucide-react';

function RatingFeedback({ collaborationId }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [categories, setCategories] = useState({
    communication: 0,
    quality: 0,
    professionalism: 0,
    timeliness: 0,
    creativity: 0
  });
  const [feedback, setFeedback] = useState('');
  const [recommend, setRecommend] = useState(null);

  // Mock data
  const collaboration = {
    influencer: 'Sarah Johnson',
    campaign: 'Summer Fashion Launch',
    avatar: '👩',
    completedDate: '2025-11-28',
    deliverables: 4,
    engagement: '125K',
    reach: '450K'
  };

  const handleCategoryRating = (category, value) => {
    setCategories({ ...categories, [category]: value });
  };

  const handleSubmit = () => {
    const overallRating = rating || Object.values(categories).reduce((a, b) => a + b, 0) / Object.values(categories).length;
    console.log({
      collaborationId,
      overallRating,
      categories,
      feedback,
      recommend
    });
    // Handle submission logic
  };

  const categoryLabels = {
    communication: { label: 'Communication', icon: MessageSquare, description: 'Responsiveness and clarity' },
    quality: { label: 'Content Quality', icon: Star, description: 'Quality of deliverables' },
    professionalism: { label: 'Professionalism', icon: CheckCircle, description: 'Work ethic and behavior' },
    timeliness: { label: 'Timeliness', icon: TrendingUp, description: 'Meeting deadlines' },
    creativity: { label: 'Creativity', icon: Star, description: 'Innovation and originality' }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center text-3xl shadow-lg">
            {collaboration.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Rate Your Experience</h1>
            <p className="text-gray-400">{collaboration.influencer} • {collaboration.campaign}</p>
          </div>
        </div>

        {/* Campaign Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-sm text-gray-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-white">{collaboration.completedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Reach</p>
            <p className="text-lg font-bold text-[#C1B6FD]">{collaboration.reach}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Engagement</p>
            <p className="text-lg font-bold text-green-400">{collaboration.engagement}</p>
          </div>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-2 text-center">Overall Rating</h2>
        <p className="text-gray-400 text-center mb-6">How would you rate this collaboration?</p>
        
        <div className="flex justify-center gap-4 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-all duration-200 hover:scale-110"
            >
              <Star
                className={`w-12 h-12 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-gray-400">
            {rating === 5 && 'Outstanding! 🌟'}
            {rating === 4 && 'Great collaboration! 👏'}
            {rating === 3 && 'Good work 👍'}
            {rating === 2 && 'Needs improvement 🤔'}
            {rating === 1 && 'Below expectations 😕'}
          </p>
        )}
      </div>

      {/* Detailed Category Ratings */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Detailed Ratings</h2>
        
        <div className="space-y-6">
          {Object.entries(categoryLabels).map(([key, { label, icon: Icon, description }]) => (
            <div key={key} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#C1B6FD]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{label}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">
                  {categories[key] > 0 ? `${categories[key]}.0` : '-'}
                </span>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleCategoryRating(key, value)}
                    className={`flex-1 h-10 rounded-lg font-semibold transition-all ${
                      categories[key] >= value
                        ? 'bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Would Recommend */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Would you work with this influencer again?</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setRecommend(true)}
            className={`p-6 rounded-xl border-2 transition-all ${
              recommend === true
                ? 'border-green-400 bg-green-500/20'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                recommend === true ? 'bg-green-500/30' : 'bg-white/5'
              }`}>
                <ThumbsUp className={`w-8 h-8 ${recommend === true ? 'text-green-400' : 'text-gray-400'}`} />
              </div>
              <span className={`font-semibold ${recommend === true ? 'text-green-400' : 'text-gray-400'}`}>
                Yes, definitely!
              </span>
            </div>
          </button>

          <button
            onClick={() => setRecommend(false)}
            className={`p-6 rounded-xl border-2 transition-all ${
              recommend === false
                ? 'border-red-400 bg-red-500/20'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                recommend === false ? 'bg-red-500/30' : 'bg-white/5'
              }`}>
                <ThumbsDown className={`w-8 h-8 ${recommend === false ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <span className={`font-semibold ${recommend === false ? 'text-red-400' : 'text-gray-400'}`}>
                Not likely
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Written Feedback */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Additional Feedback</h2>
        <p className="text-gray-400 text-sm mb-4">Share your experience with this influencer (optional)</p>
        
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What went well? What could be improved? Any specific highlights?"
          rows="6"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD] transition-all resize-none"
        />
        
        <p className="text-xs text-gray-500 mt-2">
          This feedback will be shared with the influencer to help them improve.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-gray-300 transition-all">
          Save as Draft
        </button>
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || Object.values(categories).some(v => v === 0)}
          className="flex-1 px-6 py-4 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] hover:shadow-lg hover:shadow-purple-500/50 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          Submit Review
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-blue-400">
          <strong>Note:</strong> Your ratings help us maintain quality on the platform and will be visible to the influencer. 
          Constructive feedback helps everyone improve.
        </p>
      </div>
    </div>
  );
}

export default RatingFeedback;
