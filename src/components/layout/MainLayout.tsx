import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Outlet /> {/* This is where the child routes (Dashboard, News, AI, Contact) will render */}
      </main>
    </div>
  );
};

export default MainLayout;