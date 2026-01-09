import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { motion } from 'framer-motion';

function HabitItem({ habit, toggleHabit, deleteHabit, onEditHabit }) {
  const today = new Date();
  const todayStr = formatDate(today);
  const isCompleted = habit.completedDates.includes(todayStr);

  // Calculate Streak
  let streak = 0;
  const checkDate = new Date(today);

  if (!isCompleted) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDate(checkDate);
    if (habit.completedDates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-md dark:shadow-none transition-all mb-3"
    >
      <div className="flex items-center flex-1">
        <label className="relative flex items-center p-2 rounded-full cursor-pointer" htmlFor={`check-${habit.id}`}>
          <input
            id={`check-${habit.id}`}
            type="checkbox"
            checked={isCompleted}
            onChange={() => toggleHabit(habit.id, todayStr)}
            className="peer relative appearance-none w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer transition-all duration-200 checked:bg-indigo-500 checked:border-indigo-500 hover:border-indigo-400 dark:hover:border-indigo-400"
          />
          <svg className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </label>

        <div className="flex-1 ml-3">
          <h3 className={`font-semibold text-gray-800 dark:text-gray-100 transition-all ${isCompleted ? 'text-gray-400 dark:text-gray-500 line-through decoration-2 decoration-gray-300 dark:decoration-gray-600' : ''}`}>
            {habit.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {habit.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                {habit.category}
              </span>
            )}
            {habit.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {habit.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/30">
              <span className="mr-1">🔥</span>
              {streak} day streak
            </div>
            {isCompleted && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-900/30"
              >
                Done!
              </motion.span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEditHabit(habit)}
          className="p-2 text-gray-300 dark:text-gray-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
          title="Edit Habit"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => deleteHabit(habit.id)}
          className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          title="Delete Habit"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default HabitItem;