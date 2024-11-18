import { Routes, Route } from 'react-router-dom';

import Home from '@/pages/Home';
import Saved from '@/pages/Saved';
import Alerts from '@/pages/Alerts';

import { ProtectedRoute } from '@/components/common';

type AppRoutesProps = {
  searchQuery: string;
};

const AppRoutes = ({ searchQuery }: AppRoutesProps) => {
  const routeConfig = [
    { path: '/', element: <Home searchQuery={searchQuery} /> },
    { path: '/saved', element: <Saved /> },
    { path: '/alerts', element: <Alerts searchQuery={searchQuery} /> },
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
