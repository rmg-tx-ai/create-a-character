import React, { useState, useEffect } from 'react';
import { EmployeeProfileCard } from './components/EmployeeProfileCard';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Listen for theme changes from the EmployeeProfileCard
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setIsDarkMode(event.detail.theme === 'dark mode');
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <EmployeeProfileCard onThemeChange={setIsDarkMode} />
    </div>
  );
}