import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import { isPast, isToday } from 'date-fns';

const App = () => {
  const { theme } = useTheme();
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, exportTasks, importTasks } = useTasks();
  
 
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('createdAt');
  const [editingTask, setEditingTask] = useState(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);

  const handleImport = (json) => {
    if (!window.confirm("Import tasks from file?")) return;
    const merge = window.confirm("OK to MERGE with existing tasks?\nCancel to REPLACE all tasks.");
    const result = importTasks(json, { merge });
    if (result.success) {
      alert("Tasks imported successfully!");
    } else {
      alert(`Import failed: ${result.error}`);
    }
  };
  
  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setRecentlyDeleted(taskToDelete);
    deleteTask(id);
    setTimeout(() => setRecentlyDeleted(null), 5000); 
  };
  
  const handleUndoDelete = () => {
    if (recentlyDeleted) {
      addTask(recentlyDeleted);
      setRecentlyDeleted(null);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter(task => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      if (filter === 'overdue') {
        return !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
      }
      return true;
    });
  }, [tasks, filter]);

  const sortedAndFilteredTasks = useMemo(() => {
    const priorityValues = { high: 3, medium: 2, low: 1 };
    return [...filteredTasks].sort((a, b) => {
      switch (sort) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          return (priorityValues[b.priority] || 0) - (priorityValues[a.priority] || 0);
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [filteredTasks, sort]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <main className="max-w-2xl mx-auto p-4 md:p-8">
        <Header onExport={exportTasks} onImport={handleImport} />
        <TaskForm onSubmit={editingTask ? (data) => { updateTask(editingTask.id, data); setEditingTask(null); } : addTask} initialData={editingTask} theme={theme} />
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto">
            {['all', 'active', 'completed', 'overdue'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filter === f ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-3 sm:mt-0">
            <select onChange={(e) => setSort(e.target.value)} value={sort} className="text-sm bg-transparent border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="createdAt">Sort by Date</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
        
        <ul className="space-y-3">
          <AnimatePresence>
            {sortedAndFilteredTasks.length > 0 ? (
              sortedAndFilteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggleComplete={toggleComplete}
                  onDelete={handleDeleteTask}
                  onEdit={(taskToEdit) => { setEditingTask(taskToEdit); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              ))
            ) : (
              <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400">No tasks match your current filter. ✨</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ul>

        <AnimatePresence>
          {recentlyDeleted && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.5 }}
              className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center gap-4"
            >
              <span>Task deleted.</span>
              <button onClick={handleUndoDelete} className="font-semibold text-emerald-400 hover:text-emerald-300">Undo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;