import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { formatDate, getDayName } from '../utils/dateUtils';

const Dashboard = ({ habits, sleepData }) => {
    // --- Stats Calculation ---
    const stats = useMemo(() => {
        const totalHabits = habits.length;

        // Calculate Completion Rate (Last 30 Days)
        let totalOpportunities = 0;
        let totalCompleted = 0;
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dStr = formatDate(d);

            habits.forEach(h => {
                totalOpportunities++;
                if (h.completedDates.includes(dStr)) totalCompleted++;
            });
        }

        const completionRate = totalOpportunities > 0 ? Math.round((totalCompleted / totalOpportunities) * 100) : 0;

        // Best Streak
        let bestStreak = 0;
        habits.forEach(habit => {
            // Simple current streak calc (for dashboard summary)
            let currentStreak = 0;
            let checkDate = new Date();
            // Adjust if today not done yet
            if (!habit.completedDates.includes(formatDate(checkDate))) {
                checkDate.setDate(checkDate.getDate() - 1);
            }
            while (habit.completedDates.includes(formatDate(checkDate))) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
            if (currentStreak > bestStreak) bestStreak = currentStreak;
        });

        return { totalHabits, completionRate, bestStreak };
    }, [habits]);

    // --- Achievements Calculation ---
    const achievements = useMemo(() => {
        const list = [
            {
                id: 'first-step',
                icon: '🌱',
                title: 'First Step',
                desc: 'Create your first habit',
                unlocked: habits.length > 0
            },
            {
                id: 'streak-master',
                icon: '🔥',
                title: 'Streak Master',
                desc: 'Reach a 7-day streak',
                unlocked: stats.bestStreak >= 7
            },
            {
                id: 'consistency-king',
                icon: '👑',
                title: 'Consistency King',
                desc: 'Reach a 30-day streak',
                unlocked: stats.bestStreak >= 30
            },
            {
                id: 'daily-champion',
                icon: '✅',
                title: 'Daily Champion',
                desc: 'Complete all habits in a day',
                unlocked: habits.length > 0 && habits.every(h => h.completedDates.includes(formatDate(new Date())))
            },
            {
                id: 'sleep-guru',
                icon: '😴',
                title: 'Sleep Guru',
                desc: 'Log 7+ hours sleep',
                unlocked: Object.values(sleepData).some(entry => {
                    const val = typeof entry === 'object' ? entry.hours : entry;
                    return parseFloat(val) >= 7;
                })
            }
        ];
        return list;
    }, [habits, stats, sleepData]);


    // --- Charts Data ---

    // 1. Monthly Performance (Last 6 Months)
    const monthlyData = useMemo(() => {
        const data = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const year = d.getFullYear();
            const daysInMonth = new Date(year, d.getMonth() + 1, 0).getDate();

            let totalOpportunities = 0;
            let totalCompleted = 0;

            // Iterate through every day of this month
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = formatDate(new Date(year, d.getMonth(), day));
                habits.forEach(h => {
                    totalOpportunities++;
                    if (h.completedDates.includes(dateStr)) totalCompleted++;
                });
            }

            const completionRate = totalOpportunities > 0 ? Math.round((totalCompleted / totalOpportunities) * 100) : 0;
            data.push({ name: monthName, rate: completionRate });
        }
        return data;
    }, [habits]);

    // 2. Habits by Category
    const pieData = useMemo(() => {
        const counts = {};
        habits.forEach(h => {
            const cat = h.category || 'Uncategorized';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [habits]);

    // 3. Habit Comparison (Last 30 Days vs Previous 30 Days)
    const habitComparisonData = useMemo(() => {
        const today = new Date();
        return habits.map(habit => {
            let currentCount = 0;
            let previousCount = 0;

            // Current 30 days (0-29 days ago)
            for (let i = 0; i < 30; i++) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                if (habit.completedDates.includes(formatDate(d))) currentCount++;
            }

            // Previous 30 days (30-59 days ago)
            for (let i = 30; i < 60; i++) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                if (habit.completedDates.includes(formatDate(d))) previousCount++;
            }

            const rateCurrent = Math.round((currentCount / 30) * 100);
            const ratePrevious = Math.round((previousCount / 30) * 100);

            return { name: habit.name, rateCurrent, ratePrevious };
        }).sort((a, b) => b.rateCurrent - a.rateCurrent);
    }, [habits]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="p-6 space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-gray-800 dark:text-white">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400">Your progress at a glance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Habits</div>
                    <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.totalHabits}</div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">30-Day Completion</div>
                    <div className="text-4xl font-extrabold text-green-500 dark:text-green-400">{stats.completionRate}%</div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Longest Active Streak</div>
                    <div className="text-4xl font-extrabold text-orange-500 dark:text-orange-400">{stats.bestStreak} <span className="text-lg text-gray-400 font-bold">days</span></div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Performance */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Monthly Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} unit="%" />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`${value}%`, 'Completion Rate']}
                                />
                                <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                    {monthlyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.rate >= 80 ? '#10b981' : entry.rate >= 50 ? '#6366f1' : '#f59e0b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Habits by Category */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Habits by Category</h3>
                    <div className="h-64 flex items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400">No categorized habits yet</p>
                        )}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Habit Comparison Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Habit Performance (vs Previous 30 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={habitComparisonData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.5} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} unit="%" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} width={100} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value, name) => [`${value}%`, name]}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="rateCurrent" name="Last 30 Days" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={20} />
                                <Bar dataKey="ratePrevious" name="Prev 30 Days" fill="#cbd5e1" radius={[0, 4, 4, 0]} maxBarSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Achievements</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {achievements.map((ach) => (
                        <motion.div
                            key={ach.id}
                            whileHover={{ scale: 1.05 }}
                            className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${ach.unlocked
                                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700/50'
                                : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60 grayscale'
                                }`}
                        >
                            <div className="text-4xl mb-2 filter drop-shadow-sm">{ach.icon}</div>
                            <h4 className={`font-bold text-sm ${ach.unlocked ? 'text-gray-800 dark:text-white' : 'text-gray-500'}`}>{ach.title}</h4>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{ach.desc}</p>
                            {ach.unlocked && <span className="mt-2 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Unlocked!</span>}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
