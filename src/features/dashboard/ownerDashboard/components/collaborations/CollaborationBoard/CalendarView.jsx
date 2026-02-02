import { Calendar as CalendarIcon, Clock, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';

function CalendarView({ tasks = [] }) {
  const today = new Date('2026-02-01');
  const daysInMonth = 28; // February 2026
  const firstDayOfWeek = 6; // Saturday

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date && 
             taskDate.getMonth() === today.getMonth() &&
             taskDate.getFullYear() === today.getFullYear();
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">February 2026</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-all">
            Today
          </button>
          <button className="px-3 py-1.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg text-sm text-white font-medium">
            Month
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center py-2 text-xs font-semibold text-gray-400">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayTasks = day ? getTasksForDate(day) : [];
          const isToday = day === 1;
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-2 rounded-lg border transition-all ${
                day 
                  ? isToday
                    ? 'bg-purple-500/20 border-purple-500/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  : 'border-transparent'
              }`}
            >
              {day && (
                <>
                  <div className={`text-sm font-semibold mb-1 ${
                    isToday ? 'text-purple-400' : 'text-white'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded truncate ${
                          task.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : task.priority === 'high'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                        title={task.taskName}
                      >
                        {task.taskName}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          Upcoming Deadlines
        </h4>
        <div className="space-y-2">
          {tasks
            .filter(task => task.status !== 'completed')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3)
            .map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className={`w-4 h-4 ${
                      task.priority === 'high' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{task.taskName}</p>
                    <p className="text-xs text-gray-400">{task.assignedToName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.priority === 'high' 
                      ? 'bg-red-500/20 text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
