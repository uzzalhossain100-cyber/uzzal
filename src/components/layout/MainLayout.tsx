"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useLanguage } from '@/context/LanguageContext';
import { InstallAppBanner } from '@/components/InstallAppBanner';

const MainLayout: React.FC = () => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Outlet />
      </main>
      <InstallAppBanner />
    </div>
  );
};

export default MainLayout;