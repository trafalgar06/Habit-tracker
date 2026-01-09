import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Legend } from 'recharts';
import { getDaysInMonth, formatDate, getDayName } from '../utils/dateUtils';
import SleepMonthView from './SleepMonthView';

const MonthlyView = ({ habits, currentYear, currentMonth, onToggleHabit, onDeleteHabit, sleepData, onDayClick, onMonthChange }) => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const todayDateStr = formatDate(today);

    // Calculate Habit Comparison Data (This Month vs Previous Month)
    const habitComparisonData = useMemo(() => {
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();
        const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

        return habits.map(habit => {
            // Calculate Current Month Rate
            let currentCompleted = 0;
            daysInMonth.forEach(day => {
                if (habit.completedDates && habit.completedDates.includes(formatDate(day))) {
                    currentCompleted++;
                }
            });
            const currentRate = daysInMonth.length > 0 ? Math.round((currentCompleted / daysInMonth.length) * 100) : 0;

            // Calculate Previous Month Rate
            let prevCompleted = 0;
            for (let d = 1; d <= daysInPrevMonth; d++) {
                const dateStr = formatDate(new Date(prevYear, prevMonth, d));
                if (habit.completedDates && habit.completedDates.includes(dateStr)) {
                    prevCompleted++;
                }
            }
            const prevRate = daysInPrevMonth > 0 ? Math.round((prevCompleted / daysInPrevMonth) * 100) : 0;

            return {
                name: habit.name,
                currentRate,
                prevRate
            };
        });
    }, [habits, currentYear, currentMonth, daysInMonth]);

    return (
        <div className="flex flex-col gap-6">
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => onMonthChange(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
                    title="Previous Month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                    onClick={() => onMonthChange(1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
                    title="Next Month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-20 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur p-2 md:p-4 border-b border-r border-gray-200 dark:border-gray-700 min-w-[100px] md:min-w-[200px] text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider shadow-sm">
                                Habit
                            </th>
                            <th className="hidden md:table-cell p-2 border-b border-gray-200 dark:border-gray-700 min-w-[80px] text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
                                Progress
                            </th>
                            {daysInMonth.map((date) => {
                                const dateStr = formatDate(date);
                                const isToday = isCurrentMonth && dateStr === todayDateStr;
                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                return (
                                    <th key={date.toISOString()} className={`p-1 md:p-2 border-b border-gray-200 dark:border-gray-700 min-w-[36px] md:min-w-[44px] text-center transition-colors ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/20' : isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}>
                                        <div className={`flex flex-col items-center justify-center rounded-lg py-1 ${isToday ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                            <span className="text-[10px] font-medium">{getDayName(date).charAt(0)}</span>
                                            <span className={`text-sm font-bold ${isToday ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'}`}>{date.getDate()}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                        {/* HABITS SECTION */}
                        {habits.length === 0 ? (
                            <tr>
                                <td colSpan={daysInMonth.length + 2} className="p-12 text-center text-gray-400 dark:text-gray-500">
                                    <p className="mb-2 text-lg">No habits yet</p>
                                    <p className="text-sm">Add a new habit to start tracking your month</p>
                                </td>
                            </tr>
                        ) : (
                            habits.map((habit) => {
                                let completedCount = 0;
                                daysInMonth.forEach(day => {
                                    if (habit.completedDates && habit.completedDates[formatDate(day)]) {
                                        completedCount++;
                                    }
                                });
                                const progress = Math.round((completedCount / daysInMonth.length) * 100);

                                return (
                                    <tr key={habit.id} className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-b-0">
                                        <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 group-hover:bg-gray-50/80 dark:group-hover:bg-gray-700/50 p-2 md:p-3 border-r border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm transition-colors">
                                            <div className="flex justify-between items-center group/cell">
                                                <span className="truncate pr-2 max-w-[80px] md:max-w-full" title={habit.name}>{habit.name}</span>
                                                <button
                                                    onClick={() => onDeleteHabit(habit.id)}
                                                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 focus:opacity-100 focus:outline-none"
                                                    title="Delete Habit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>

                                        <td className="hidden md:table-cell p-2 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{progress}%</span>
                                                <div className="w-8 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                        </td>

                                        {daysInMonth.map((date) => {
                                            const dateStr = formatDate(date);
                                            const isCompleted = habit.completedDates && habit.completedDates.includes(dateStr);
                                            const isToday = isCurrentMonth && dateStr === todayDateStr;
                                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                            return (
                                                <td key={`${habit.id}-${dateStr}`} className={`p-1 text-center relative ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : isWeekend ? 'bg-gray-50/30 dark:bg-gray-800/30' : ''}`}>
                                                    <label className="cursor-pointer block w-full h-10 flex justify-center items-center group/check">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!isCompleted}
                                                            onChange={() => onToggleHabit(habit.id, dateStr)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className={`
                                                        w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200
                                                        ${isCompleted
                                                                ? 'bg-green-500 text-white shadow-sm scale-100'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-transparent hover:bg-gray-200 dark:hover:bg-gray-600 scale-90 hover:scale-100'
                                                            }
                                                    `}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </label>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* HABIT PERFORMANCE COMPARISON CHART (Clustered) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                        </svg>
                    </span>
                    Habit Performance Comparison
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={habitComparisonData} barGap={8} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} unit="%" />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                                itemStyle={{ padding: 0 }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar name="This Month" dataKey="currentRate" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar name="Last Month" dataKey="prevRate" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SEPARATE SLEEP TRACKING SECTION */}
            <SleepMonthView
                currentYear={currentYear}
                currentMonth={currentMonth}
                sleepData={sleepData}
                onDayClick={onDayClick}
            />
        </div >
    );
};

export default MonthlyView;
