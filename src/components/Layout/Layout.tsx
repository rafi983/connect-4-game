import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <main style={{ width: '100vw', minHeight: '100vh' }}>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </main>
  );
};
