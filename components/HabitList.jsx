import React from 'react';
import HabitItem from './HabitItem';

function HabitList({ habits, toggleHabit, deleteHabit, onEditHabit }) {
  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No habits yet. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
      <div className="space-y-4">
        {habits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            toggleHabit={toggleHabit}
            deleteHabit={deleteHabit}
            onEditHabit={onEditHabit}
          />
        ))}
      </div>
    </div>
  );
}

export default HabitList;