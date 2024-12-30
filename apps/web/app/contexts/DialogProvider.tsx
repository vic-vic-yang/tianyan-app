'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Login from '@/app/components/login';

interface DialogContextType {
  openLogin: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ openLogin }}>
      {children}
      <Login isOpen={isOpen} onClose={closeLogin} />
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog 必须在 DialogProvider 内使用');
  }
  return context;
};