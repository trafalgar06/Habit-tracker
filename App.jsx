import React, { useState, useEffect } from 'react';
import HabitForm from './components/HabitForm';
import MonthlyView from './components/MonthlyView';
import Modal from './components/Modal';
import SleepForm from './components/SleepForm';
import Toast from './components/Toast';
import HabitList from './components/HabitList';
import Dashboard from './components/Dashboard';
import useLocalStorage from './utils/useLocalStorage';
import { useInstallPrompt } from './utils/useInstallPrompt';
import { AnimatePresence } from 'framer-motion';

function App() {
  // --- State Management ---

  // Habits & Sleep Data (Persisted)
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [sleepData, setSleepData] = useLocalStorage('sleepData', {});
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  // UI State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeModal, setActiveModal] = useState(null); // 'habit', 'sleep', or null
  const [selectedSleepDate, setSelectedSleepDate] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', visible: false, key: 0 });
  const [currentView, setCurrentView] = useState('monthly'); // 'monthly' or 'dashboard'

  // PWA Install Hook
  const { isInstallable, promptToInstall } = useInstallPrompt();

  // --- Effects ---

  // Apply Dark Mode Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Handlers ---

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true, key: Date.now() });
  };

  const [editingHabit, setEditingHabit] = useState(null);

  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now(),
      name: habit.name,
      description: habit.description,
      category: habit.category,
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
    setActiveModal(null);
    showToast('Habit created successfully!', 'success');
  };

  const updateHabit = (updatedData) => {
    if (editingHabit) {
      setHabits(habits.map(h => (h.id === editingHabit.id ? { ...h, ...updatedData } : h)));
      setEditingHabit(null);
      setActiveModal(null);
      showToast('Habit updated successfully!', 'success');
    }
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setActiveModal('habit');
  };

  const updateSleepData = (data) => {
    if (selectedSleepDate) {
      setSleepData(prev => ({
        ...prev,
        [selectedSleepDate]: data
      }));
      setActiveModal(null);
      showToast('Sleep log saved!', 'success');
    }
  };

  const openSleepModal = (dateStr) => {
    setSelectedSleepDate(dateStr);
    setActiveModal('sleep');
  };

  const toggleHabit = (id, dateStr) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(dateStr);
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== dateStr)
            : [...habit.completedDates, dateStr]
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabitToDelete(id);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      setHabits(prev => prev.filter(habit => habit.id !== habitToDelete));
      setHabitToDelete(null);
      showToast('Habit deleted.', 'info');
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col md:flex-row h-screen overflow-hidden transition-colors duration-300">

      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between shrink-0 z-20 transition-colors duration-300">
        <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          HabitFlow
        </h1>
        <div className="flex gap-2">
          {isInstallable && (
            <button
              onClick={promptToInstall}
              className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1"
            >
              <span>Install</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              HabitFlow
            </h1>
            <p className="text-gray-400 text-sm font-bold mt-1 tracking-wide">Build better days</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 mb-2 space-y-2">
          {/* View Toggles */}
          <button
            onClick={() => { setCurrentView('monthly'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${currentView === 'monthly' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Monthly Planner
          </button>
          <button
            onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            Analytics Dashboard
          </button>
        </div>

        <div className="px-6 mb-6 mt-4">
          <button
            onClick={() => { setActiveModal('habit'); setIsSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-lg shadow-gray-200 dark:shadow-indigo-900/20 group active:scale-[0.98]"
          >
            <span className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <span className="font-bold text-lg tracking-tight">New Habit</span>
          </button>
        </div>

        {/* Navigation / List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
          {isInstallable && (
            <div className="mb-6 px-2">
              <button
                onClick={promptToInstall}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 rounded-xl transition-all border border-indigo-100 dark:border-indigo-800"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="font-bold text-sm">Install App</span>
              </button>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Habits</span>
            {/* Desktop Theme Toggle inside Sidebar */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 dark:hover:text-indigo-400 rounded-lg transition-all"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <HabitList
            habits={habits}
            toggleHabit={toggleHabit}
            deleteHabit={deleteHabit}
            onEditHabit={openEditModal}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#F8FAFC] dark:bg-gray-900 w-full relative transition-colors duration-300">
        <div className="w-full p-4 md:p-12 overflow-x-auto">
          <AnimatePresence mode='wait'>
            {currentView === 'monthly' ? (
              <div key="monthly" className="animate-fade-in">
                <MonthlyView
                  habits={habits}
                  currentYear={currentDate.getFullYear()}
                  currentMonth={currentDate.getMonth()}
                  onToggleHabit={toggleHabit}
                  onDeleteHabit={deleteHabit}
                  sleepData={sleepData}
                  onDayClick={openSleepModal}
                  onMonthChange={(direction) => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() + direction);
                    setCurrentDate(newDate);
                  }}
                />
              </div>
            ) : (
              <div key="dashboard">
                <Dashboard habits={habits} sleepData={sleepData} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals & Toasts */}
      <AnimatePresence>
        {(!!activeModal || !!habitToDelete) && (
          <Modal
            isOpen={true}
            onClose={() => { setActiveModal(null); setHabitToDelete(null); setEditingHabit(null); }}
            title={habitToDelete ? "Delete Habit" : (activeModal === 'habit' ? (editingHabit ? "Edit Habit" : "Create New Habit") : "Log Sleep")}
          >
            {activeModal === 'habit' && (
              <HabitForm
                onSubmit={editingHabit ? updateHabit : addHabit}
                initialData={editingHabit}
              />
            )}
            {activeModal === 'sleep' && (
              <SleepForm
                dateStr={selectedSleepDate}
                initialData={sleepData[selectedSleepDate]}
                onSave={updateSleepData}
                onCancel={() => setActiveModal(null)}
              />
            )}
            {habitToDelete && (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete <span className="font-bold text-gray-800 dark:text-white">{habits.find(h => h.id === habitToDelete)?.name}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setHabitToDelete(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md shadow-red-200 dark:shadow-none transition-all"
                  >
                    Delete Habit
                  </button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.visible && (
          <Toast
            key={toast.key}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, visible: false }))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;