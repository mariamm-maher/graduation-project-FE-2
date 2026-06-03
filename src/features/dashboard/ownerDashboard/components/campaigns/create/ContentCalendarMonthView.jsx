import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Clock,
  Info,
} from 'lucide-react';

const formatLabel = (value) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getStatusColor = (status) => {
  const colors = {
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    planned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

function DayDetailsModal({ day, formatDate, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!day) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="calendar-popup relative w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#12121f] border border-[#C1B6FD]/30 rounded-2xl shadow-2xl shadow-purple-500/25 mx-1 sm:mx-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendar-day-modal-title"
        >
          <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-white/10 shrink-0">
            <div className="min-w-0 pr-2">
              <h3
                id="calendar-day-modal-title"
                className="text-base sm:text-lg font-bold text-white leading-snug"
              >
                {day.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {day.items.length} {day.items.length === 1 ? 'task' : 'tasks'} scheduled
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
            {day.items.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-semibold text-white">
                    {formatLabel(item.contentType)}
                  </h4>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(item.status)}`}
                  >
                    {formatLabel(item.status)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {item.platform && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#745CB4]/20 text-[#C1B6FD] border border-[#C1B6FD]/20 capitalize">
                      {formatLabel(item.platform)}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 border border-white/10">
                    {formatDate(item.date)}
                  </span>
                </div>

                {item.task && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Task
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">{item.task}</p>
                  </div>
                )}

                {item.caption && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Caption
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.caption}</p>
                  </div>
                )}

                {item.isOverview && (
                  <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs border border-amber-500/30">
                    Overview from tactical plan
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// function CalendarDayCell({ dayData, onOpenDetails, compact }) {
//   const hasItems = dayData.items.length > 0;
//   const itemCount = dayData.items.length;

//   const openDetails = (e) => {
//     e.stopPropagation();
//     if (hasItems) onOpenDetails(dayData);
//   };

//   const cellTone = dayData.isToday
//     ? 'bg-gradient-to-br from-[#745CB4]/25 to-[#C1B6FD]/10 border-[#C1B6FD]/50 shadow-md shadow-purple-500/20'
//     : dayData.isPast
//     ? 'bg-white/[0.02] border-white/5 opacity-60'
//     : 'bg-white/5 border-white/10';

//   const taskHighlight = hasItems
//     ? 'ring-1 ring-[#C1B6FD]/35 bg-[#745CB4]/15 border-[#C1B6FD]/30'
//     : '';

//   return (
//     <button
//       type="button"
//       onClick={openDetails}
//       disabled={!hasItems}
//       aria-label={
//         hasItems
//           ? `${dayData.day}, ${itemCount} scheduled task${itemCount === 1 ? '' : 's'}`
//           : `${dayData.day}, no tasks`
//       }
//       className={`
//         w-full flex flex-col items-center text-left
//         min-h-[3.25rem] sm:min-h-[120px]
//         ${compact ? 'sm:min-h-[160px]' : ''}
//         rounded-lg sm:rounded-2xl p-1 sm:p-3 border transition-all
//         ${hasItems ? 'cursor-pointer active:scale-[0.98] sm:hover:shadow-lg sm:hover:shadow-purple-500/15' : 'cursor-default'}
//         ${cellTone}
//         ${taskHighlight}
//         sm:ring-0 sm:hover:border-[#C1B6FD]/30 sm:hover:bg-white/[0.08]
//         disabled:active:scale-100
//       `}
//     >
//       <div className="w-full flex items-center justify-center sm:justify-between mb-0 sm:mb-2 relative">
//         <span
//           className={`
//             text-[11px] sm:text-sm font-bold leading-none
//             ${dayData.isToday
//               ? 'text-[#C1B6FD] sm:text-lg'
//               : dayData.isPast
//               ? 'text-gray-500'
//               : hasItems
//               ? 'text-white'
//               : 'text-gray-300'
//             }
//           `}
//         >
//           {dayData.day}
//         </span>
//         {dayData.isToday && (
//           <motion.div
//             animate={{ scale: [1, 1.2, 1] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="hidden sm:block w-2 h-2 rounded-full bg-[#C1B6FD] shadow-lg shadow-purple-500/50"
//           />
//         )}
//         {dayData.isToday && (
//           <span className="sm:hidden absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#C1B6FD]" />
//         )}
//       </div>

//       {/* Mobile: dots + count hint */}
//       {hasItems && (
//         <div className="flex sm:hidden flex-col items-center gap-0.5 mt-0.5 w-full">
//           <div className="flex items-center justify-center gap-0.5 flex-wrap max-w-full px-0.5">
//             {dayData.items.slice(0, 3).map((_, i) => (
//               <span
//                 key={i}
//                 className="w-1.5 h-1.5 rounded-full bg-[#C1B6FD] shadow-sm shadow-purple-500/40"
//               />
//             ))}
//             {itemCount > 3 && (
//               <span className="text-[8px] font-bold text-[#C1B6FD] leading-none">
//                 +{itemCount - 3}
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Desktop: content types + more details */}
//       {hasItems && (
//         <div className="hidden sm:flex sm:flex-col w-full space-y-1.5 flex-1">
//           {dayData.items.slice(0, compact ? 5 : 3).map((item, itemIndex) => (
//             <div
//               key={itemIndex}
//               className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10"
//             >
//               <span className="text-xs font-medium text-white block truncate">
//                 {formatLabel(item.contentType)}
//               </span>
//             </div>
//           ))}

//           {dayData.items.length > (compact ? 5 : 3) && (
//             <p className="text-[10px] text-gray-500 text-center">
//               +{dayData.items.length - (compact ? 5 : 3)} more
//             </p>
//           )}

//           <span className="w-full mt-auto text-[10px] font-semibold text-[#C1B6FD] text-center py-1.5 rounded-lg border border-[#C1B6FD]/20 bg-[#745CB4]/10">
//             More details
//           </span>
//         </div>
//       )}
//     </button>
//   );
// }

function CalendarDayCell({ dayData, onOpenDetails, compact = false }) {
  const hasItems = dayData.items.length > 0;
  const itemCount = dayData.items.length;

  const openDetails = (e) => {
    e.stopPropagation();
    if (hasItems) onOpenDetails(dayData);
  };

  const cellTone = dayData.isToday
    ? 'bg-gradient-to-br from-[#745CB4]/25 to-[#C1B6FD]/10 border-[#C1B6FD]/50 shadow-md shadow-purple-500/20'
    : dayData.isPast
    ? 'bg-white/[0.02] border-white/5 opacity-60'
    : 'bg-white/5 border-white/10';

  const taskHighlight = hasItems
    ? 'ring-1 ring-[#C1B6FD]/35 bg-[#745CB4]/15 border-[#C1B6FD]/30'
    : '';

  return (
    <button
      type="button"
      onClick={openDetails}
      disabled={!hasItems}
      aria-label={
        hasItems
          ? `${dayData.day}, ${itemCount} scheduled task${itemCount === 1 ? '' : 's'}`
          : `${dayData.day}, no tasks`
      }
      className={`
        w-full flex flex-col items-center text-left
        min-h-[3.25rem] sm:min-h-[118px]   /* ✅ موحدة أكتر */
        ${compact ? 'sm:min-h-[118px]' : ''}   /* ✅ خليتها نفس الـ month */
        rounded-lg sm:rounded-2xl p-1 sm:p-3 border transition-all
        ${hasItems ? 'cursor-pointer active:scale-[0.98] sm:hover:shadow-lg sm:hover:shadow-purple-500/15' : 'cursor-default'}
        ${cellTone}
        ${taskHighlight}
        sm:ring-0 sm:hover:border-[#C1B6FD]/30 sm:hover:bg-white/[0.08]
        disabled:active:scale-100
      `}
    >
      {/* Header (Day Number) */}
      <div className="w-full flex items-center justify-center sm:justify-between mb-1 sm:mb-2 relative">
        <span
          className={`
            text-[11px] sm:text-sm font-bold leading-none
            ${dayData.isToday
              ? 'text-[#C1B6FD] sm:text-lg'
              : dayData.isPast
              ? 'text-gray-500'
              : hasItems
              ? 'text-white'
              : 'text-gray-300'
            }
          `}
        >
          {dayData.day}
        </span>
        {dayData.isToday && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hidden sm:block w-2 h-2 rounded-full bg-[#C1B6FD] shadow-lg shadow-purple-500/50"
          />
        )}
      </div>

      {/* Mobile */}
      {hasItems && (
        <div className="flex sm:hidden flex-col items-center gap-0.5 mt-0.5 w-full">
          <div className="flex items-center justify-center gap-0.5 flex-wrap max-w-full px-0.5">
            {dayData.items.slice(0, 3).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#C1B6FD]" />
            ))}
            {itemCount > 3 && (
              <span className="text-[8px] font-bold text-[#C1B6FD]">+{itemCount - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Desktop Content */}
      {hasItems && (
        <div className="hidden sm:flex sm:flex-col w-full space-y-1.5 flex-1 pt-1">
          {dayData.items.slice(0, compact ? 4 : 3).map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white truncate"
            >
              {formatLabel(item.contentType)}
            </div>
          ))}

          {dayData.items.length > (compact ? 4 : 3) && (
            <p className="text-[10px] text-gray-500 text-center mt-1">
              +{dayData.items.length - (compact ? 4 : 3)} more
            </p>
          )}

          <span className="mt-auto text-[10px] font-semibold text-[#C1B6FD] text-center py-1.5 rounded-lg border border-[#C1B6FD]/20 bg-[#745CB4]/10">
            More details
          </span>
        </div>
      )}
    </button>
  );
}

export default function ContentCalendarMonthView({
  calendarItems = [],
  calendarMeta = {},
  formatDate = (d) => d,
  showAllCalendar = false,
  setShowAllCalendar = () => {},
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedDay, setSelectedDay] = useState(null);

  const closeModal = () => setSelectedDay(null);
  const openDayDetails = (dayData) => {
    if (dayData?.items?.length) setSelectedDay(dayData);
  };

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);

      const dayItems = calendarItems.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getDate() === day &&
          itemDate.getMonth() === month &&
          itemDate.getFullYear() === year
        );
      });

      days.push({
        day,
        date,
        dateStr: date.toISOString().split('T')[0],
        items: dayItems,
        isToday: new Date().toDateString() === date.toDateString(),
        isPast: date < new Date().setHours(0, 0, 0, 0),
      });
    }

    return { days, firstDay, lastDay };
  }, [currentDate, calendarItems]);

  const weekData = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayItems = calendarItems.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === date.toDateString();
      });

      days.push({
        day: date.getDate(),
        date,
        dateStr: date.toISOString().split('T')[0],
        items: dayItems,
        isToday: new Date().toDateString() === date.toDateString(),
        isPast: date < new Date().setHours(0, 0, 0, 0),
      });
    }

    return { days, startOfWeek };
  }, [currentDate, calendarItems]);

  const dayData = useMemo(() => {
    const dayItems = calendarItems.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === currentDate.toDateString();
    });

    return {
      date: currentDate,
      dateStr: currentDate.toISOString().split('T')[0],
      items: dayItems,
      isToday: new Date().toDateString() === currentDate.toDateString(),
      isPast: currentDate < new Date().setHours(0, 0, 0, 0),
    };
  }, [currentDate, calendarItems]);

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction * 7);
      return newDate;
    });
  };

  const navigateDay = (direction) => {
    setCurrentDate((prev) => {
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (viewMode === 'week') {
      const endOfWeek = new Date(weekData.startOfWeek);
      endOfWeek.setDate(weekData.startOfWeek.getDate() + 6);
      return `${weekData.startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return '';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-xl border border-[#C1B6FD]/20 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl shadow-purple-500/10 overflow-visible"
      >
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate(-1)}
              className="p-2 shrink-0 rounded-xl bg-white/5 border border-white/10 hover:border-[#C1B6FD]/40 hover:bg-[#745CB4]/10 transition-all text-white"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="text-center min-w-0 flex-1 px-1">
              <h2 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-white via-[#C1B6FD] to-white bg-clip-text text-transparent truncate">
                {getHeaderTitle()}
              </h2>
              <p className="hidden sm:block text-xs text-gray-400 mt-1">
                {calendarItems.length} entries · {calendarMeta.total_days || calendarItems.length} days scheduled
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate(1)}
              className="p-2 shrink-0 rounded-xl bg-white/5 border border-white/10 hover:border-[#C1B6FD]/40 hover:bg-[#745CB4]/10 transition-all text-white"
              aria-label="Next period"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
  
  {/* View Mode Buttons - Full Width Stretch */}
<div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 w-full sm:w-auto sm:flex-1">
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
      aria-label={`${view.label} view`}
      className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 
        px-3 sm:px-6 py-2.5 rounded-lg transition-all font-medium min-w-0
        ${viewMode === view.id
          ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-purple-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
      <view.icon className="w-4 h-4 shrink-0" />
      <span className="text-xs sm:text-sm hidden sm:inline">
        {view.label}
      </span>
    </motion.button>
  ))}
</div>

  {/* Add Content Button - pushed to the far right */}
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex w-full sm:w-auto sm:ml-auto items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl text-white text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all shrink-0"
  >
    <Plus className="w-4 h-4 shrink-0" />
    <span>Add Content</span>
  </motion.button>
</div>
        </div>

        {(viewMode === 'month' || viewMode === 'week') && (
          <>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-2 mb-1 sm:mb-2">
              {weekDays.map((day, i) => (
                <div
                  key={day}
                  className="text-center py-1 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  <span className="sm:hidden">{weekDaysShort[i]}</span>
                  <span className="hidden sm:inline">{day}</span>
                </div>
              ))}
            </div>
            <p className="flex sm:hidden items-center justify-center gap-1.5 text-[10px] text-gray-500 mb-2">
              <span className="inline-flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C1B6FD]" />
              </span>
              Highlighted day = has tasks · tap to view details
            </p>
          </>
        )}

        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            <AnimatePresence mode="popLayout">
              {calendarData.days.map((dayData, index) => {
                if (!dayData) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[3.25rem] sm:min-h-[120px]"
                      aria-hidden
                    />
                  );
                }

                return (
                  <motion.div
                    key={dayData.dateStr}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: index * 0.01 }}
                  >
                    <CalendarDayCell
                      dayData={dayData}
                      onOpenDetails={openDayDetails}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            <AnimatePresence mode="popLayout">
              {weekData.days.map((dayData, index) => (
                <motion.div
                  key={dayData.dateStr}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CalendarDayCell
                    dayData={dayData}
                    onOpenDetails={openDayDetails}
                    compact={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

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
              <>
                <button
                  type="button"
                  onClick={() => openDayDetails(dayData)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-[#C1B6FD] border border-[#C1B6FD]/25 bg-[#745CB4]/10 hover:bg-[#745CB4]/20 transition-colors"
                >
                  View full day details
                </button>
                {dayData.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">
                        {formatLabel(item.contentType)}
                      </h3>
                      {item.platform && (
                        <span className="text-xs px-3 py-1 rounded-full bg-[#745CB4]/20 text-[#C1B6FD] border border-[#C1B6FD]/20 capitalize">
                          {formatLabel(item.platform)}
                        </span>
                      )}
                      <span
                        className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}
                      >
                        {formatLabel(item.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                    <button
                      type="button"
                      onClick={() => openDayDetails(dayData)}
                      className="mt-3 text-xs font-semibold text-[#C1B6FD] hover:text-white transition-colors"
                    >
                      More details
                    </button>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}

        {(calendarMeta.start_date || calendarMeta.isOverviewCalendar) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400 flex-wrap"
          >
            {calendarMeta.start_date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C1B6FD]" />
                Starts {formatDate(calendarMeta.start_date)}
              </span>
            )}
            {calendarMeta.total_days && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C1B6FD]" />
                {calendarMeta.total_days} days scheduled
              </span>
            )}
            {calendarMeta.isOverviewCalendar && (
              <span className="inline-flex items-center gap-1.5 text-amber-400/80">
                <Info className="w-3.5 h-3.5" />
                Overview from tactical plan
              </span>
            )}
          </motion.div>
        )}

        {calendarItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-[#C1B6FD]/30 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No calendar entries yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Generate a campaign to see your content calendar
            </p>
          </motion.div>
        )}
      </motion.div>

      {selectedDay && (
        <DayDetailsModal
          day={selectedDay}
          formatDate={formatDate}
          onClose={closeModal}
        />
      )}
    </>
  );
}
