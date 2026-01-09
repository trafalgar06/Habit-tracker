import React from 'react';
import { getDaysInMonth, formatDate, getDayName } from '../utils/dateUtils';

const SleepMonthView = ({ currentYear, currentMonth, sleepData, onDayClick }) => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const todayDateStr = formatDate(today);

    return (
        <div className="mt-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-4 px-2">
                <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sleep Analysis</h3>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-20 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur p-2 md:p-4 border-b border-r border-gray-200 dark:border-gray-700 min-w-[100px] md:min-w-[200px] text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider shadow-sm">
                                Metric
                            </th>
                            <th className="hidden md:table-cell p-2 border-b border-gray-200 dark:border-gray-700 min-w-[80px] text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
                                Unit
                            </th>
                            {daysInMonth.map((date) => {
                                const dateStr = formatDate(date);
                                const isToday = isCurrentMonth && dateStr === todayDateStr;
                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                return (
                                    <th key={`sleep-header-${date.toISOString()}`} className={`p-1 md:p-2 border-b border-gray-200 dark:border-gray-700 min-w-[36px] md:min-w-[44px] text-center transition-colors ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : isWeekend ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}>
                                        <div className="flex flex-col items-center justify-center rounded-lg py-1 text-gray-400 dark:text-gray-500">
                                            <span className="text-[10px] font-medium">{getDayName(date).charAt(0)}</span>
                                            <span className={`text-sm font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{date.getDate()}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-indigo-50/10 dark:bg-indigo-900/5">
                        <tr className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 p-2 md:p-3 border-r border-gray-100 dark:border-gray-700 text-sm font-bold text-gray-800 dark:text-gray-200 shadow-sm transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <span className="hidden md:inline">Duration</span>
                                    <span className="md:hidden">Hours</span>
                                </div>
                            </td>
                            <td className="hidden md:table-cell p-2 text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                                Hrs
                            </td>
                            <td colSpan={daysInMonth.length} className="p-0 relative h-[80px] align-middle">
                                <div className="absolute inset-0 w-full h-full">
                                    <svg
                                        width="100%"
                                        height="100%"
                                        viewBox={`0 0 ${daysInMonth.length} 10`}
                                        preserveAspectRatio="none"
                                        className="overflow-visible"
                                    >
                                        {/* Grid Lines */}
                                        {daysInMonth.map((_, index) => (
                                            <line
                                                key={`grid-sleep-${index}`}
                                                x1={index + 0.5}
                                                y1="0"
                                                x2={index + 0.5}
                                                y2="10"
                                                stroke="currentColor"
                                                className="text-gray-100 dark:text-gray-700"
                                                strokeWidth="0.05"
                                            />
                                        ))}

                                        {/* Bar Chart */}
                                        {daysInMonth.map((date, index) => {
                                            const dateStr = formatDate(date);
                                            const val = sleepData && sleepData[dateStr];
                                            const hours = val ? (typeof val === 'object' ? val.hours : parseFloat(val)) : 0;

                                            if (hours <= 0) return null;

                                            const barHeight = Math.min(10, Math.max(0, hours));
                                            const y = 10 - barHeight;

                                            return (
                                                <rect
                                                    key={`bar-sleep-${dateStr}`}
                                                    x={index + 0.15}
                                                    y={y}
                                                    width="0.7"
                                                    height={barHeight}
                                                    rx="0.15"
                                                    fill="#6366f1"
                                                    className="transition-all duration-300 hover:fill-indigo-500 dark:fill-indigo-500 dark:hover:fill-indigo-400"
                                                />
                                            );
                                        })}

                                        {/* Clickable Overlay */}
                                        {daysInMonth.map((date, index) => {
                                            const dateStr = formatDate(date);
                                            const data = sleepData && sleepData[dateStr] ? (typeof sleepData[dateStr] === 'object' ? sleepData[dateStr] : { hours: parseFloat(sleepData[dateStr]), startTime: '' }) : { hours: 0, startTime: '' };

                                            return (
                                                <rect
                                                    key={`click-sleep-${dateStr}`}
                                                    x={index}
                                                    y="0"
                                                    width="1"
                                                    height="10"
                                                    fill="transparent"
                                                    className="cursor-pointer hover:fill-indigo-50/10 dark:hover:fill-indigo-500/10 transition-colors"
                                                    onClick={() => onDayClick && onDayClick(dateStr)}
                                                >
                                                    <title>{`${dateStr}\nSleep: ${data.hours} hrs`}</title>
                                                </rect>
                                            );
                                        })}
                                    </svg>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SleepMonthView;
