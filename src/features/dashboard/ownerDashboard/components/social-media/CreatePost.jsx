import { useMemo, useState, useEffect } from 'react';
import { CalendarClock, Loader, PlusCircle, Trash2, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';
import useSocialMediaStore from '../../../../../stores/SocialMediaStore';

function CreatePost() {
  const {
    accounts,
    posts,
    postAnalytics,
    isLoading,
    postsLoading,
    getAccounts,
    getPosts,
    createPost,
    deletePost,
    getPostAnalytics
  } = useSocialMediaStore();

  const [content, setContent] = useState('');
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [analyticsLoadingByPost, setAnalyticsLoadingByPost] = useState({});

  useEffect(() => {
    getAccounts();
    getPosts();
  }, [getAccounts, getPosts]);

  const channelOptions = useMemo(
    () =>
      (accounts || []).map((account) => ({
        id: account.id || account._id,
        platform: account.platform,
        label: `${account.platform || 'channel'} · ${account.username || account.name || 'account'}`
      })),
    [accounts]
  );

  const toggleChannel = (id) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((channelId) => channelId !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setContent('');
    setSelectedChannels([]);
    setMediaUrl('');
    setScheduleType('now');
    setScheduledAt('');
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content is required');
      return;
    }
    if (selectedChannels.length === 0) {
      toast.error('Select at least one connected channel');
      return;
    }
    if (scheduleType === 'schedule' && !scheduledAt) {
      toast.error('Please select schedule date and time');
      return;
    }

    const payload = {
      content: content.trim(),
      channelIds: selectedChannels,
      platforms: channelOptions
        .filter((channel) => selectedChannels.includes(channel.id))
        .map((channel) => channel.platform)
        .filter(Boolean),
      mediaUrls: mediaUrl ? [mediaUrl.trim()] : [],
      publishNow: scheduleType === 'now',
      scheduledAt: scheduleType === 'schedule' ? new Date(scheduledAt).toISOString() : null
    };

    const result = await createPost(payload);
    if (result?.success) {
      toast.success(scheduleType === 'now' ? 'Post published successfully' : 'Post scheduled successfully');
      resetForm();
      await getPosts();
    } else {
      toast.error(result?.error || 'Failed to create post');
    }
  };

  const handleDeletePost = async (post) => {
    const postId = post.id || post._id;
    if (!postId) return;
    if (!window.confirm('Delete this post? This action cannot be undone.')) return;
    const result = await deletePost(postId);
    if (result?.success) {
      toast.success('Post deleted');
    } else {
      toast.error(result?.error || 'Failed to delete post');
    }
  };

  const handleLoadAnalytics = async (post) => {
    const postId = post.id || post._id;
    if (!postId) return;
    setAnalyticsLoadingByPost((prev) => ({ ...prev, [postId]: true }));
    const result = await getPostAnalytics(postId);
    setAnalyticsLoadingByPost((prev) => ({ ...prev, [postId]: false }));
    if (result?.success) {
      toast.success('Post analytics loaded');
    } else {
      toast.error(result?.error || 'Failed to load analytics');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create Post</h1>
        <p className="text-gray-400">Compose, schedule, and manage your social posts.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <form onSubmit={handleCreatePost} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Post content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Write your caption..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Select channels</label>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader className="w-4 h-4 animate-spin" />
                Loading channels...
              </div>
            ) : channelOptions.length === 0 ? (
              <p className="text-sm text-gray-400">No connected channels. Connect at least one account first.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {channelOptions.map((channel) => (
                  <label
                    key={channel.id}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(channel.id)}
                      onChange={() => toggleChannel(channel.id)}
                      className="accent-[#C1B6FD]"
                    />
                    <span>{channel.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Media URL (optional)</label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Publish type</label>
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
              >
                <option value="now" className="text-black">Publish now</option>
                <option value="schedule" className="text-black">Schedule</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Scheduled at</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                disabled={scheduleType !== 'schedule'}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={postsLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-lg font-semibold disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {postsLoading ? 'Submitting...' : scheduleType === 'schedule' ? 'Schedule Post' : 'Publish Post'}
          </button>
        </form>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your Posts</h2>
          <button
            type="button"
            onClick={getPosts}
            className="text-sm text-[#C1B6FD] hover:text-white transition-colors"
          >
            Refresh
          </button>
        </div>

        {postsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 text-[#C1B6FD] animate-spin" />
          </div>
        ) : posts?.length === 0 ? (
          <p className="text-gray-400 text-sm">No posts yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const postId = post.id || post._id;
              const analytics = postAnalytics?.[postId];
              const analyticsLoading = analyticsLoadingByPost?.[postId];
              return (
                <div key={postId} className="border border-white/10 bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-2">{post.content || post.caption || 'Untitled post'}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-white/5 rounded-md">
                          {post.status || 'draft'}
                        </span>
                        {post.scheduledAt && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/15 text-blue-300 rounded-md">
                            <CalendarClock className="w-3.5 h-3.5" />
                            {new Date(post.scheduledAt).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {analytics && (
                        <div className="mt-3 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-md p-2">
                          <p>Likes: {analytics.likes ?? analytics.likeCount ?? 0}</p>
                          <p>Comments: {analytics.comments ?? analytics.commentCount ?? 0}</p>
                          <p>Reach: {analytics.reach ?? analytics.impressions ?? 0}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadAnalytics(post)}
                        disabled={analyticsLoading}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white"
                      >
                        {analyticsLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <BarChart3 className="w-3.5 h-3.5" />}
                        Analytics
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post)}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
