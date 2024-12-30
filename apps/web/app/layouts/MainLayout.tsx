import Header from '@/app/components/header';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden bg-gray-100">
      <Header />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-6">{children}</main>
    </div>
  );
}
