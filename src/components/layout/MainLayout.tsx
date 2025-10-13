import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useLanguage } from '@/context/LanguageContext'; // Import useLanguage

const MainLayout: React.FC = () => {
  const { currentLanguage } = useLanguage(); // Get current language from context

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header key={currentLanguage} /> {/* Add key that changes with language */}
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Outlet /> {/* This is where the child routes (Dashboard, News, AI, Contact) will render */}
      </main>
    </div>
  );
};

export default MainLayout;