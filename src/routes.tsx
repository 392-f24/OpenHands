import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useOrganizationStore, useUserStore } from './stores';

import Home from '@/pages/Home';
import Schedule from '@/pages/Schedule';
import Saved from '@/pages/Saved';
import Alerts from '@/pages/Alerts';

import { ProtectedRoute, Layout } from '@/components/common';

const AppRoutes = () => {
  const routeConfig = [
    { path: 'schedule', element: <Schedule /> },
    { path: 'saved', element: <Saved /> },
    { path: 'alerts', element: <Alerts /> },
  ];

  const loading = useUserStore((state) => state.loading);
  const user = useUserStore((state) => state.user);
  const subscribeToProfiles = useOrganizationStore(
    (state) => state.subscribeToProfiles
  );
  const error = useOrganizationStore((state) => state.error);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'organization')) {
      const unsubscribe = subscribeToProfiles;

      return () => unsubscribe && unsubscribe();
    }
  }, [loading, user, subscribeToProfiles]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Routes>
      <Route
        path='/'
        element={<Layout />}
      >
        <Route
          index
          element={<Home />}
        />
        {routeConfig.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute element={element} />}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
