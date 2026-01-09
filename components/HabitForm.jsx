import React, { useState } from 'react';

function HabitForm({ onSubmit, initialData = null }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [category, setCategory] = useState(initialData?.category || 'Health');

  const categories = ['Health', 'Work', 'Personal', 'Mindfulness', 'Fitness', 'Learning', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        category
      });
      if (!initialData) {
        setName('');
        setDescription('');
        setCategory('Health');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Habit Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Read 30 mins"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Description (Optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Details..."
          rows="2"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {initialData ? 'Save Changes' : 'Add Habit'}
      </button>
    </form>
  );
}

export default HabitForm;