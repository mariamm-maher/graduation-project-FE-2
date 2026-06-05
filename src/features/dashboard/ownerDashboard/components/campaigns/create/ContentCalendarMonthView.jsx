import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Filter, LayoutGrid, List, Sparkles } from 'lucide-react';

const formatLabel = (value) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getPlatformIcon = (platform) => {
  const icons = {
    instagram: '📸',
    tiktok: '🎵',
    youtube: '▶️',
    facebook: '📘',
    twitter: '🐦',
    linkedin: '💼',
  };
  return icons[platform?.toLowerCase()] || '📱';
};

const getStatusColor = (status) => {
  const colors = {
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    planned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

const getContentTypeIcon = (contentType) => {
  const icons = {
    reel: '🎬',
    video: '🎥',
    post: '📝',
    story: '📖',
    carousel: '🖼️',
    article: '📄',
  };
  return icons[contentType?.toLowerCase()] || '📌';
};

export default function ContentCalendarMonthView({
  calendarItems = [],
  calendarMeta = {},
  formatDate = (d) => d,
  showAllCalendar = false,
  setShowAllCalendar = () => {},
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedDate && !event.target.closest('.calendar-popup')) {
        setSelectedDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDate]);

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Create array for calendar grid
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];

      // Find calendar items for this day
      const dayItems = calendarItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getDate() === day &&
               itemDate.getMonth() === month &&
               itemDate.getFullYear() === year;
      });

      days.push({
        day,
        date,
        dateStr,
        items: dayItems,
        isToday: new Date().toDateString() === date.toDateString(),
        isPast: date < new Date().setHours(0, 0, 0, 0),
      });
    }

    return { days, firstDay, lastDay };
  }, [currentDate, calendarItems]);

  // Get calendar data for week view
  const weekData = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayItems = calendarItems.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === date.toDateString();
      });

      days.push({
        day: date.getDate(),
        date,
        dateStr,
        items: dayItems,
        isToday: new Date().toDateString() === date.toDateString(),
        isPast: date < new Date().setHours(0, 0, 0, 0),
      });
    }

    return { days, startOfWeek };
  }, [currentDate, calendarItems]);

  // Get calendar data for day view
  const dayData = useMemo(() => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayItems = calendarItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === currentDate.toDateString();
    });

    return {
      date: currentDate,
      dateStr,
      items: dayItems,
      isToday: new Date().toDateString() === currentDate.toDateString(),
      isPast: currentDate < new Date().setHours(0, 0, 0, 0),
    };
  }, [currentDate, calendarItems]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  const navigateDay = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction);
      return newDate;
    });
  };

  const handleNavigate = (direction) => {
    if (viewMode === 'month') navigateMonth(direction);
    else if (viewMode === 'week') navigateWeek(direction);
    else if (viewMode === 'day') navigateDay(direction);
  };

  const handleDayClick = (e, dayData) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
    setSelectedDate(dayData.date);
  };

  const closePopup = () => {
    setSelectedDate(null);
  };

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const endOfWeek = new Date(weekData.startOfWeek);
      endOfWeek.setDate(weekData.startOfWeek.getDate() + 6);
      return `${weekData.startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-xl border border-[#C1B6FD]/20 rounded-3xl p-6 shadow-2xl shadow-purple-500/10 overflow-visible"
    >
      {/* Header Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        {/* Left: Month Navigation */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigate(-1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#C1B6FD]/40 hover:bg-[#745CB4]/10 transition-all text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="text-center min-w-[200px]">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#C1B6FD] to-white bg-clip-text text-transparent">
              {getHeaderTitle()}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {calendarItems.length} entries · {calendarMeta.total_days || calendarItems.length} days scheduled
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigate(1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#C1B6FD]/40 hover:bg-[#745CB4]/10 transition-all text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Right: View Switcher & Actions */}
        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
            {[
              { id: 'month', icon: LayoutGrid, label: 'Month' },
              { id: 'week', icon: List, label: 'Week' },
              { id: 'board', icon: Sparkles, label: 'Board' },
            ].map((view) => (
              <motion.button
                key={view.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode(view.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === view.id
                    ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <view.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{view.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Add Content Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Content</span>
          </motion.button>
        </div>
      </div>

      {/* Week Day Headers - Only show for month and week views */}
      {(viewMode === 'month' || viewMode === 'week') && (
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Calendar Grid */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-7 gap-2">
          <AnimatePresence mode="popLayout">
            {calendarData.days.map((dayData, index) => {
              if (!dayData) {
                return <div key={`empty-${index}`} className="min-h-[120px]" />;
              }

              return (
                <motion.div
                  key={dayData.dateStr}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'rgba(193, 182, 253, 0.5)',
                    boxShadow: '0 8px 30px rgba(116, 92, 180, 0.3)',
                  }}
                  onClick={(e) => handleDayClick(e, dayData)}
                  className={`
                    min-h-[120px] rounded-2xl p-3 border transition-all cursor-pointer
                    ${dayData.isToday
                      ? 'bg-gradient-to-br from-[#745CB4]/20 to-[#C1B6FD]/10 border-[#C1B6FD]/40 shadow-lg shadow-purple-500/20'
                      : dayData.isPast
                      ? 'bg-white/[0.02] border-white/5 opacity-60'
                      : 'bg-white/5 border-white/10 hover:border-[#C1B6FD]/30 hover:bg-white/[0.08]'
                    }
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`
                      text-sm font-bold
                      ${dayData.isToday
                        ? 'text-[#C1B6FD] text-lg'
                        : dayData.isPast
                        ? 'text-gray-500'
                        : 'text-white'
                      }
                    `}>
                      {dayData.day}
                    </span>
                    {dayData.isToday && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-[#C1B6FD] shadow-lg shadow-purple-500/50"
                      />
                    )}
                  </div>

                  {/* Content Items */}
                  <div className="space-y-1.5">
                    {dayData.items.slice(0, 3).map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.01 + itemIndex * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => handleDayClick(e, dayData)}
                        className="group relative p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#C1B6FD]/30 hover:bg-[#745CB4]/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{getContentTypeIcon(item.contentType)}</span>
                          <span className="text-xs font-medium text-white truncate">
                            {formatLabel(item.contentType)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#745CB4]/20 text-[#C1B6FD] border border-[#C1B6FD]/20">
                            {getPlatformIcon(item.platform)} {item.platform}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                            {formatLabel(item.status)}
                          </span>
                        </div>

                        {item.task && (
                          <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 group-hover:text-gray-300 transition-colors">
                            {item.task}
                          </p>
                        )}

                        {/* Hover Popup with Details */}
                        <AnimatePresence>
                          {selectedDate === dayData.date && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              style={{
                                position: 'fixed',
                                top: popupPosition.top,
                                left: popupPosition.left,
                                zIndex: 1000,
                              }}
                              className="calendar-popup w-80 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] backdrop-blur-xl border border-[#C1B6FD]/30 rounded-2xl p-4 shadow-2xl shadow-purple-500/30"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                                <span className="text-lg">{getContentTypeIcon(item.contentType)}</span>
                                <div>
                                  <h4 className="text-white font-semibold">{formatLabel(item.contentType)}</h4>
                                  <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                                </div>
                              </div>

                              <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{getPlatformIcon(item.platform)}</span>
                                  <span className="text-sm text-white capitalize">{item.platform}</span>
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                                  {formatLabel(item.status)}
                                </div>
                              </div>

                              {item.task && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-400 mb-1">Task</p>
                                  <p className="text-sm text-white">{item.task}</p>
                                </div>
                              )}

                              {item.caption && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-400 mb-1">Caption</p>
                                  <p className="text-sm text-gray-300 line-clamp-3">{item.caption}</p>
                                </div>
                              )}

                              {item.isOverview && (
                                <div className="inline-block px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs border border-amber-500/30">
                                  Overview from tactical plan
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}

                    {dayData.items.length > 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-[#C1B6FD] font-medium text-center py-1"
                      >
                        +{dayData.items.length - 3} more
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          <AnimatePresence mode="popLayout">
            {weekData.days.map((dayData, index) => (
              <motion.div
                key={dayData.dateStr}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  borderColor: 'rgba(193, 182, 253, 0.5)',
                  boxShadow: '0 8px 30px rgba(116, 92, 180, 0.3)',
                }}
                onClick={(e) => handleDayClick(e, dayData)}
                className={`
                  min-h-[200px] rounded-2xl p-3 border transition-all cursor-pointer
                  ${dayData.isToday
                    ? 'bg-gradient-to-br from-[#745CB4]/20 to-[#C1B6FD]/10 border-[#C1B6FD]/40 shadow-lg shadow-purple-500/20'
                    : dayData.isPast
                    ? 'bg-white/[0.02] border-white/5 opacity-60'
                    : 'bg-white/5 border-white/10 hover:border-[#C1B6FD]/30 hover:bg-white/[0.08]'
                  }
                `}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-bold
                    ${dayData.isToday
                      ? 'text-[#C1B6FD] text-lg'
                      : dayData.isPast
                      ? 'text-gray-500'
                      : 'text-white'
                    }
                  `}>
                    {dayData.day}
                  </span>
                  {dayData.isToday && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#C1B6FD] shadow-lg shadow-purple-500/50"
                    />
                  )}
                </div>

                {/* Content Items */}
                <div className="space-y-1.5">
                  {dayData.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + itemIndex * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={(e) => handleDayClick(e, dayData)}
                      className="group relative p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#C1B6FD]/30 hover:bg-[#745CB4]/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs">{getContentTypeIcon(item.contentType)}</span>
                        <span className="text-xs font-medium text-white truncate">
                          {formatLabel(item.contentType)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#745CB4]/20 text-[#C1B6FD] border border-[#C1B6FD]/20">
                          {getPlatformIcon(item.platform)} {item.platform}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                          {formatLabel(item.status)}
                        </span>
                      </div>

                      {item.task && (
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 group-hover:text-gray-300 transition-colors">
                          {item.task}
                        </p>
                      )}

                      {/* Hover Popup with Details */}
                      <AnimatePresence>
                        {selectedDate === dayData.date && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            style={{
                              position: 'fixed',
                              top: popupPosition.top,
                              left: popupPosition.left,
                              zIndex: 1000,
                            }}
                            className="calendar-popup w-80 bg-gradient-to-br from-[#1a1a2e] to-[#16162a] backdrop-blur-xl border border-[#C1B6FD]/30 rounded-2xl p-4 shadow-2xl shadow-purple-500/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                              <span className="text-lg">{getContentTypeIcon(item.contentType)}</span>
                              <div>
                                <h4 className="text-white font-semibold">{formatLabel(item.contentType)}</h4>
                                <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{getPlatformIcon(item.platform)}</span>
                                <span className="text-sm text-white capitalize">{item.platform}</span>
                              </div>
                              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                                {formatLabel(item.status)}
                              </div>
                            </div>

                            {item.task && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-400 mb-1">Task</p>
                                <p className="text-sm text-white">{item.task}</p>
                              </div>
                            )}

                            {item.caption && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-400 mb-1">Caption</p>
                                <p className="text-sm text-gray-300 line-clamp-3">{item.caption}</p>
                              </div>
                            )}

                            {item.isOverview && (
                              <div className="inline-block px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs border border-amber-500/30">
                                Overview from tactical plan
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {dayData.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-[#C1B6FD]/30 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">No content scheduled for this day</p>
            </motion.div>
          ) : (
            dayData.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#C1B6FD]/40 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{getContentTypeIcon(item.contentType)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{formatLabel(item.contentType)}</h3>
                      <span className="text-xs px-3 py-1 rounded-full bg-[#745CB4]/20 text-[#C1B6FD] border border-[#C1B6FD]/20">
                        {getPlatformIcon(item.platform)} {item.platform}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                        {formatLabel(item.status)}
                      </span>
                    </div>

                    {item.task && (
                      <p className="text-gray-200 mb-2">{item.task}</p>
                    )}

                    {item.caption && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-3">{item.caption}</p>
                    )}

                    <p className="text-xs text-gray-500">{formatDate(item.date)}</p>

                    {item.isOverview && (
                      <div className="mt-2 inline-block px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs border border-amber-500/30">
                        Overview from tactical plan
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Footer Info */}
      {(calendarMeta.start_date || calendarMeta.isOverviewCalendar) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400"
        >
          {calendarMeta.start_date && (
            <span>📅 Starts {formatDate(calendarMeta.start_date)}</span>
          )}
          {calendarMeta.total_days && (
            <span>⏱️ {calendarMeta.total_days} days scheduled</span>
          )}
          {calendarMeta.isOverviewCalendar && (
            <span className="text-amber-400/80">ℹ️ Overview from tactical plan</span>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {calendarItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-[#C1B6FD]/30 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">No calendar entries yet</p>
          <p className="text-gray-500 text-xs mt-1">Generate a campaign to see your content calendar</p>
        </motion.div>
      )}
    </motion.div>
  );
}
