import React, { useState, useEffect } from 'react';

const SleepForm = ({ dateStr, initialData, onSave, onCancel }) => {
    // Internal state for 12-hour format handling
    const [startState, setStartState] = useState({ h: '10', m: '00', p: 'PM' });
    const [endState, setEndState] = useState({ h: '07', m: '00', p: 'AM' });
    const [durationDisplay, setDurationDisplay] = useState('0h 0m');

    // Helper: Convert "HH:mm" (24h) to { h, m, p }
    const parseTimeStr = (timeStr) => {
        if (!timeStr) return null;
        const [h24, m] = timeStr.split(':').map(Number);
        let h = h24 % 12;
        if (h === 0) h = 12;
        const p = h24 >= 12 ? 'PM' : 'AM';
        return { h: String(h), m: String(m).padStart(2, '0'), p };
    };

    // Helper: Convert { h, m, p } to "HH:mm" (24h)
    const toTimeStr = ({ h, m, p }) => {
        let h24 = parseInt(h);
        if (p === 'PM' && h24 !== 12) h24 += 12;
        if (p === 'AM' && h24 === 12) h24 = 0;
        return `${String(h24).padStart(2, '0')}:${m}`;
    };

    useEffect(() => {
        if (initialData) {
            if (initialData.startTime) {
                const parsed = parseTimeStr(initialData.startTime);
                if (parsed) setStartState(parsed);
            }
            if (initialData.wakeupTime) {
                const parsed = parseTimeStr(initialData.wakeupTime);
                if (parsed) setEndState(parsed);
            }
        }
    }, [initialData]);

    // Calculate duration
    useEffect(() => {
        const startStr = toTimeStr(startState);
        const endStr = toTimeStr(endState);

        const start = new Date(`2000-01-01T${startStr}`);
        const end = new Date(`2000-01-01T${endStr}`);

        let diffMs = end - start;
        if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000;
        }

        const diffHrs = diffMs / (1000 * 60 * 60);
        const hrs = Math.floor(diffHrs);
        const mins = Math.round((diffHrs - hrs) * 60);

        setDurationDisplay(`${hrs}h ${mins}m`);
    }, [startState, endState]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const startStr = toTimeStr(startState);
        const endStr = toTimeStr(endState);
        const start = new Date(`2000-01-01T${startStr}`);
        const end = new Date(`2000-01-01T${endStr}`);
        let diffMs = end - start;
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
        const calculatedHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
        onSave({
            hours: calculatedHours,
            startTime: startStr,
            wakeupTime: endStr
        });
    };

    // TimePicker Component
    const TimePicker = ({ label, value, onChange, icon }) => {
        const handleInputChange = (field, val) => {
            if (val && !/^\d*$/.test(val)) return;
            if (val.length > 2) return;
            onChange({ ...value, [field]: val });
        };

        return (
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                    <span>{icon}</span> {label}
                </label>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="HH"
                        value={value.h}
                        onChange={(e) => handleInputChange('h', e.target.value)}
                        onBlur={(e) => {
                            let val = parseInt(e.target.value);
                            if (isNaN(val) || val < 1) val = 1;
                            if (val > 12) val = 12;
                            onChange({ ...value, h: String(val) });
                        }}
                        className="w-20 h-12 rounded-xl border-gray-300 dark:border-gray-600 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl text-center font-bold bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all placeholder:font-normal"
                        maxLength={2}
                    />
                    <span className="text-xl font-bold text-gray-400 dark:text-gray-500 pb-1">:</span>
                    <input
                        type="text"
                        placeholder="MM"
                        value={value.m}
                        onChange={(e) => handleInputChange('m', e.target.value)}
                        onBlur={(e) => {
                            let val = parseInt(e.target.value);
                            if (isNaN(val) || val < 0) val = 0;
                            if (val > 59) val = 59;
                            onChange({ ...value, m: String(val).padStart(2, '0') });
                        }}
                        className="w-20 h-12 rounded-xl border-gray-300 dark:border-gray-600 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl text-center font-bold bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all placeholder:font-normal"
                        maxLength={2}
                    />
                    <select
                        value={value.p}
                        onChange={(e) => onChange({ ...value, p: e.target.value })}
                        className="w-24 h-12 rounded-xl border-gray-300 dark:border-gray-600 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg font-bold bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white cursor-pointer transition-all"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Log Sleep For</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid gap-6">
                <TimePicker label="Bedtime" value={startState} onChange={setStartState} icon="🌙" />
                <TimePicker label="Wake Up" value={endState} onChange={setEndState} icon="☀️" />
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-6 flex flex-col items-center justify-center border border-indigo-100 dark:border-indigo-800 mt-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Total Sleep</span>
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight">{durationDisplay}</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform active:scale-95"
                >
                    Save Sleep Log
                </button>
            </div>
        </form>
    );
};

export default SleepForm;
