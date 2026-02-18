import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = ({ onExport, onImport }) => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImport(e.target.result);
      };
      reader.readAsText(file);
    }
    event.target.value = null;
  };

  return (
    <header className="flex justify-between items-center mb-6 py-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">QuickTask</h1>
      <div className="flex items-center space-x-2">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          aria-label="Export tasks"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          aria-label="Import tasks"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Import</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json"
        />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;