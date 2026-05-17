import { useMemo, useState } from 'react';
import { FileImage, FileText, Filter, Search, CalendarClock, Upload } from 'lucide-react';

const PLACEHOLDER_UPLOADED = [
  { id: 'u1', title: 'Summer launch hero image', platform: 'Instagram', type: 'Image', updatedAt: '2 days ago' },
  { id: 'u2', title: 'Product demo reel', platform: 'TikTok', type: 'Video', updatedAt: '5 days ago' },
  { id: 'u3', title: 'Brand story carousel', platform: 'Instagram', type: 'Carousel', updatedAt: '1 week ago' },
];

const PLACEHOLDER_DRAFTS = [
  { id: 'd1', title: 'Holiday campaign caption', platform: 'Facebook', type: 'Copy', updatedAt: 'Yesterday' },
  { id: 'd2', title: 'Influencer briefing doc', platform: 'All', type: 'Document', updatedAt: '3 days ago' },
];

const PLACEHOLDER_SCHEDULED = [
  { id: 's1', title: 'Weekend promo post', platform: 'Instagram', type: 'Post', scheduledFor: 'May 20, 2026 · 10:00 AM' },
  { id: 's2', title: 'YouTube short teaser', platform: 'YouTube', type: 'Video', scheduledFor: 'May 22, 2026 · 6:00 PM' },
];

function ContentCard({ item, metaLabel, metaValue }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#C1B6FD]/30 transition-all">
      <p className="font-semibold text-white mb-1 truncate">{item.title}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{item.platform}</span>
        <span className="px-2 py-0.5 rounded-full bg-[#745CB4]/20 border border-[#C1B6FD]/20 text-[#C1B6FD]">{item.type}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {metaLabel}: <span className="text-gray-300">{metaValue}</span>
      </p>
    </div>
  );
}

function Section({ title, description, icon: Icon, accent, children, emptyMessage }) {
  const hasChildren = Array.isArray(children) && children.length > 0;

  return (
    <section className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      {hasChildren ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>
      ) : (
        <p className="text-sm text-gray-400 py-6 text-center">{emptyMessage}</p>
      )}
    </section>
  );
}

function ContentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const allItems = useMemo(
    () => [
      ...PLACEHOLDER_UPLOADED.map((item) => ({ ...item, section: 'uploaded' })),
      ...PLACEHOLDER_DRAFTS.map((item) => ({ ...item, section: 'drafts' })),
      ...PLACEHOLDER_SCHEDULED.map((item) => ({ ...item, section: 'scheduled' })),
    ],
    []
  );

  const matchesFilters = (item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.platform.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query);
    const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesPlatform && matchesType;
  };

  const uploaded = PLACEHOLDER_UPLOADED.filter(matchesFilters);
  const drafts = PLACEHOLDER_DRAFTS.filter(matchesFilters);
  const scheduled = PLACEHOLDER_SCHEDULED.filter(matchesFilters);

  const platformOptions = useMemo(() => {
    const set = new Set(allItems.map((item) => item.platform));
    return ['all', ...Array.from(set)];
  }, [allItems]);

  const typeOptions = useMemo(() => {
    const set = new Set(allItems.map((item) => item.type));
    return ['all', ...Array.from(set)];
  }, [allItems]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Content Library</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Browse uploaded assets, drafts, and scheduled posts in one place
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C1B6FD]" />
          Search &amp; Filter
        </h2>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, platform, or type..."
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
            />
          </div>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          >
            {platformOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All platforms' : option}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C1B6FD]"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All types' : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Section
        title="Uploaded Content"
        description="Published and ready-to-use media assets"
        icon={Upload}
        accent="bg-green-500/20 text-green-400"
        emptyMessage="No uploaded content matches your filters."
      >
        {uploaded.map((item) => (
          <ContentCard key={item.id} item={item} metaLabel="Updated" metaValue={item.updatedAt} />
        ))}
      </Section>

      <Section
        title="Drafts"
        description="Work in progress before publishing"
        icon={FileText}
        accent="bg-amber-500/20 text-amber-400"
        emptyMessage="No drafts match your filters."
      >
        {drafts.map((item) => (
          <ContentCard key={item.id} item={item} metaLabel="Last edited" metaValue={item.updatedAt} />
        ))}
      </Section>

      <Section
        title="Scheduled Posts"
        description="Content queued for upcoming publish times"
        icon={CalendarClock}
        accent="bg-blue-500/20 text-blue-400"
        emptyMessage="No scheduled posts match your filters."
      >
        {scheduled.map((item) => (
          <ContentCard key={item.id} item={item} metaLabel="Scheduled" metaValue={item.scheduledFor} />
        ))}
      </Section>

      {!uploaded.length && !drafts.length && !scheduled.length && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <FileImage className="w-10 h-10 mx-auto mb-3 opacity-50" />
          Try adjusting your search or filters to find content.
        </div>
      )}
    </div>
  );
}

export default ContentLibrary;
