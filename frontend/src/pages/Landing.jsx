import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home';

export default function Landing() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Add dark class on mount to ensure default is dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDark={isDark} toggleDark={toggleDark} />
      <div className="flex-grow">
        <Home />
      </div>
    </div>
  );
}
