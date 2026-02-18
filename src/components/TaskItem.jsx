import { motion } from 'framer-motion';
import { Check, Trash2, Edit, Flag, Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const priorityConfig = {
  high: { icon: Flag, color: 'text-red-500', label: 'High' },
  medium: { icon: Flag, color: 'text-amber-500', label: 'Medium' },
  low: { icon: Flag, color: 'text-gray-500', label: 'Low' },
};

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  
  const priorityInfo = task.priority && priorityConfig[task.priority];
  const PriorityIcon = priorityInfo ? priorityInfo.icon : null;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:bg-gray-700/50 transition-shadow duration-300"
    >
      <button
        onClick={() => onToggleComplete(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 mt-1 flex items-center justify-center transition-colors duration-200 ${
          task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
        }`}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
      >
        {task.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-grow">
        <p className={`font-medium transition-colors duration-300 ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
          {task.title}
        </p>
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
          {priorityInfo && PriorityIcon && (
            <span className={`flex items-center gap-1 ${priorityInfo.color}`}>
              <PriorityIcon size={14} /> {priorityInfo.label}
            </span>
          )}
          {task.dueDate && (
             <span className={`flex items-center gap-1 ${isOverdue && !task.completed ? 'text-red-600 font-medium' : ''}`}>
               <Calendar size={14} />
               {format(new Date(task.dueDate), 'MMM d')}
             </span>
           )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
        <button onClick={() => onEdit(task)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Edit task">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Delete task">
          <Trash2 size={18} />
        </button>
      </div>
    </motion.li>
  );
};

export default TaskItem;