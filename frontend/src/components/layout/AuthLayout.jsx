import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7F7F9]">
      {/* Logo */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center px-8 border-b bg-white/80 backdrop-blur-sm z-50">
        <h1 className="text-lg font-bold text-primary flex items-center">
          <span className="h-2.5 w-2.5 rounded-full bg-primary mr-2" />
          EventXpert
        </h1>
      </header>

      {/* Content */}
      <main className="min-h-screen pt-16 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[440px] mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500 bg-white/80 backdrop-blur-sm border-t">
        <p>© 2024 EventXpert. All rights reserved.</p>
      </footer>
    </div>
  );
}; 