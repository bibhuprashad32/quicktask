import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ onSubmit, initialData = null, theme }) => {



  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : '');
      setPriority(initialData.priority || 'medium');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setTags('');
    }
  }, [initialData]);

  const getMinDate = () => new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (dueDate && new Date(dueDate) < new Date(getMinDate())) {
      setError('Due date must be in the future.');
      return;
    }
    setError('');
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onSubmit({ title, description, dueDate, priority, tags: tagsArray });
    if (!initialData) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setTags('');
    }
  };



  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {initialData ? 'Edit Task' : 'Add New Task'}
      </h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="text"
        placeholder="Task Title (e.g., Finish project report)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
        rows="2"
      />
      <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
          <input
              id="tags"
              type="text"
              placeholder="e.g. work, urgent, review"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              min={getMinDate()}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              
              style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
            />
        </div>
        <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus size={18} /> {initialData ? 'Save Changes' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;