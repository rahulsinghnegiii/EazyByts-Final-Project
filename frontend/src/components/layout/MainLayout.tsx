import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  onLogout,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#059669',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#DC2626',
            },
          },
        }}
      />
      
      <Header user={user} onLogout={onLogout} />
      
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}; 