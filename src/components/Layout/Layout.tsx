import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div style={{ width: '100vw' }}>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </div>
  );
};
