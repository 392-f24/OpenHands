import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/Home';
import Schedule from '@/pages/Schedule';
import Saved from '@/pages/Saved';
import Alerts from '@/pages/Alerts';
import OrganizationDashboard from '@/pages/OrganizationDashboard';

import { ProtectedRoute } from '@/components/common';

const AppRoutes = () => {
  const routeConfig = [
    { path: '/', element: <Home /> },
    { path: '/schedule', element: <Schedule /> },
    { path: '/saved', element: <Saved /> },
    { path: '/alerts', element: <Alerts /> },
    { path: '/organization-dashboard', element: <OrganizationDashboard /> },
  ];

  return (
    <Routes>
      {routeConfig.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute element={element} />}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
