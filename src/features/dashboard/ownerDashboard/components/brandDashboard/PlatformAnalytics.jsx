import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

// Platform display config
const PLATFORM_CONFIG = {
  instagram: {
    label: 'Instagram',
    solid: '#dc2743',
    kpis: [
      { label: 'Followers', fmtKey: 'followersFormatted',
        trendKey: 'followerTrend' },
      { label: 'Total Likes', fmtKey: 'totalLikesFormatted',
        trendKey: null },
      { label: 'Total Comments', fmtKey: 'totalCommentsFormatted',
        trendKey: null },
      { label: 'Posts Published', fmtKey: null,
        rawKey: 'postCount', trendKey: null },
    ],
  },
  tiktok: {
    label: 'TikTok',
    solid: '#69C9D0',
    kpis: [
      { label: 'Followers', fmtKey: 'followersFormatted',
        trendKey: 'followerTrend' },
      { label: 'Total Likes', fmtKey: 'totalLikesFormatted',
        trendKey: null },
      { label: 'Total Comments', fmtKey: 'totalCommentsFormatted',
        trendKey: null },
      { label: 'Posts Published', fmtKey: null,
        rawKey: 'postCount', trendKey: null },
    ],
  },
  youtube: {
    label: 'YouTube',
    solid: '#ff4444',
    kpis: [
      { label: 'Subscribers', fmtKey: 'followersFormatted',
        trendKey: 'followerTrend' },
      { label: 'Total Likes', fmtKey: 'totalLikesFormatted',
        trendKey: null },
      { label: 'Total Comments', fmtKey: 'totalCommentsFormatted',
        trendKey: null },
      { label: 'Videos Published', fmtKey: null,
        rawKey: 'postCount', trendKey: null },
    ],
  },
  facebook: {
    label: 'Facebook',
    solid: '#1877f2',
    kpis: [
      { label: 'Followers', fmtKey: 'followersFormatted',
        trendKey: 'followerTrend' },
      { label: 'Total Likes', fmtKey: 'totalLikesFormatted',
        trendKey: null },
      { label: 'Total Comments', fmtKey: 'totalCommentsFormatted',
        trendKey: null },
      { label: 'Posts Published', fmtKey: null,
        rawKey: 'postCount', trendKey: null },
    ],
  },
}

// Bar chart colors (cycle through for content types)
const BAR_COLORS = ['#818cf8','#f472b6','#4ade80','#fb923c','#facc15','#38bdf8']

const trendText = (t) => {
  if (t === null || t === undefined) return null
  const isUp = t >= 0
  return { value: Math.abs(t), isUp }
}

export default function PlatformAnalytics({
  platforms = [],
  activePlatform,
  onPlatformChange,
  loading,
}) {
  const active = useMemo(
    () => platforms.find(p => p.platform === activePlatform) ?? platforms[0] ?? null,
    [platforms, activePlatform]
  )

  const config = active ? (PLATFORM_CONFIG[active.platform] ?? PLATFORM_CONFIG.instagram) : null

  const barData = useMemo(() => {
    if (!active?.content_types?.length) return []
    return active.content_types.map((ct, i) => ({
      label: ct.label,
      value: ct.value,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }))
  }, [active])

  // ── LOADING ──────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-3">
      {/* Tab skeletons */}
      <div className="flex gap-2">
        {[1,2,3,4].map(i => (
          <div key={i}
            className="h-8 w-24 rounded-lg bg-white/10 animate-pulse" />
        ))}
      </div>
      {/* KPI skeletons */}
      <div className="grid grid-cols-4 gap-2">
        {[1,2,3,4].map(i => (
          <div key={i}
            className="bg-white/5 rounded-xl p-3 space-y-2 animate-pulse">
            <div className="h-2 w-16 rounded bg-white/10" />
            <div className="h-6 w-20 rounded bg-white/10" />
            <div className="h-2 w-12 rounded bg-white/10" />
          </div>
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="bg-white/5 rounded-xl p-3 h-48 animate-pulse" />
    </div>
  )

  // ── NO PLATFORMS ─────────────────────────────────────────
  if (!platforms.length) return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <div className="text-2xl opacity-20">📡</div>
      <p className="text-xs text-white/30">
        No connected platforms yet — connect channels in Social Media settings
      </p>
    </div>
  )

  // ── MAIN RENDER ──────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* Platform tabs */}
      <div className="flex gap-2 flex-wrap">
        {platforms.map(p => {
          const cfg = PLATFORM_CONFIG[p.platform]
          const isActive = p.platform === activePlatform
          return (
            <button
              key={p.platform}
              onClick={() => onPlatformChange(p.platform)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg
                          text-xs font-medium border transition-all duration-150
                          ${isActive
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70'
                          }`}
            >
              {/* Platform color dot */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: cfg?.solid ?? '#818cf8' }}
              />
              {cfg?.label ?? p.platform}
              {/* Post count badge */}
              {p.postCount > 0 && (
                <span className="text-[10px] text-white/30 ml-0.5">
                  {p.postCount} posts
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* KPI Cards — 4 in a row */}
      {active && config && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {config.kpis.map((kpi) => {
            // resolve display value
            const displayVal = kpi.fmtKey
              ? (active[kpi.fmtKey] ?? '0')
              : kpi.rawKey
              ? String(active[kpi.rawKey] ?? 0)
              : '0'

            // resolve trend
            const tr = kpi.trendKey
              ? trendText(active[kpi.trendKey])
              : null

            return (
              <div
                key={kpi.label}
                className="bg-white/5 border border-white/10 rounded-xl p-3"
              >
                <p className="text-[10px] uppercase tracking-wider
                              text-white/40 mb-2">
                  {kpi.label}
                </p>
                <p className="text-xl font-medium text-white leading-none mb-1">
                  {displayVal}
                </p>
                {tr ? (
                  <p className={`text-[10px] flex items-center gap-1 mt-1
                    ${tr.isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {tr.isUp ? '↑' : '↓'} {tr.value}% vs last month
                  </p>
                ) : (
                  <p className="text-[10px] text-white/20 mt-1">
                    All time
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Horizontal bar chart — reach by content type */}
      {active && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] text-white/50">
              Reach by content type
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-white/30">
              <span
                className="w-2 h-2 rounded-sm"
                style={{ background: config?.solid ?? '#818cf8' }}
              />
              {active.accountName}
            </div>
          </div>

          {barData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart
                  data={barData}
                  layout="vertical"
                  barCategoryGap="25%"
                  margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v =>
                      v >= 1000000 ? (v/1000000).toFixed(1)+'M'
                      : v >= 1000  ? (v/1000).toFixed(0)+'K'
                      : v
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={64}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                      background: 'rgba(20,15,40,0.95)',
                      border: '0.5px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.8)',
                    }}
                    formatter={(v) => [
                      v >= 1000000 ? (v/1000000).toFixed(1)+'M'
                      : v >= 1000  ? (v/1000).toFixed(1)+'K'
                      : v,
                      'Reach'
                    ]}
                  />
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.color + 'cc'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {barData.map((entry, i) => (
                  <span key={i}
                    className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <span
                      className="w-2 h-2 rounded-sm flex-shrink-0"
                      style={{ background: entry.color + 'cc' }}
                    />
                    {entry.label} ({
                      entry.value >= 1000000
                        ? (entry.value/1000000).toFixed(1)+'M'
                        : entry.value >= 1000
                        ? (entry.value/1000).toFixed(0)+'K'
                        : entry.value
                    })
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 gap-1">
              <p className="text-xs text-white/20">No posts published yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
