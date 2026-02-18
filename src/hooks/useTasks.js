import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'quicktask_v1';

export const useTasks = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Failed to parse tasks from localStorage on init.", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage.", error);
    }
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `${Date.now()}-${Math.random()}`,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const exportTasks = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(tasks, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "quicktask_backup.json";
    link.click();
  }, [tasks]);

  const importTasks = useCallback((json, { merge = false } = {}) => {
    try {
      const imported = JSON.parse(json);
      if (!Array.isArray(imported) || !imported.every(task => 'id' in task && 'title' in task)) {
        throw new Error("Invalid JSON format for tasks.");
      }
      if (merge) {
        setTasks(prevTasks => {
          const taskMap = new Map(prevTasks.map(t => [t.id, t]));
          imported.forEach(t => taskMap.set(t.id, t));
          return Array.from(taskMap.values());
        });
      } else {
        setTasks(imported);
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to import tasks:", error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    exportTasks,
    importTasks,
  };
};