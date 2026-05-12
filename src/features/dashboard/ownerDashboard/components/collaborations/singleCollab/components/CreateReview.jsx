import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Send, Loader2, User, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import collaborationService from '../../../../../../../api/collaborationApi';

function StarRating({ rating, setRating, hoverRating, setHoverRating, disabled }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`p-1 transition-all duration-150 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            className={`w-8 h-8 ${
              star <= (hoverRating || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-[#745CB4]/50'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingLabel({ rating }) {
  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };
  return (
    <span className="text-sm font-medium text-[#C1B6FD] ml-3">
      {rating > 0 ? labels[rating] : 'Select a rating'}
    </span>
  );
}

export default function CreateReview() {
  const { id: collaborationId } = useParams();
  const navigate = useNavigate();

  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Fetch collaboration and check for existing review
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collabRes, reviewRes] = await Promise.all([
          collaborationService.getCollaborationById(collaborationId),
          collaborationService.getReview(collaborationId).catch(() => null)
        ]);

        const collab = collabRes?.collaboration || collabRes?.data?.collaboration;
        if (!collab) {
          toast.error('Collaboration not found');
          navigate('/dashboard/owner/collaborations');
          return;
        }

        // Verify collaboration is completed
        if (collab.status !== 'completed') {
          toast.error('Can only review completed collaborations');
          navigate('/dashboard/owner/collaborations');
          return;
        }

        setCollaboration(collab);

        // Check for existing review
        const review = reviewRes?.review || reviewRes?.data?.review;
        if (review) {
          setExistingReview(review);
          setRating(review.rating);
          setReviewText(review.reviewText || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error || 'Failed to load collaboration');
        navigate('/dashboard/owner/collaborations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collaborationId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    try {
      setSubmitting(true);
      await collaborationService.createReview(collaborationId, {
        rating,
        reviewText: reviewText.trim() || undefined
      });

      toast.success('Review submitted successfully!');
      navigate('/dashboard/owner/collaborations');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/owner/collaborations');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C1B6FD]" />
      </div>
    );
  }

  const influencerName = collaboration?.influencer
    ? `${collaboration.influencer.firstName || ''} ${collaboration.influencer.lastName || ''}`.trim()
    : collaboration?.influencerName || 'Influencer';

  const campaignName = collaboration?.campaign?.campaignName || collaboration?.campaignName || 'Campaign';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg bg-[#1A112C]/65 border border-[#745CB4]/25 text-[#9CA3AF] hover:text-white hover:border-[#C1B6FD]/45 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Leave a Review</h1>
          <p className="text-sm text-[#9CA3AF]">Share your experience with the influencer</p>
        </div>
      </div>

      {/* Collaboration Info Card */}
      <div className="bg-[#1A112C]/65 backdrop-blur-sm border border-[#745CB4]/25 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#C1B6FD]/20 to-[#745CB4]/20 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-[#C1B6FD]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{influencerName}</p>
            <p className="text-xs text-[#9CA3AF] truncate">{campaignName}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            Completed
          </span>
        </div>
      </div>

      {/* Existing Review Notice */}
      {existingReview && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300">Review Already Submitted</p>
            <p className="text-xs text-[#9CA3AF] mt-1">
              You have already reviewed this collaboration. Submitting again will update your review.
            </p>
          </div>
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="bg-[#1A112C]/65 backdrop-blur-sm border border-[#745CB4]/25 rounded-xl p-6 space-y-6">
        {/* Star Rating */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">
            Overall Rating <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center">
            <StarRating
              rating={rating}
              setRating={setRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
              disabled={submitting}
            />
            <RatingLabel rating={hoverRating || rating} />
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">
            Your Review <span className="text-[#9CA3AF] font-normal">(optional)</span>
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            disabled={submitting}
            placeholder="Share your experience working with this influencer..."
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl border border-[#745CB4]/25 bg-[#241A3A]/55 text-sm text-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#C1B6FD]/50 resize-none transition-all"
          />
          <p className="text-xs text-[#9CA3AF] text-right">
            {reviewText.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {existingReview ? 'Update Review' : 'Submit Review'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-[#241A3A]/40 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-[#C1B6FD] uppercase tracking-wide">Tips for a helpful review</p>
        <ul className="text-xs text-[#9CA3AF] space-y-1 list-disc list-inside">
          <li>Be specific about what went well</li>
          <li>Mention communication quality and professionalism</li>
          <li>Share results or outcomes from the collaboration</li>
          <li>Keep it constructive and professional</li>
        </ul>
      </div>
    </div>
  );
}
