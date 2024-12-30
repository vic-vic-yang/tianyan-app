'use client';

import { Button } from '@repo/ui/components/ui/button';
import { useDialog } from './contexts/DialogProvider';
import MainLayout from './layouts/MainLayout';

export default function Home() {
  const { openLogin } = useDialog();
  return (
    <MainLayout>
      <div>
        <Button onClick={openLogin}>Login</Button>
      </div>
    </MainLayout>
  );
}
